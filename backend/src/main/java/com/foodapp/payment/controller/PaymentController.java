// backend/src/main/java/com/foodapp/payment/controller/PaymentController.java
package com.foodapp.payment.controller;

import com.foodapp.order.dto.OrderCreateRequest;
import com.foodapp.order.entity.Order;
import com.foodapp.order.service.OrderService;
import com.foodapp.payment.dto.RazorpayOrderCreateResponse;
import com.foodapp.payment.dto.RazorpayVerifyRequest;
import com.foodapp.payment.service.RazorpayPaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments/razorpay")
@RequiredArgsConstructor
public class PaymentController {

  private final OrderService orderService;
  private final RazorpayPaymentService paymentService;

  // Step 3: create app order + Razorpay order
  @PostMapping("/order")
  @ResponseStatus(HttpStatus.CREATED)
  public RazorpayOrderCreateResponse createOrder(@Valid @RequestBody OrderCreateRequest request) {
    try {
      Order order = orderService.createOrderEntity(request);
      return paymentService.createRazorpayOrder(order);
    } catch (RuntimeException e) {
      throw e;
    } catch (Exception e) {
      throw new RuntimeException(
          "Payment order failed: " + e.getClass().getSimpleName() + " - " + (e.getMessage() != null ? e.getMessage() : "no message"),
          e);
    }
  }

  // Step 7: verify payment and mark order paid
  @PostMapping("/verify")
  @ResponseStatus(HttpStatus.OK)
  public void verify(@Valid @RequestBody RazorpayVerifyRequest request) {
    paymentService.verifyAndMarkPaid(request);
  }
}