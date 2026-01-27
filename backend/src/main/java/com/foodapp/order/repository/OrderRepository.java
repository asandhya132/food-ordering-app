package com.foodapp.order.repository;

import com.foodapp.order.entity.Order;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;

public interface OrderRepository extends JpaRepository<Order, Long> {
  @EntityGraph(attributePaths = {"items", "items.food"})
  Optional<Order> findWithItemsById(Long id);
}

