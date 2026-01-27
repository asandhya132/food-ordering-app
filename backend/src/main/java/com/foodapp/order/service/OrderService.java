package com.foodapp.order.service;

import com.foodapp.order.dto.OrderCreateRequest;
import com.foodapp.order.dto.OrderResponse;

public interface OrderService {
  OrderResponse createOrder(OrderCreateRequest request);

  OrderResponse getById(Long id);
}

