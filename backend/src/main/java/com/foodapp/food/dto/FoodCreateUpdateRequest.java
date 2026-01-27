package com.foodapp.food.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodCreateUpdateRequest {
  @NotBlank
  @Size(max = 120)
  private String name;

  @NotBlank
  @Size(max = 80)
  private String category;

  @Size(max = 1000)
  private String description;

  @NotNull
  @DecimalMin(value = "0.00", inclusive = false)
  private BigDecimal price;

  @NotNull
  @Min(0)
  private Integer availableQuantity;

  @Size(max = 500)
  private String imageUrl;
}

