// backend/src/main/java/com/foodapp/payment/dto/RazorpayVerifyRequest.java
package com.foodapp.payment.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RazorpayVerifyRequest {
  private Long orderId;
  private String razorpayOrderId;
  private String razorpayPaymentId;
  private String razorpaySignature;
}