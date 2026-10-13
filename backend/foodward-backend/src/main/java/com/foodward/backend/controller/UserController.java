package com.foodward.backend.controller;

import com.foodward.backend.dto.UserDtos.UserResponse;
import com.foodward.backend.model.Role;
import com.foodward.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/** All endpoints here require ROLE_ADMIN — enforced in SecurityConfig. */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<UserResponse>> all(@RequestParam(required = false) Role role) {
        return ResponseEntity.ok(userService.all(role));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<UserResponse>> pending() {
        return ResponseEntity.ok(userService.pendingVerification());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(userService.get(id));
    }

    @PostMapping("/{id}/verify")
    public ResponseEntity<UserResponse> verify(@PathVariable Long id) {
        return ResponseEntity.ok(userService.verify(id));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<Map<String, String>> reject(@PathVariable Long id) {
        userService.reject(id);
        return ResponseEntity.ok(Map.of("message", "User rejected and removed"));
    }

    @PostMapping("/{id}/deactivate")
    public ResponseEntity<Map<String, String>> deactivate(@PathVariable Long id) {
        userService.setActive(id, false);
        return ResponseEntity.ok(Map.of("message", "User deactivated"));
    }

    @PostMapping("/{id}/activate")
    public ResponseEntity<Map<String, String>> activate(@PathVariable Long id) {
        userService.setActive(id, true);
        return ResponseEntity.ok(Map.of("message", "User activated"));
    }
}
