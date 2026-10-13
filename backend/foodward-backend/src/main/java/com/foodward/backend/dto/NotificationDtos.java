package com.foodward.backend.dto;

import com.foodward.backend.model.Notification;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

public class NotificationDtos {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NotificationResponse {
        private Long id;
        private String title;
        private String body;
        private String type;
        private boolean unread;
        private Instant createdAt;

        public static NotificationResponse from(Notification n) {
            return NotificationResponse.builder()
                    .id(n.getId())
                    .title(n.getTitle())
                    .body(n.getBody())
                    .type(n.getType())
                    .unread(n.isUnread())
                    .createdAt(n.getCreatedAt())
                    .build();
        }
    }
}
