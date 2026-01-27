package com.foodapp.order.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {
  private Long id;
  private OffsetDateTime createdAt;
  private BigDecimal totalAmount;
  private List<OrderItemResponse> items;

  @Getter
  @Setter
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class OrderItemResponse {
    private Long id;
    private Long foodId;
    private String foodName;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal lineTotal;
  }
}

