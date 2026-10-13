package com.foodward.backend.service;

import com.foodward.backend.dto.DonationDtos.CreateDonationRequest;
import com.foodward.backend.dto.DonationDtos.DonationResponse;
import com.foodward.backend.exception.BadRequestException;
import com.foodward.backend.exception.ResourceNotFoundException;
import com.foodward.backend.model.Donation;
import com.foodward.backend.model.DonationStatus;
import com.foodward.backend.model.User;
import com.foodward.backend.repository.DonationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DonationService {

    private final DonationRepository donationRepository;
    private final NotificationService notificationService;

    public DonationResponse create(User donor, CreateDonationRequest req) {
        Donation donation = Donation.builder()
                .foodName(req.getFoodName())
                .category(req.getCategory())
                .quantity(req.getQuantity())
                .meals(req.getMeals())
                .freshness(req.getFreshness())
                .cookedTime(req.getCookedTime())
                .expiryTime(req.getExpiryTime())
                .pickupTime(req.getPickupTime())
                .location(req.getLocation())
                .notes(req.getNotes())
                .status(DonationStatus.LISTED)
                .donor(donor)
                .build();

        donationRepository.save(donation);
        return DonationResponse.from(donation);
    }

    public List<DonationResponse> myDonations(User donor) {
        return donationRepository.findByDonorOrderByCreatedAtDesc(donor).stream()
                .map(DonationResponse::from).toList();
    }

    public List<DonationResponse> myActive(User donor) {
        return donationRepository.findByDonorAndStatusIn(donor, List.of(DonationStatus.LISTED, DonationStatus.ACCEPTED))
                .stream().map(DonationResponse::from).toList();
    }

    /** Listings any orphanage can currently claim. In production, filter/sort by geo distance from the requester. */
    public List<DonationResponse> nearby() {
        return donationRepository.findByStatusOrderByCreatedAtDesc(DonationStatus.LISTED).stream()
                .map(DonationResponse::from).toList();
    }

    public List<DonationResponse> acceptedBy(User orphanage) {
        return donationRepository.findByAcceptedByOrderByCreatedAtDesc(orphanage).stream()
                .map(DonationResponse::from).toList();
    }

    public List<DonationResponse> all() {
        return donationRepository.findAll().stream().map(DonationResponse::from).toList();
    }

    public DonationResponse get(Long id) {
        return DonationResponse.from(findOrThrow(id));
    }

    @Transactional
    public DonationResponse accept(User orphanage, Long donationId) {
        Donation donation = findOrThrow(donationId);

        if (donation.getStatus() != DonationStatus.LISTED) {
            throw new BadRequestException("This donation is no longer available");
        }

        donation.setStatus(DonationStatus.ACCEPTED);
        donation.setAcceptedBy(orphanage);
        donation.setAcceptedAt(Instant.now());
        donationRepository.save(donation);

        notificationService.notify(
                donation.getDonor(),
                "Donation accepted",
                orphanage.getName() + " accepted your \"" + donation.getFoodName() + "\" listing.",
                "donation"
        );

        return DonationResponse.from(donation);
    }

    @Transactional
    public void markCompleted(Donation donation) {
        donation.setStatus(DonationStatus.COMPLETED);
        donation.setCompletedAt(Instant.now());
        donationRepository.save(donation);

        notificationService.notify(donation.getDonor(), "Pickup completed",
                "\"" + donation.getFoodName() + "\" was delivered to " + donation.getAcceptedBy().getName() + ".", "pickup");
        notificationService.notify(donation.getAcceptedBy(), "Delivery arrived",
                "\"" + donation.getFoodName() + "\" has been delivered to you.", "pickup");
    }

    @Transactional
    public void cancel(User donor, Long donationId) {
        Donation donation = findOrThrow(donationId);
        if (!donation.getDonor().getId().equals(donor.getId())) {
            throw new BadRequestException("You can only cancel your own donations");
        }
        if (donation.getStatus() != DonationStatus.LISTED) {
            throw new BadRequestException("Only unclaimed donations can be cancelled");
        }
        donation.setStatus(DonationStatus.CANCELLED);
        donationRepository.save(donation);
    }

    Donation findOrThrow(Long id) {
        return donationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found"));
    }
}
