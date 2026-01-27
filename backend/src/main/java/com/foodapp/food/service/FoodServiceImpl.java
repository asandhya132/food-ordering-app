package com.foodapp.food.service;

import com.foodapp.common.exception.NotFoundException;
import com.foodapp.food.dto.FoodCreateUpdateRequest;
import com.foodapp.food.dto.FoodResponse;
import com.foodapp.food.entity.Food;
import com.foodapp.food.repository.FoodRepository;
import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class FoodServiceImpl implements FoodService {

  private final FoodRepository foodRepository;

  @Override
  @Transactional(readOnly = true)
  public List<FoodResponse> getAll(String category) {
    List<Food> foods;
    if (category == null || category.isBlank() || "All".equalsIgnoreCase(category)) {
      foods = foodRepository.findAll();
    } else {
      foods = foodRepository.findByCategoryIgnoreCaseOrderByNameAsc(category);
    }
    return foods.stream().map(this::toResponse).toList();
  }

  @Override
  @Transactional(readOnly = true)
  public List<String> getDistinctCategories() {
    return foodRepository.findDistinctCategories().stream()
        .filter(Objects::nonNull)
        .map(String::trim)
        .filter(s -> !s.isBlank())
        .distinct()
        .toList();
  }

  @Override
  @Transactional(readOnly = true)
  public FoodResponse getById(Long id) {
    return toResponse(getEntity(id));
  }

  @Override
  public FoodResponse create(FoodCreateUpdateRequest request) {
    Food food =
        Food.builder()
            .name(request.getName())
            .category(request.getCategory())
            .description(request.getDescription())
            .price(request.getPrice())
            .availableQuantity(request.getAvailableQuantity())
            .imageUrl(request.getImageUrl())
            .build();

    return toResponse(foodRepository.save(food));
  }

  @Override
  public FoodResponse update(Long id, FoodCreateUpdateRequest request) {
    Food food = getEntity(id);
    food.setName(request.getName());
    food.setCategory(request.getCategory());
    food.setDescription(request.getDescription());
    food.setPrice(request.getPrice());
    food.setAvailableQuantity(request.getAvailableQuantity());
    food.setImageUrl(request.getImageUrl());
    return toResponse(foodRepository.save(food));
  }

  @Override
  public void delete(Long id) {
    Food food = getEntity(id);
    foodRepository.delete(food);
  }

  private Food getEntity(Long id) {
    return foodRepository
        .findById(id)
        .orElseThrow(() -> new NotFoundException("Food not found: id=" + id));
  }

  private FoodResponse toResponse(Food food) {
    return FoodResponse.builder()
        .id(food.getId())
        .name(food.getName())
        .category(food.getCategory())
        .description(food.getDescription())
        .price(food.getPrice())
        .availableQuantity(food.getAvailableQuantity())
        .imageUrl(food.getImageUrl())
        .build();
  }
}


