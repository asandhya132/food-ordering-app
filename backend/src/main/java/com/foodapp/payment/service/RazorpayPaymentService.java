// backend/src/main/java/com/foodapp/payment/service/RazorpayPaymentService.java
package com.foodapp.payment.service;

import com.foodapp.common.exception.BadRequestException;
import com.foodapp.common.exception.NotFoundException;
import com.foodapp.order.entity.Order;
import com.foodapp.order.repository.OrderRepository;
import com.foodapp.payment.dto.RazorpayOrderCreateResponse;
import com.foodapp.payment.dto.RazorpayVerifyRequest;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RazorpayPaymentService {

  private final RazorpayClient razorpayClient;
  private final OrderRepository orderRepository;

  @Value("${razorpay.key-id}")
  private String keyId;

  @Value("${razorpay.key-secret}")
  private String keySecret;

  @Transactional
  public RazorpayOrderCreateResponse createRazorpayOrder(Order order) throws Exception {
    BigDecimal amount = order.getTotalAmount();
    int amountInPaise = amount.multiply(BigDecimal.valueOf(100)).intValueExact();

    Map<String, Object> options = new HashMap<>();
    options.put("amount", amountInPaise);
    options.put("currency", "INR");
    options.put("receipt", "order_" + order.getId());
    options.put("payment_capture", 1);

    com.razorpay.Order razorpayOrder = razorpayClient.orders.create(new JSONObject(options));
    String razorOrderId = razorpayOrder.get("id");

    order.setRazorpayOrderId(razorOrderId);
    order.setStatus("CREATED");
    orderRepository.save(order);

    return RazorpayOrderCreateResponse.builder()
        .orderId(order.getId())
        .razorpayOrderId(razorOrderId)
        .amount(amount)
        .currency("INR")
        .keyId(keyId)
        .build();
  }

  @Transactional
  public void verifyAndMarkPaid(RazorpayVerifyRequest request) throws Exception {

    Order order = orderRepository.findById(request.getOrderId())
        .orElseThrow(() ->
            new NotFoundException("Order not found: id=" + request.getOrderId()));

    JSONObject attributes = new JSONObject();
    attributes.put("razorpay_order_id", request.getRazorpayOrderId());
    attributes.put("razorpay_payment_id", request.getRazorpayPaymentId());
    attributes.put("razorpay_signature", request.getRazorpaySignature());

    boolean isValid = Utils.verifyPaymentSignature(attributes, keySecret);

    if (!isValid) {
      throw new BadRequestException("Invalid Razorpay signature");
    }

    order.setRazorpayOrderId(request.getRazorpayOrderId());
    order.setRazorpayPaymentId(request.getRazorpayPaymentId());
    order.setRazorpaySignature(request.getRazorpaySignature());
    order.setStatus("PAID");

    orderRepository.save(order);
  }
}