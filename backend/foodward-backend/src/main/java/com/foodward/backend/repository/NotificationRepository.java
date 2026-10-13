package com.foodward.backend.repository;

import com.foodward.backend.model.Notification;
import com.foodward.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserOrderByCreatedAtDesc(User user);
    long countByUserAndUnreadTrue(User user);
}
