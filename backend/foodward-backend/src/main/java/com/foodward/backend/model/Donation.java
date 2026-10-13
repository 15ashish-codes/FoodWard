package com.foodward.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalTime;

@Entity
@Table(name = "donations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String foodName;

    private String category;

    private String quantity;

    private Integer meals;

    private String freshness;

    private LocalTime cookedTime;

    private LocalTime expiryTime;

    private LocalTime pickupTime;

    private String location;

    @Column(length = 1000)
    private String notes;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false)
    private DonationStatus status = DonationStatus.LISTED;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "donor_id", nullable = false)
    private User donor; // HOTEL

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "accepted_by_id")
    private User acceptedBy; // ORPHANAGE

    @Builder.Default
    private Instant createdAt = Instant.now();

    private Instant acceptedAt;

    private Instant completedAt;
}
