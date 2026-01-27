package com.foodapp.order.controller;

import com.foodapp.order.dto.OrderCreateRequest;
import com.foodapp.order.dto.OrderResponse;
import com.foodapp.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

  private final OrderService orderService;

  @GetMapping("/{id}")
  public OrderResponse getById(@PathVariable Long id) {
    return orderService.getById(id);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public OrderResponse create(@Valid @RequestBody OrderCreateRequest request) {
    return orderService.createOrder(request);
  }
}

