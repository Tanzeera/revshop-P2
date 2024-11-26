package com.example.auth_service.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import com.example.auth_service.models.AuthRequest;
import com.example.auth_service.models.Role;
import com.example.auth_service.models.User;
import com.example.auth_service.repository.UserRepository;
import com.example.auth_service.security.JwtUtil;
import com.example.auth_service.service.UserService;

@WebMvcTest(AuthController.class)
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthenticationManager authenticationManager;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private UserService userService;

    @MockBean
    private PasswordEncoder passwordEncoder;

    @MockBean
    private UserRepository userRepository;

    @InjectMocks
    private AuthController authController;

    private AuthRequest authRequest;
    private User user;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        authRequest = new AuthRequest("testUser", "testPassword", "BUYER", "test@example.com", "1234567890", "First", "Last");

        user = User.builder()
                .username("testUser")
                .password(passwordEncoder.encode("testPassword"))
                .role(Role.BUYER)
                .email("test@example.com")
                .phone("1234567890")
                .firstName("First")
                .LastName("Last")
                .build();
    }

    @Test
    public void testLoginSuccess() throws Exception {
        when(userRepository.findByUsername(anyString())).thenReturn(user);
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(jwtUtil.generateToken(anyString())).thenReturn("jwtToken123");

        mockMvc.perform(MockMvcRequestBuilders.post("/auth/login")
                        .contentType("application/json")
                        .content("{\"username\":\"testUser\", \"password\":\"testPassword\"}"))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.jwtToken").value("jwtToken123"));
    }

    @Test
    public void testLoginInvalidPassword() throws Exception {
        when(userRepository.findByUsername(anyString())).thenReturn(user);
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        mockMvc.perform(MockMvcRequestBuilders.post("/auth/login")
                        .contentType("application/json")
                        .content("{\"username\":\"testUser\", \"password\":\"wrongPassword\"}"))
                .andExpect(status().isUnauthorized());
    }

    
    @Test
    public void testRegisterUserAlreadyExists() {
        AuthRequest authRequest = new AuthRequest("testuser", "password123", null, null, null, null, null);
        // Set up the mock to return a user when checking if username already exists
        when(userRepository.findByUsername(anyString())).thenReturn(new User(null, "testuser", "password123", null, null, null, null, null));

        // Call the method under test
        String response = authController.register(authRequest);

        // Check for the expected response for an existing user
        assertEquals("Username already taken", response);
    }

    @Test
    public void testGetUserByIdSuccess() {
        when(userService.getUserById(any())).thenReturn(Optional.of(user));

        ResponseEntity<User> response = authController.getUserById(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(user, response.getBody());
    }

    @Test
    public void testGetUserByIdNotFound() {
        when(userService.getUserById(any())).thenReturn(Optional.empty());

        ResponseEntity<User> response = authController.getUserById(1L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }
}
