package com.foodapp.order.service;

import com.foodapp.order.dto.OrderCreateRequest;
import com.foodapp.order.dto.OrderResponse;
import com.foodapp.order.entity.Order;

public interface OrderService {
  OrderResponse createOrder(OrderCreateRequest request);

  /** Creates and persists an order entity (used by payment flow). */
  Order createOrderEntity(OrderCreateRequest request);

  OrderResponse getById(Long id);
}

