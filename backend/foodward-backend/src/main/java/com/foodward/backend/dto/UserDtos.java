package com.foodward.backend.dto;

import com.foodward.backend.model.Role;
import com.foodward.backend.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

public class UserDtos {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserResponse {
        private Long id;
        private String name;
        private String email;
        private String phone;
        private String address;
        private Role role;
        private boolean verified;
        private boolean active;
        private Instant createdAt;

        public static UserResponse from(User u) {
            return UserResponse.builder()
                    .id(u.getId())
                    .name(u.getName())
                    .email(u.getEmail())
                    .phone(u.getPhone())
                    .address(u.getAddress())
                    .role(u.getRole())
                    .verified(u.isVerified())
                    .active(u.isActive())
                    .createdAt(u.getCreatedAt())
                    .build();
        }
    }

    @Data
    public static class UpdateProfileRequest {
        private String name;
        private String phone;
        private String address;
    }
}
