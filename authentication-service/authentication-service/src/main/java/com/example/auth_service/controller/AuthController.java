package com.example.auth_service.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.auth_service.models.AuthRequest;
import com.example.auth_service.models.AuthResponse;
import com.example.auth_service.models.Role;
import com.example.auth_service.models.User;
import com.example.auth_service.repository.UserRepository;
import com.example.auth_service.security.JwtUtil;
import com.example.auth_service.service.UserService;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private UserRepository userRepository;

    // Hard-coded hash for testing; ideally, this should be fetched from the database
    private static final String HARD_CODED_PASSWORD_HASH = "$2a$10$EIXip9DlBKPQ6Y5EJ9pMe.0R3MeS68ZUiF2PHb7/7E5B48ExyVyao";

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest authRequest) throws Exception {
        try {
            // Fetch user from the database if necessary (e.g., via username)
            User user = userRepository.findByUsername(authRequest.getUsername());
            if (user == null) {
                throw new Exception("Invalid username or password");
            }
            
            // Check password against the stored hash
            if (!passwordEncoder.matches(authRequest.getPassword(), user.getPassword())) {
                throw new Exception("Invalid username or password");
            }

            // Generate and return JWT token
            String jwtToken = jwtUtil.generateToken(authRequest.getUsername());
            Long userId = userService.getUserIdByUsername(authRequest.getUsername());
            
            Role role = userService.getRoleByUsername(authRequest.getUsername());
            String email = userService.getEmailByUsername(authRequest.getUsername());
            return new AuthResponse(jwtToken, userId, authRequest.getUsername(), role , email);


        } catch (AuthenticationException e) {
            throw new Exception("Invalid username or password", e);
        }
    }

    @PostMapping("/register")
    public String register(@RequestBody AuthRequest authRequest) {
    	System.out.println("--------------------------------------------------------------------------------------------------");
    	System.out.println("inside regiter controller : " + authRequest);
        // Check if user already exists
        if (userRepository.findByUsername(authRequest.getUsername()) != null) {
            return "Username already taken";
        }
        
        Role role;
        try {
            role = Role.valueOf(authRequest.getRole().toUpperCase()); // Convert the role to the enum
        } catch (IllegalArgumentException e) {
            return "Invalid role provided"; // Handle invalid role case
        }

        // Hash the password and save the new user
        User newUser = new User();
        newUser.setUsername(authRequest.getUsername());
        newUser.setPassword(passwordEncoder.encode(authRequest.getPassword()));
        newUser.setEmail(authRequest.getEmail());
        newUser.setPhone(authRequest.getPhone());
        newUser.setFirstName(authRequest.getFirstName());
        newUser.setLastName(authRequest.getLastName());
        newUser.setRole(role); // Set the role as the enu
        

     

        userRepository.save(newUser);
        userService.sendRegistrationEmail(newUser);
        return "User registered successfully";
    }
    
 // Get all users
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // Get user by ID
    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update user
    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        return ResponseEntity.ok(userService.updateUser(id, userDetails));
    }

    // Delete user
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }


}
