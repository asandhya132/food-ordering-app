import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './api.config';
import { OrderCreateRequest, OrderResponse } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly baseUrl = `${environment.apiBaseUrl}/orders`;

  constructor(private http: HttpClient) {}

  createOrder(payload: OrderCreateRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.baseUrl, payload);
  }

  getById(orderId: number): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.baseUrl}/${orderId}`);
  }
}

