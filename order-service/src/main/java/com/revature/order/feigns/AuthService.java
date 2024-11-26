package com.revature.order.feigns;


import com.revature.order.model.User;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient("AUTHENTICATION-SERVICE")
public interface AuthService {
    @GetMapping("/user-details/{userId}")
    ResponseEntity<User> getUserDetailsById(@PathVariable Long userId, @RequestHeader("Authorization") String token);

    @GetMapping("auth/users/{id}")
    ResponseEntity<User> getUserById(@PathVariable Long id);

}

