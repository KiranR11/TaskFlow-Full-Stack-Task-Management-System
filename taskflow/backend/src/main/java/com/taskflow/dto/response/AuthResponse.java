package com.taskflow.dto.response;
import com.taskflow.model.Role;
import lombok.*;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AuthResponse {
    private String token;
    private String userId;
    private String username;
    private String email;
    private String fullName;
    private Role role;
    private String message;
}
