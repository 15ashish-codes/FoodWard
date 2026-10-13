package com.foodward.backend.service;

import com.foodward.backend.dto.UserDtos.UpdateProfileRequest;
import com.foodward.backend.dto.UserDtos.UserResponse;
import com.foodward.backend.exception.ResourceNotFoundException;
import com.foodward.backend.model.Role;
import com.foodward.backend.model.User;
import com.foodward.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public List<UserResponse> all(Role role) {
        List<User> users = role != null ? userRepository.findByRole(role) : userRepository.findAll();
        return users.stream().map(UserResponse::from).toList();
    }

    public List<UserResponse> pendingVerification() {
        return userRepository.findByVerifiedFalse().stream().map(UserResponse::from).toList();
    }

    public UserResponse get(Long id) {
        return UserResponse.from(findOrThrow(id));
    }

    public UserResponse verify(Long id) {
        User user = findOrThrow(id);
        user.setVerified(true);
        userRepository.save(user);
        notificationService.notify(user, "Account verified",
                "Your organization has been approved and is now live on Foodward.", "verification");
        return UserResponse.from(user);
    }

    public void reject(Long id) {
        User user = findOrThrow(id);
        userRepository.delete(user);
    }

    public void setActive(Long id, boolean active) {
        User user = findOrThrow(id);
        user.setActive(active);
        userRepository.save(user);
    }

    public UserResponse updateProfile(User current, UpdateProfileRequest req) {
        if (req.getName() != null) current.setName(req.getName());
        if (req.getPhone() != null) current.setPhone(req.getPhone());
        if (req.getAddress() != null) current.setAddress(req.getAddress());
        userRepository.save(current);
        return UserResponse.from(current);
    }

    private User findOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
