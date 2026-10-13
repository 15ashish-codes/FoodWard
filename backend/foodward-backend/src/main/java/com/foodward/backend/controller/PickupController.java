package com.foodward.backend.controller;

import com.foodward.backend.dto.PickupDtos.PickupResponse;
import com.foodward.backend.dto.PickupDtos.UpdateStageRequest;
import com.foodward.backend.model.User;
import com.foodward.backend.service.PickupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pickups")
@RequiredArgsConstructor
public class PickupController {

    private final PickupService pickupService;

    /** VOLUNTEER: accepted donations nobody has claimed for pickup yet. */
    @GetMapping("/available")
    public ResponseEntity<List<com.foodward.backend.dto.DonationDtos.DonationResponse>> available() {
        return ResponseEntity.ok(pickupService.available());
    }

    /** VOLUNTEER: claim a route. */
    @PostMapping("/{donationId}/claim")
    public ResponseEntity<PickupResponse> claim(@AuthenticationPrincipal User volunteer, @PathVariable Long donationId) {
        return ResponseEntity.ok(pickupService.claim(volunteer, donationId));
    }

    /** VOLUNTEER: advance a claimed pickup through its stages. */
    @PatchMapping("/{id}/status")
    public ResponseEntity<PickupResponse> updateStatus(@AuthenticationPrincipal User volunteer,
                                                         @PathVariable Long id,
                                                         @Valid @RequestBody UpdateStageRequest request) {
        return ResponseEntity.ok(pickupService.updateStage(volunteer, id, request.getStage()));
    }

    /** VOLUNTEER: everything this volunteer has claimed, any stage. */
    @GetMapping("/mine")
    public ResponseEntity<List<PickupResponse>> mine(@AuthenticationPrincipal User volunteer) {
        return ResponseEntity.ok(pickupService.mine(volunteer));
    }

    /** VOLUNTEER: delivered routes only. */
    @GetMapping("/completed")
    public ResponseEntity<List<PickupResponse>> completed(@AuthenticationPrincipal User volunteer) {
        return ResponseEntity.ok(pickupService.completed(volunteer));
    }
}
