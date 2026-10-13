package com.foodward.backend.controller;

import com.foodward.backend.dto.DonationDtos.CreateDonationRequest;
import com.foodward.backend.dto.DonationDtos.DonationResponse;
import com.foodward.backend.model.User;
import com.foodward.backend.service.DonationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/donations")
@RequiredArgsConstructor
public class DonationController {

    private final DonationService donationService;

    /** HOTEL: list a new surplus food donation. */
    @PostMapping
    public ResponseEntity<DonationResponse> create(@AuthenticationPrincipal User donor,
                                                     @Valid @RequestBody CreateDonationRequest request) {
        return ResponseEntity.ok(donationService.create(donor, request));
    }

    /** HOTEL: everything this kitchen has ever listed. */
    @GetMapping("/mine")
    public ResponseEntity<List<DonationResponse>> mine(@AuthenticationPrincipal User donor) {
        return ResponseEntity.ok(donationService.myDonations(donor));
    }

    /** HOTEL: currently listed or accepted-but-not-yet-picked-up donations. */
    @GetMapping("/active")
    public ResponseEntity<List<DonationResponse>> active(@AuthenticationPrincipal User donor) {
        return ResponseEntity.ok(donationService.myActive(donor));
    }

    /** ORPHANAGE: everything currently available to claim. */
    @GetMapping("/nearby")
    public ResponseEntity<List<DonationResponse>> nearby() {
        return ResponseEntity.ok(donationService.nearby());
    }

    /** ORPHANAGE: claim a listed donation. */
    @PostMapping("/{id}/accept")
    public ResponseEntity<DonationResponse> accept(@AuthenticationPrincipal User orphanage, @PathVariable Long id) {
        return ResponseEntity.ok(donationService.accept(orphanage, id));
    }

    /** ORPHANAGE: donations this shelter has accepted. */
    @GetMapping("/accepted")
    public ResponseEntity<List<DonationResponse>> accepted(@AuthenticationPrincipal User orphanage) {
        return ResponseEntity.ok(donationService.acceptedBy(orphanage));
    }

    /** ADMIN: every donation on the network. */
    @GetMapping
    public ResponseEntity<List<DonationResponse>> all() {
        return ResponseEntity.ok(donationService.all());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DonationResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(donationService.get(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> cancel(@AuthenticationPrincipal User donor, @PathVariable Long id) {
        donationService.cancel(donor, id);
        return ResponseEntity.ok(Map.of("message", "Donation cancelled"));
    }
}
