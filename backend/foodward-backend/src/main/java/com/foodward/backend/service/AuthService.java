package com.foodward.backend.service;

import com.foodward.backend.dto.AuthDtos.*;
import com.foodward.backend.dto.UserDtos;
import com.foodward.backend.exception.BadRequestException;
import com.foodward.backend.model.User;
import com.foodward.backend.repository.UserRepository;
import com.foodward.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with this email already exists");
        }

        // Admin accounts should be created by another admin/seed data, not self-signup.
        if (request.getRole() == com.foodward.backend.model.Role.ADMIN) {
            throw new BadRequestException("Admin accounts cannot be created via signup");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .verified(false) // an admin must verify hotels/orphanages/volunteers before they're fully active
                .active(true)
                .build();

        userRepository.save(user);

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, UserDtos.UserResponse.from(user));
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, UserDtos.UserResponse.from(user));
    }

    public void forgotPassword(String email) {
        // Stub: in production, generate a reset token, email it, and expire it after ~15 minutes.
        // Deliberately does not reveal whether the email exists, to avoid account enumeration.
    }
}
