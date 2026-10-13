package com.foodward.backend.model;

public enum DonationStatus {
    LISTED,      // posted by a hotel, visible to nearby orphanages
    ACCEPTED,    // claimed by an orphanage, awaiting pickup
    COMPLETED,   // delivered
    CANCELLED,   // withdrawn by the donor
    MISSED       // expired before anyone accepted / picked up
}
