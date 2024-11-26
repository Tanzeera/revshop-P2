package com.example.auth_service.controller;

import com.example.auth_service.models.User;
import com.example.auth_service.service.UserService;
import com.netflix.discovery.converters.Auto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping()
@CrossOrigin()
public class UserController {

    @Autowired
    private UserService userService;

    // Get user by ID
//    @GetMapping("/users-details/{id}")
//    public ResponseEntity<User> getUserById(@PathVariable Long id) {
//        return userService.getUserById(id)
//                .map(ResponseEntity::ok)
//                .orElse(ResponseEntity.notFound().build());
//    }
}
