package com.taskflow.repository;

import com.taskflow.model.Task;
import com.taskflow.model.TaskPriority;
import com.taskflow.model.TaskStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends MongoRepository<Task, String> {
    List<Task> findByAssignedTo(String userId);
    List<Task> findByCreatedBy(String userId);
    List<Task> findByStatus(TaskStatus status);
    List<Task> findByPriority(TaskPriority priority);
    List<Task> findByAssignedToAndStatus(String userId, TaskStatus status);
    List<Task> findByProjectName(String projectName);

    @Query("{ 'title': { $regex: ?0, $options: 'i' } }")
    List<Task> findByTitleContainingIgnoreCase(String keyword);

    long countByStatus(TaskStatus status);
    long countByAssignedTo(String userId);
    long countByAssignedToAndStatus(String userId, TaskStatus status);
}
