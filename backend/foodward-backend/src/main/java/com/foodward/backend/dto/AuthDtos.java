package com.foodward.backend.dto;

import com.foodward.backend.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

public class AuthDtos {

    @Data
    public static class SignupRequest {
        @NotBlank
        private String name;

        @NotBlank @Email
        private String email;

        @NotBlank
        private String phone;

        @NotBlank @Size(min = 8, message = "Password must be at least 8 characters")
        private String password;

        @NotNull
        private Role role;
    }

    @Data
    public static class LoginRequest {
        @NotBlank @Email
        private String email;

        @NotBlank
        private String password;
    }

    @Data
    public static class ForgotPasswordRequest {
        @NotBlank @Email
        private String email;
    }

    @Data
    public static class AuthResponse {
        private String token;
        private UserDtos.UserResponse user;

        public AuthResponse(String token, UserDtos.UserResponse user) {
            this.token = token;
            this.user = user;
        }
    }
}
