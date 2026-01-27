package com.foodapp.config;

import com.foodapp.food.entity.Food;
import com.foodapp.food.repository.FoodRepository;
import java.math.BigDecimal;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {

  private final FoodRepository foodRepository;

  @Bean
  CommandLineRunner seedFoods() {
    return args -> {
      if (foodRepository.count() > 0) {
        return;
      }

      foodRepository.save(
          Food.builder()
              .name("Tomato Pickle")
              .category("Pickles")
              .description("Spicy, tangy tomato pickle made with traditional spices.")
              .price(new BigDecimal("80.00"))
              .availableQuantity(50)
              .imageUrl(
                  "https://images.unsplash.com/photo-1604908177225-6f2d5d490f9f?auto=format&fit=crop&w=800&q=60")
              .build());

      foodRepository.save(
          Food.builder()
              .name("Paneer Butter Masala")
              .category("Curries")
              .description("Creamy paneer curry with butter and mild spices.")
              .price(new BigDecimal("180.00"))
              .availableQuantity(30)
              .imageUrl(
                  "https://images.unsplash.com/photo-1604908554182-686f4f1a3a1b?auto=format&fit=crop&w=800&q=60")
              .build());

      foodRepository.save(
          Food.builder()
              .name("Veg Biryani")
              .category("Rice")
              .description("Aromatic basmati rice cooked with vegetables and spices.")
              .price(new BigDecimal("150.00"))
              .availableQuantity(40)
              .imageUrl(
                  "https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?auto=format&fit=crop&w=800&q=60")
              .build());
    };
  }
}



