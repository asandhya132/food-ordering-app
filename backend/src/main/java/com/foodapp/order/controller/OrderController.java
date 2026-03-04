package com.foodapp.order.controller;

import com.foodapp.order.dto.OrderCreateRequest;
import com.foodapp.order.dto.OrderResponse;
import com.foodapp.order.service.OrderService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Validated
public class OrderController {

  private final OrderService orderService;

  @GetMapping("/{id}")
  public OrderResponse getById(@PathVariable @NotNull @Min(1) Long id) {
    return orderService.getById(id);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public OrderResponse create(@Valid @RequestBody OrderCreateRequest request) {
    return orderService.createOrder(request);
  }
}

