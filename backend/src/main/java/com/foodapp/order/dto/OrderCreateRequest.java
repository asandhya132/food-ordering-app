package com.foodapp.order.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderCreateRequest {

  @NotEmpty
  @Valid
  private List<OrderItemRequest> items;

  @Getter
  @Setter
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class OrderItemRequest {
    @NotNull
    private Long foodId;

    @NotNull
    @Min(1)
    private Integer quantity;
  }
  // order/dto/OrderCreateRequest.java
public static class Customer {
  private String firstName;
  private String lastName;
  private String email;
  private String phone;
  private String address;
}

@NotEmpty @Valid
private List<OrderItemRequest> items;

@Valid
private Customer customer;
}

