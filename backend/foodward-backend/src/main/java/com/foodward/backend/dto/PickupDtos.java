package com.foodward.backend.dto;

import com.foodward.backend.model.Pickup;
import com.foodward.backend.model.PickupStage;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

public class PickupDtos {

    @Data
    public static class UpdateStageRequest {
        @NotNull
        private PickupStage stage;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PickupResponse {
        private Long id;
        private DonationDtos.DonationResponse donation;
        private UserDtos.UserResponse volunteer;
        private PickupStage stage;
        private Instant claimedAt;
        private Instant deliveredAt;

        public static PickupResponse from(Pickup p) {
            return PickupResponse.builder()
                    .id(p.getId())
                    .donation(DonationDtos.DonationResponse.from(p.getDonation()))
                    .volunteer(UserDtos.UserResponse.from(p.getVolunteer()))
                    .stage(p.getStage())
                    .claimedAt(p.getClaimedAt())
                    .deliveredAt(p.getDeliveredAt())
                    .build();
        }
    }
}
