package com.taskflow.dto.request;
import com.taskflow.model.TaskPriority;
import com.taskflow.model.TaskStatus;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;
@Data
public class TaskRequest {
    @NotBlank private String title;
    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    private String assignedTo;
    private String projectName;
    private List<String> tags;
    private LocalDate dueDate;
    private String notes;
}
