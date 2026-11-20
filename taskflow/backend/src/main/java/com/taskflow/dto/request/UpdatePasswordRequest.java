package com.taskflow.dto.request;
import jakarta.validation.constraints.*;
import lombok.Data;
@Data
public class UpdatePasswordRequest {
    @NotBlank private String currentPassword;
    @NotBlank @Size(min=6) private String newPassword;
}
