package com.taskflow.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "tasks")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Task {

    @Id
    private String id;

    @Indexed
    private String title;

    private String description;

    @Indexed
    private TaskStatus status;

    @Indexed
    private TaskPriority priority;

    @Indexed
    private String assignedTo;   // userId

    @Indexed
    private String createdBy;    // userId

    private String projectName;
    private List<String> tags;
    private LocalDate dueDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String notes;
}
