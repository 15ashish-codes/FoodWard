package com.foodward.backend.repository;

import com.foodward.backend.model.Donation;
import com.foodward.backend.model.DonationStatus;
import com.foodward.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findByDonorOrderByCreatedAtDesc(User donor);
    List<Donation> findByStatusOrderByCreatedAtDesc(DonationStatus status);
    List<Donation> findByAcceptedByOrderByCreatedAtDesc(User acceptedBy);
    List<Donation> findByDonorAndStatusIn(User donor, List<DonationStatus> statuses);
}
