// backend/src/main/java/com/foodapp/payment/dto/RazorpayOrderCreateResponse.java
package com.foodapp.payment.dto;

import java.math.BigDecimal;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RazorpayOrderCreateResponse {
  private Long orderId;          // internal order id
  private String razorpayOrderId;
  private BigDecimal amount;
  private String currency;
  private String keyId;          // public key for frontend checkout
}