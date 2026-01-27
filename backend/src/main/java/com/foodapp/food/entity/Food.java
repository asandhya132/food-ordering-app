package com.foodapp.food.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(
    name = "foods",
    indexes = {
      @Index(name = "idx_foods_category", columnList = "category"),
      @Index(name = "idx_foods_name", columnList = "name")
    })
public class Food {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 120)
  private String name;

  @Column(nullable = false, length = 80)
  private String category;

  @Column(length = 1000)
  private String description;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal price;

  @Column(nullable = false)
  private Integer availableQuantity;

  @Column(length = 500)
  private String imageUrl;
}

