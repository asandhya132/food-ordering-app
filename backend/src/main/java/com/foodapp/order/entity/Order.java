package com.foodapp.order.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "orders")
public class Order {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private OffsetDateTime createdAt;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal totalAmount;

  /**
   * Backward-compatible: existing DB rows may have NULL after schema update.
   * We set a default in {@link #prePersist()} for new rows and allow NULL at DB level
   * until a one-time backfill is applied.
   */
  @Column(length = 20)
  private String status; // CREATED, PAID, FAILED

@Column(length = 100)
private String razorpayOrderId;

@Column(length = 100)
private String razorpayPaymentId;

@Column(length = 255)
private String razorpaySignature;

  @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
  @Builder.Default
  private List<OrderItem> items = new ArrayList<>();

  @PrePersist
  public void prePersist() {
    if (createdAt == null) {
      createdAt = OffsetDateTime.now();
    }
    if (status == null || status.isBlank()) {
      status = "CREATED";
    }
  }
}

