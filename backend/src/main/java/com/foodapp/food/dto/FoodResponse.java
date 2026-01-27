package com.foodapp.food.dto;

import java.math.BigDecimal;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodResponse {
  private Long id;
  private String name;
  private String category;
  private String description;
  private BigDecimal price;
  private Integer availableQuantity;
  private String imageUrl;
}

