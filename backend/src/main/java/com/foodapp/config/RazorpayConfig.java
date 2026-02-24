package com.foodapp.config;

import com.razorpay.RazorpayClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;

@Configuration
public class RazorpayConfig {

  @Bean
  public RazorpayClient razorpayClient(
      @Value("${razorpay.key-id:}") String keyId,
      @Value("${razorpay.key-secret:}") String keySecret) throws Exception {
    if (!StringUtils.hasText(keyId) || !StringUtils.hasText(keySecret)) {
      throw new IllegalStateException(
          "Razorpay credentials are missing. Set 'razorpay.key-id' and 'razorpay.key-secret' "
              + "or provide env vars RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.");
    }
    return new RazorpayClient(keyId, keySecret);
  }
}