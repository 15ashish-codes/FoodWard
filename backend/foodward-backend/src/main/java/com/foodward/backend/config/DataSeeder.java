package com.foodward.backend.config;

import com.foodward.backend.model.Donation;
import com.foodward.backend.model.DonationStatus;
import com.foodward.backend.model.Role;
import com.foodward.backend.model.User;
import com.foodward.backend.repository.DonationRepository;
import com.foodward.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds a handful of demo accounts + one sample donation on startup so the
 * frontend has something to log into immediately. Controlled by
 * app.seed.enabled (default true); set to false for a clean production DB.
 *
 * Demo password for every seeded account: Password123
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DonationRepository donationRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.enabled}")
    private boolean enabled;

    @Override
    public void run(String... args) {
        if (!enabled || userRepository.count() > 0) {
            return;
        }

        String demoPassword = passwordEncoder.encode("Password123");

        User admin = userRepository.save(User.builder()
                .name("Foodward Admin")
                .email("admin@foodward.org")
                .password(demoPassword)
                .phone("+1 (555) 099-1002")
                .role(Role.ADMIN)
                .verified(true)
                .active(true)
                .build());

        User hotel = userRepository.save(User.builder()
                .name("The Meridian Hotel")
                .email("kitchen@meridianhotel.com")
                .password(demoPassword)
                .phone("+1 (555) 019-2201")
                .address("220 Harbor Ave, Suite 4")
                .role(Role.HOTEL)
                .verified(true)
                .active(true)
                .build());

        User orphanage = userRepository.save(User.builder()
                .name("Hope House Orphanage")
                .email("admin@hopehouse.org")
                .password(demoPassword)
                .phone("+1 (555) 044-7710")
                .address("14 Willow Street")
                .role(Role.ORPHANAGE)
                .verified(true)
                .active(true)
                .build());

        userRepository.save(User.builder()
                .name("David Owusu")
                .email("david.owusu@mail.com")
                .password(demoPassword)
                .phone("+1 (555) 083-4471")
                .role(Role.VOLUNTEER)
                .verified(true)
                .active(true)
                .build());

        userRepository.save(User.builder()
                .name("Grand Palace Banquets")
                .email("kitchen@grandpalace.com")
                .password(demoPassword)
                .phone("+1 (555) 077-1120")
                .role(Role.HOTEL)
                .verified(false) // sits in the admin verification queue
                .active(true)
                .build());

        donationRepository.save(Donation.builder()
                .foodName("Banquet rice & curry trays")
                .category("Cooked meal")
                .quantity("6 trays")
                .meals(48)
                .freshness("Freshly cooked")
                .location("220 Harbor Ave, Suite 4")
                .notes("Contains dairy. Trays and lids provided.")
                .status(DonationStatus.LISTED)
                .donor(hotel)
                .build());

        System.out.println("=== Foodward demo data seeded ===");
        System.out.println("Admin:     admin@foodward.org / Password123");
        System.out.println("Hotel:     kitchen@meridianhotel.com / Password123");
        System.out.println("Orphanage: admin@hopehouse.org / Password123");
        System.out.println("Volunteer: david.owusu@mail.com / Password123");
        System.out.println("==================================");
    }
}
