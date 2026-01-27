package com.foodapp.food.service;

import com.foodapp.food.dto.FoodCreateUpdateRequest;
import com.foodapp.food.dto.FoodResponse;
import java.util.List;

public interface FoodService {
  List<FoodResponse> getAll(String category);

  FoodResponse getById(Long id);

  FoodResponse create(FoodCreateUpdateRequest request);

  FoodResponse update(Long id, FoodCreateUpdateRequest request);

  void delete(Long id);

  List<String> getDistinctCategories();
}

