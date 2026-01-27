package com.foodapp.order.service;

import com.foodapp.common.exception.BadRequestException;
import com.foodapp.common.exception.NotFoundException;
import com.foodapp.food.entity.Food;
import com.foodapp.food.repository.FoodRepository;
import com.foodapp.order.dto.OrderCreateRequest;
import com.foodapp.order.dto.OrderResponse;
import com.foodapp.order.entity.Order;
import com.foodapp.order.entity.OrderItem;
import com.foodapp.order.repository.OrderRepository;
import java.math.BigDecimal;
import java.util.ArrayList;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {

  private final FoodRepository foodRepository;
  private final OrderRepository orderRepository;

  @Override
  public OrderResponse createOrder(OrderCreateRequest request) {
    if (request.getItems() == null || request.getItems().isEmpty()) {
      throw new BadRequestException("Order must contain at least one item");
    }

    Order order = Order.builder().items(new ArrayList<>()).totalAmount(BigDecimal.ZERO).build();

    BigDecimal total = BigDecimal.ZERO;

    for (OrderCreateRequest.OrderItemRequest reqItem : request.getItems()) {
      Food food =
          foodRepository
              .findById(reqItem.getFoodId())
              .orElseThrow(
                  () -> new NotFoundException("Food not found: id=" + reqItem.getFoodId()));

      int requestedQty = reqItem.getQuantity();
      if (food.getAvailableQuantity() < requestedQty) {
        throw new BadRequestException(
            "Insufficient stock for food id="
                + food.getId()
                + " (available="
                + food.getAvailableQuantity()
                + ", requested="
                + requestedQty
                + ")");
      }

      BigDecimal unitPrice = food.getPrice();
      BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(requestedQty));

      OrderItem item =
          OrderItem.builder()
              .order(order)
              .food(food)
              .quantity(requestedQty)
              .unitPrice(unitPrice)
              .lineTotal(lineTotal)
              .build();

      order.getItems().add(item);
      total = total.add(lineTotal);

      // reduce stock
      food.setAvailableQuantity(food.getAvailableQuantity() - requestedQty);
      foodRepository.save(food);
    }

    order.setTotalAmount(total);
    Order saved = orderRepository.save(order);
    return toResponse(saved);
  }

  @Override
  @Transactional(readOnly = true)
  public OrderResponse getById(Long id) {
    Order order =
        orderRepository
            .findWithItemsById(id)
            .orElseThrow(() -> new NotFoundException("Order not found: id=" + id));
    return toResponse(order);
  }

  private OrderResponse toResponse(Order order) {
    return OrderResponse.builder()
        .id(order.getId())
        .createdAt(order.getCreatedAt())
        .totalAmount(order.getTotalAmount())
        .items(
            order.getItems().stream()
                .map(
                    i ->
                        OrderResponse.OrderItemResponse.builder()
                            .id(i.getId())
                            .foodId(i.getFood().getId())
                            .foodName(i.getFood().getName())
                            .quantity(i.getQuantity())
                            .unitPrice(i.getUnitPrice())
                            .lineTotal(i.getLineTotal())
                            .build())
                .toList())
        .build();
  }
}

