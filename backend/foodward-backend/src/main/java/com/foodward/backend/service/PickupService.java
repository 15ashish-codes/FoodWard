package com.foodward.backend.service;

import com.foodward.backend.dto.PickupDtos.PickupResponse;
import com.foodward.backend.exception.BadRequestException;
import com.foodward.backend.exception.ResourceNotFoundException;
import com.foodward.backend.model.Donation;
import com.foodward.backend.model.DonationStatus;
import com.foodward.backend.model.Pickup;
import com.foodward.backend.model.PickupStage;
import com.foodward.backend.model.User;
import com.foodward.backend.repository.DonationRepository;
import com.foodward.backend.repository.PickupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PickupService {

    private final PickupRepository pickupRepository;
    private final DonationRepository donationRepository;
    private final DonationService donationService;
    private final NotificationService notificationService;

    /** Accepted donations that no volunteer has claimed yet. */
    public List<com.foodward.backend.dto.DonationDtos.DonationResponse> available() {
        return donationRepository.findByStatusOrderByCreatedAtDesc(DonationStatus.ACCEPTED).stream()
                .filter(d -> !pickupRepository.existsByDonationId(d.getId()))
                .map(com.foodward.backend.dto.DonationDtos.DonationResponse::from)
                .toList();
    }

    @Transactional
    public PickupResponse claim(User volunteer, Long donationId) {
        Donation donation = donationService.findOrThrow(donationId);

        if (donation.getStatus() != DonationStatus.ACCEPTED) {
            throw new BadRequestException("This donation isn't ready for pickup yet");
        }
        if (pickupRepository.existsByDonationId(donationId)) {
            throw new BadRequestException("This pickup has already been claimed");
        }

        Pickup pickup = Pickup.builder()
                .donation(donation)
                .volunteer(volunteer)
                .stage(PickupStage.CLAIMED)
                .build();
        pickupRepository.save(pickup);

        notificationService.notify(donation.getDonor(), "Pickup claimed",
                volunteer.getName() + " is on the way to collect \"" + donation.getFoodName() + "\".", "pickup");
        notificationService.notify(donation.getAcceptedBy(), "Volunteer assigned",
                volunteer.getName() + " will deliver \"" + donation.getFoodName() + "\".", "pickup");

        return PickupResponse.from(pickup);
    }

    @Transactional
    public PickupResponse updateStage(User volunteer, Long pickupId, PickupStage newStage) {
        Pickup pickup = pickupRepository.findById(pickupId)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup not found"));

        if (!pickup.getVolunteer().getId().equals(volunteer.getId())) {
            throw new BadRequestException("You can only update your own pickups");
        }
        if (newStage.ordinal() < pickup.getStage().ordinal()) {
            throw new BadRequestException("Pickup stage cannot move backwards");
        }

        pickup.setStage(newStage);
        if (newStage == PickupStage.DELIVERED) {
            pickup.setDeliveredAt(Instant.now());
            donationService.markCompleted(pickup.getDonation());
        }
        pickupRepository.save(pickup);
        return PickupResponse.from(pickup);
    }

    public List<PickupResponse> mine(User volunteer) {
        return pickupRepository.findByVolunteerOrderByClaimedAtDesc(volunteer).stream()
                .map(PickupResponse::from).toList();
    }

    public List<PickupResponse> completed(User volunteer) {
        return pickupRepository.findByVolunteerAndStageOrderByClaimedAtDesc(volunteer, PickupStage.DELIVERED).stream()
                .map(PickupResponse::from).toList();
    }
}
