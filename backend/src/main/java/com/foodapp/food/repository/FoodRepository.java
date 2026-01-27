package com.foodapp.food.repository;

import com.foodapp.food.entity.Food;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface FoodRepository extends JpaRepository<Food, Long> {

  // DISTINCT categories from foods table only (no category table)
  @Query("select distinct f.category from Food f where f.category is not null order by f.category asc")
  List<String> findDistinctCategories();

  List<Food> findByCategoryIgnoreCaseOrderByNameAsc(String category);
}

