package com.taskflow.service;

import com.taskflow.dto.request.TaskRequest;
import com.taskflow.dto.response.TaskResponse;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.exception.UnauthorizedException;
import com.taskflow.model.*;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Task Service Unit Tests")
class TaskServiceTest {

    @Mock private TaskRepository taskRepository;
    @Mock private UserRepository userRepository;
    @InjectMocks private TaskService taskService;

    private User adminUser;
    private User regularUser;
    private Task sampleTask;

    @BeforeEach
    void setUp() {
        adminUser = User.builder().id("admin-001").username("admin")
                .role(Role.ROLE_ADMIN).enabled(true).build();

        regularUser = User.builder().id("user-001").username("alice")
                .role(Role.ROLE_USER).enabled(true).build();

        sampleTask = Task.builder()
                .id("task-001").title("Fix login bug")
                .description("Authentication issue")
                .status(TaskStatus.TODO).priority(TaskPriority.HIGH)
                .createdBy("user-001").assignedTo("user-001")
                .build();
    }

    @Test
    @DisplayName("Should create task successfully")
    void shouldCreateTaskSuccessfully() {
        TaskRequest request = new TaskRequest();
        request.setTitle("Fix login bug");
        request.setDescription("Authentication issue");
        request.setPriority(TaskPriority.HIGH);

        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(regularUser));
        when(taskRepository.save(any(Task.class))).thenReturn(sampleTask);

        TaskResponse response = taskService.createTask(request, "alice");

        assertThat(response).isNotNull();
        assertThat(response.getTitle()).isEqualTo("Fix login bug");
        verify(taskRepository).save(any(Task.class));
    }

    @Test
    @DisplayName("Should return task by id")
    void shouldReturnTaskById() {
        when(taskRepository.findById("task-001")).thenReturn(Optional.of(sampleTask));
        TaskResponse response = taskService.getTaskById("task-001");
        assertThat(response.getId()).isEqualTo("task-001");
        assertThat(response.getTitle()).isEqualTo("Fix login bug");
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when task not found")
    void shouldThrowWhenTaskNotFound() {
        when(taskRepository.findById("bad-id")).thenReturn(Optional.empty());
        assertThatThrownBy(() -> taskService.getTaskById("bad-id"))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("Should return all tasks")
    void shouldReturnAllTasks() {
        when(taskRepository.findAll()).thenReturn(List.of(sampleTask));
        List<TaskResponse> tasks = taskService.getAllTasks();
        assertThat(tasks).hasSize(1);
        assertThat(tasks.get(0).getTitle()).isEqualTo("Fix login bug");
    }

    @Test
    @DisplayName("Admin should be able to delete any task")
    void adminShouldDeleteAnyTask() {
        when(taskRepository.findById("task-001")).thenReturn(Optional.of(sampleTask));
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(adminUser));
        doNothing().when(taskRepository).deleteById("task-001");
        assertThatCode(() -> taskService.deleteTask("task-001", "admin")).doesNotThrowAnyException();
    }

    @Test
    @DisplayName("Regular user cannot delete another user's task")
    void regularUserCannotDeleteOthersTask() {
        User otherUser = User.builder().id("other-001").username("bob").role(Role.ROLE_USER).build();
        when(taskRepository.findById("task-001")).thenReturn(Optional.of(sampleTask));
        when(userRepository.findByUsername("bob")).thenReturn(Optional.of(otherUser));
        assertThatThrownBy(() -> taskService.deleteTask("task-001", "bob"))
                .isInstanceOf(UnauthorizedException.class);
    }

    @Test
    @DisplayName("Should return my tasks for a user")
    void shouldReturnMyTasks() {
        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(regularUser));
        when(taskRepository.findByAssignedTo("user-001")).thenReturn(List.of(sampleTask));
        List<TaskResponse> tasks = taskService.getMyTasks("alice");
        assertThat(tasks).hasSize(1);
    }
}
