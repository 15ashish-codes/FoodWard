package com.foodward.backend.service;

import com.foodward.backend.dto.NotificationDtos.NotificationResponse;
import com.foodward.backend.exception.ResourceNotFoundException;
import com.foodward.backend.model.Notification;
import com.foodward.backend.model.User;
import com.foodward.backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public void notify(User user, String title, String body, String type) {
        Notification n = Notification.builder()
                .user(user)
                .title(title)
                .body(body)
                .type(type)
                .build();
        notificationRepository.save(n);
    }

    public List<NotificationResponse> listFor(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(NotificationResponse::from)
                .toList();
    }

    public long unreadCount(User user) {
        return notificationRepository.countByUserAndUnreadTrue(user);
    }

    public void markRead(User user, Long id) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        if (!n.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Notification not found");
        }
        n.setUnread(false);
        notificationRepository.save(n);
    }

    public void markAllRead(User user) {
        List<Notification> all = notificationRepository.findByUserOrderByCreatedAtDesc(user);
        all.forEach(n -> n.setUnread(false));
        notificationRepository.saveAll(all);
    }
}
