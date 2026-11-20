package com.taskflow.service;

import com.taskflow.dto.request.TaskRequest;
import com.taskflow.dto.response.TaskResponse;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.exception.UnauthorizedException;
import com.taskflow.model.*;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskResponse createTask(TaskRequest request, String createdByUsername) {
        User creator = userRepository.findByUsername(createdByUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO)
                .priority(request.getPriority() != null ? request.getPriority() : TaskPriority.MEDIUM)
                .assignedTo(request.getAssignedTo())
                .createdBy(creator.getId())
                .projectName(request.getProjectName())
                .tags(request.getTags())
                .dueDate(request.getDueDate())
                .notes(request.getNotes())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return mapToResponse(taskRepository.save(task));
    }

    public TaskResponse getTaskById(String id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found: " + id));
        return mapToResponse(task);
    }

    public List<TaskResponse> getAllTasks() {
        return taskRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<TaskResponse> getMyTasks(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return taskRepository.findByAssignedTo(user.getId()).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<TaskResponse> getTasksByStatus(TaskStatus status) {
        return taskRepository.findByStatus(status).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<TaskResponse> getTasksByPriority(TaskPriority priority) {
        return taskRepository.findByPriority(priority).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<TaskResponse> searchTasks(String keyword) {
        return taskRepository.findByTitleContainingIgnoreCase(keyword).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    public TaskResponse updateTask(String id, TaskRequest request, String username) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found: " + id));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Allow if admin, manager, task creator, or assignee
        boolean isAdminOrManager = user.getRole() == Role.ROLE_ADMIN || user.getRole() == Role.ROLE_MANAGER;
        boolean isOwner = task.getCreatedBy().equals(user.getId()) ||
                (task.getAssignedTo() != null && task.getAssignedTo().equals(user.getId()));

        if (!isAdminOrManager && !isOwner) {
            throw new UnauthorizedException("You don't have permission to update this task");
        }

        if (request.getTitle() != null)       task.setTitle(request.getTitle());
        if (request.getDescription() != null)  task.setDescription(request.getDescription());
        if (request.getStatus() != null)       task.setStatus(request.getStatus());
        if (request.getPriority() != null)     task.setPriority(request.getPriority());
        if (request.getAssignedTo() != null)   task.setAssignedTo(request.getAssignedTo());
        if (request.getProjectName() != null)  task.setProjectName(request.getProjectName());
        if (request.getTags() != null)         task.setTags(request.getTags());
        if (request.getDueDate() != null)      task.setDueDate(request.getDueDate());
        if (request.getNotes() != null)        task.setNotes(request.getNotes());
        task.setUpdatedAt(LocalDateTime.now());

        return mapToResponse(taskRepository.save(task));
    }

    public void deleteTask(String id, String username) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found: " + id));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean isAdminOrManager = user.getRole() == Role.ROLE_ADMIN || user.getRole() == Role.ROLE_MANAGER;
        if (!isAdminOrManager && !task.getCreatedBy().equals(user.getId())) {
            throw new UnauthorizedException("You don't have permission to delete this task");
        }
        taskRepository.deleteById(id);
        log.info("Task {} deleted by {}", id, username);
    }

    private TaskResponse mapToResponse(Task task) {
        TaskResponse.TaskResponseBuilder builder = TaskResponse.builder()
                .id(task.getId()).title(task.getTitle()).description(task.getDescription())
                .status(task.getStatus()).priority(task.getPriority())
                .assignedTo(task.getAssignedTo()).createdBy(task.getCreatedBy())
                .projectName(task.getProjectName()).tags(task.getTags())
                .dueDate(task.getDueDate()).createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt()).notes(task.getNotes());

        if (task.getAssignedTo() != null) {
            userRepository.findById(task.getAssignedTo())
                    .ifPresent(u -> builder.assignedToName(u.getFullName()));
        }
        if (task.getCreatedBy() != null) {
            userRepository.findById(task.getCreatedBy())
                    .ifPresent(u -> builder.createdByName(u.getFullName()));
        }
        return builder.build();
    }
}
