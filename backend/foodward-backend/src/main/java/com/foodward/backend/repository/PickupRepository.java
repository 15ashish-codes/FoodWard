package com.foodward.backend.repository;

import com.foodward.backend.model.Pickup;
import com.foodward.backend.model.PickupStage;
import com.foodward.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PickupRepository extends JpaRepository<Pickup, Long> {
    List<Pickup> findByVolunteerOrderByClaimedAtDesc(User volunteer);
    List<Pickup> findByVolunteerAndStageOrderByClaimedAtDesc(User volunteer, PickupStage stage);
    Optional<Pickup> findByDonationId(Long donationId);
    boolean existsByDonationId(Long donationId);
}
