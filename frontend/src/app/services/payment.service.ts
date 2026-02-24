// frontend/src/app/services/payment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './api.config';
import { OrderCreateRequest } from '../models/order.model';
import { Observable } from 'rxjs';

export interface RazorpayOrderCreateResponse {
  orderId: number;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface RazorpayVerifyRequest {
  orderId: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly baseUrl = `${environment.apiBaseUrl}/payments/razorpay`;

  constructor(private http: HttpClient) {}

  createOrder(payload: OrderCreateRequest): Observable<RazorpayOrderCreateResponse> {
    return this.http.post<RazorpayOrderCreateResponse>(`${this.baseUrl}/order`, payload);
  }

  verifyPayment(payload: RazorpayVerifyRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/verify`, payload);
  }
}