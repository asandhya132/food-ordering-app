package com.foodapp.food.controller;

import com.foodapp.food.dto.FoodCreateUpdateRequest;
import com.foodapp.food.dto.FoodResponse;
import com.foodapp.food.service.FoodService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/foods")
@RequiredArgsConstructor
public class FoodController {

  private final FoodService foodService;

  @GetMapping
  public List<FoodResponse> getAll(
      @RequestParam(value = "category", required = false) String category) {
    return foodService.getAll(category);
  }

  @GetMapping("/categories")
  public List<String> getCategories() {
    return foodService.getDistinctCategories();
  }

  @GetMapping("/{id}")
  public FoodResponse getById(@PathVariable Long id) {
    return foodService.getById(id);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public FoodResponse create(@Valid @RequestBody FoodCreateUpdateRequest request) {
    return foodService.create(request);
  }

  @PutMapping("/{id}")
  public FoodResponse update(
      @PathVariable Long id, @Valid @RequestBody FoodCreateUpdateRequest request) {
    return foodService.update(id, request);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) {
    foodService.delete(id);
  }
}

