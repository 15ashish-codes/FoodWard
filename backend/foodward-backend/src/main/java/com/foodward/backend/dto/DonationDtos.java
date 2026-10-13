package com.foodward.backend.dto;

import com.foodward.backend.model.Donation;
import com.foodward.backend.model.DonationStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalTime;

public class DonationDtos {

    @Data
    public static class CreateDonationRequest {
        @NotBlank
        private String foodName;
        private String category;
        private String quantity;

        @NotNull @Positive
        private Integer meals;

        private String freshness;
        private LocalTime cookedTime;
        private LocalTime expiryTime;
        private LocalTime pickupTime;

        @NotBlank
        private String location;

        private String notes;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DonationResponse {
        private Long id;
        private String foodName;
        private String category;
        private String quantity;
        private Integer meals;
        private String freshness;
        private LocalTime cookedTime;
        private LocalTime expiryTime;
        private LocalTime pickupTime;
        private String location;
        private String notes;
        private DonationStatus status;
        private UserDtos.UserResponse donor;
        private UserDtos.UserResponse acceptedBy;
        private Instant createdAt;
        private Instant acceptedAt;
        private Instant completedAt;

        public static DonationResponse from(Donation d) {
            return DonationResponse.builder()
                    .id(d.getId())
                    .foodName(d.getFoodName())
                    .category(d.getCategory())
                    .quantity(d.getQuantity())
                    .meals(d.getMeals())
                    .freshness(d.getFreshness())
                    .cookedTime(d.getCookedTime())
                    .expiryTime(d.getExpiryTime())
                    .pickupTime(d.getPickupTime())
                    .location(d.getLocation())
                    .notes(d.getNotes())
                    .status(d.getStatus())
                    .donor(d.getDonor() != null ? UserDtos.UserResponse.from(d.getDonor()) : null)
                    .acceptedBy(d.getAcceptedBy() != null ? UserDtos.UserResponse.from(d.getAcceptedBy()) : null)
                    .createdAt(d.getCreatedAt())
                    .acceptedAt(d.getAcceptedAt())
                    .completedAt(d.getCompletedAt())
                    .build();
        }
    }
}
