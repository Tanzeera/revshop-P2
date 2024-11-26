package com.example.auth_service.models;

public class AuthResponse {
    private String jwtToken;
    private Long userId;
    private String username;
    private Role role;
    private String email;


    public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	// Constructor with JWT token
    public AuthResponse(String jwtToken, Long userId, String username, Role role, String email) {
        this.jwtToken = jwtToken;
        this.userId = userId;
        this.username= username;
        this.role= role;
        this.email= email;
    }

    // Getter
    public String getJwtToken() {
        return jwtToken;
    }

    // Setter
    public void setJwtToken(String jwtToken) {
        this.jwtToken = jwtToken;
    }
    
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
