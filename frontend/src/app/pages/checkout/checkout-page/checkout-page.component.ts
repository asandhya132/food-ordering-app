import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { CartItem } from '../../../models/cart.model';
import { PaymentService } from '../../../services/payment.service';
import { RazorpayOrderCreateResponse } from '../../../services/payment.service';
import { RazorpayVerifyRequest } from '../../../services/payment.service';

declare var Razorpay: any;

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html'
})
export class CheckoutPageComponent implements OnInit {
  form!: FormGroup;

  items: CartItem[] = [];
  total = 0;

  placing = false;
  error: string | null = null;

  paymentMethods = ['Razorpay', 'Credit Card', 'Debit Card', 'UPI'];

  constructor(
    private fb: FormBuilder,
    private cart: CartService,
    private paymentApi: PaymentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Build reactive form
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{10}$/)]
      ],
      address: ['', [Validators.required, Validators.maxLength(500)]],
      paymentMethod: ['Razorpay', Validators.required],
      // Optional payment-specific fields; validators are applied dynamically
      cardName: [''],
      cardNumber: [''],
      cardExpiry: [''],
      cardCvv: [''],
      upiId: ['']
    });

    // Dynamically manage validators based on selected payment method.
    this.form
      .get('paymentMethod')!
      .valueChanges.subscribe((method: string) => this.configurePaymentValidators(method));
    // Initialize validators for default method
    this.configurePaymentValidators(this.form.get('paymentMethod')!.value);

    // Load cart snapshot
    this.items = this.cart.getSnapshot();
    this.cart.totalPrice$.subscribe((t) => (this.total = t));

    if (!this.items.length) {
      // No items -> redirect back to cart
      this.router.navigate(['/cart']);
    }
  }

  get f() {
    return this.form.controls;
  }

  /**
   * Apply validators to payment-specific fields depending on the selected method.
   * Razorpay uses its own checkout, so card/UPI inputs are optional in this demo.
   */
  private configurePaymentValidators(method: string): void {
    const cardName = this.form.get('cardName')!;
    const cardNumber = this.form.get('cardNumber')!;
    const cardExpiry = this.form.get('cardExpiry')!;
    const cardCvv = this.form.get('cardCvv')!;
    const upiId = this.form.get('upiId')!;

    // Clear all validators by default
    cardName.clearValidators();
    cardNumber.clearValidators();
    cardExpiry.clearValidators();
    cardCvv.clearValidators();
    upiId.clearValidators();

    if (method === 'Credit Card') {
      cardName.setValidators([Validators.required, Validators.maxLength(50)]);
      cardNumber.setValidators([Validators.required, Validators.pattern(/^[0-9]{16}$/)]);
      cardExpiry.setValidators([Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]);
      cardCvv.setValidators([Validators.required, Validators.pattern(/^[0-9]{3}$/)]);
    } else if (method === 'UPI') {
      upiId.setValidators([Validators.required, Validators.maxLength(60)]);
    }

    cardName.updateValueAndValidity();
    cardNumber.updateValueAndValidity();
    cardExpiry.updateValueAndValidity();
    cardCvv.updateValueAndValidity();
    upiId.updateValueAndValidity();
  }

  proceedToPay(): void {
    this.error = null;
    if (this.form.invalid || !this.items.length || !this.isPaymentSectionValid()) {
      this.form.markAllAsTouched();
      return;
    }

    this.placing = true;

    const customer = {
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName,
      email: this.form.value.email,
      phone: this.form.value.phone,
      address: this.form.value.address
    };

    const payload = {
      items: this.items.map((i) => ({
        foodId: i.food.id,
        quantity: i.quantity
      })),
      customer,
      totalAmount: this.total
    };

    // Call backend Create Order + Razorpay Order API
    this.paymentApi.createOrder(payload).subscribe({
      next: (res: RazorpayOrderCreateResponse) => {
        this.placing = false;
        this.openRazorpayCheckout(res, customer);
      },
      error: (err: any) => {
        console.error('Create payment order failed', err);
        this.placing = false;
        this.error = 'Failed to create payment order. Please try again.';
      }
    });
  }

  /**
   * Custom guard to ensure that the required payment fields for the selected
   * method are valid before enabling the pay action.
   */
  isPaymentSectionValid(): boolean {
    const method = this.form.get('paymentMethod')!.value;
    if (!method) {
      return false;
    }

    if (method === 'Credit Card') {
      return (
        this.form.get('cardName')!.valid &&
        this.form.get('cardNumber')!.valid &&
        this.form.get('cardExpiry')!.valid &&
        this.form.get('cardCvv')!.valid
      );
    }

    if (method === 'UPI') {
      return this.form.get('upiId')!.valid;
    }

    // For Razorpay / other methods, no extra fields are required here.
    return true;
  }

  private openRazorpayCheckout(order: RazorpayOrderCreateResponse, customer: any): void {
    const options: any = {
      key: order.keyId,
      amount: order.amount * 100, // paise
      currency: order.currency,
      name: 'Food Ordering App',
      description: `Order #${order.orderId}`,
      order_id: order.razorpayOrderId,
      prefill: {
        name: `${customer.firstName} ${customer.lastName}`,
        email: customer.email,
        contact: customer.phone
      },
      notes: {
        address: customer.address
      },
      theme: { color: '#7c5cff' },
      handler: (response: any) => {
        const verifyPayload: RazorpayVerifyRequest = {
          orderId: order.orderId,
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature
        };
        this.verifyPaymentAndRedirect(verifyPayload);
      },
      modal: {
        ondismiss: () => {
          console.log('Payment popup closed');
        }
      }
    };

    const rz = new Razorpay(options);
    rz.open();
  }

  private verifyPaymentAndRedirect(payload: RazorpayVerifyRequest): void {
    this.paymentApi.verifyPayment(payload).subscribe({
      next: () => {
        this.cart.clear();
        this.router.navigate(['/order-summary', payload.orderId]);
      },
      error: (err: any) => {
        console.error('Payment verification failed', err);
        this.error = 'Payment verification failed. Please contact support.';
      }
    });
  }
}