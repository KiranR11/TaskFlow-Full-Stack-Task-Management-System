package com.taskflow.service;

import com.taskflow.dto.response.DashboardStatsResponse;
import com.taskflow.dto.response.UserResponse;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.model.*;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;

    public UserResponse getProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapToResponse(user);
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public UserResponse getUserById(String id) {
        return mapToResponse(userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id)));
    }

    public void toggleUserStatus(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        user.setEnabled(!user.isEnabled());
        userRepository.save(user);
    }

    public UserResponse updateRole(String id, Role newRole) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        user.setRole(newRole);
        return mapToResponse(userRepository.save(user));
    }

    public DashboardStatsResponse getDashboardStats() {
        return DashboardStatsResponse.builder()
                .totalTasks(taskRepository.count())
                .todoTasks(taskRepository.countByStatus(TaskStatus.TODO))
                .inProgressTasks(taskRepository.countByStatus(TaskStatus.IN_PROGRESS))
                .inReviewTasks(taskRepository.countByStatus(TaskStatus.IN_REVIEW))
                .doneTasks(taskRepository.countByStatus(TaskStatus.DONE))
                .highPriorityTasks(taskRepository.countByStatus(TaskStatus.TODO))
                .totalUsers(userRepository.count())
                .build();
    }

    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId()).username(user.getUsername()).email(user.getEmail())
                .fullName(user.getFullName()).role(user.getRole())
                .enabled(user.isEnabled()).createdAt(user.getCreatedAt())
                .build();
    }
}
