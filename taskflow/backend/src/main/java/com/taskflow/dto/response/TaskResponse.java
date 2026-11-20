package com.taskflow.dto.response;
import com.taskflow.model.TaskPriority;
import com.taskflow.model.TaskStatus;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class TaskResponse {
    private String id;
    private String title;
    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    private String assignedTo;
    private String assignedToName;
    private String createdBy;
    private String createdByName;
    private String projectName;
    private List<String> tags;
    private LocalDate dueDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String notes;
}
