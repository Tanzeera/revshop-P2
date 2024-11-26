package com.revature.user.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.revature.user.model.Role;
import com.revature.user.model.User;
import com.revature.user.service.UserService;

public class UserServiceTest {

    @InjectMocks
    private UserController userController;

    @Mock
    private UserService userService;

    public UserServiceTest() {
        MockitoAnnotations.openMocks(this);
    }

    // Test registration
    @Test
    public void testRegisterUser() {
        User user = new User(1L, "testUser", "test@example.com", Role.BUYER, "John", "Doe", "1234567890", "password");
        when(userService.register(user)).thenReturn(user);

        ResponseEntity<User> response = userController.register(user);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(user, response.getBody());
    }

    // Test login - success
    @Test
    public void testLoginUser_Success() {
        User user = new User(1L, "testUser", "test@example.com", Role.BUYER, "John", "Doe", "1234567890", "password");
        Map<String, String> loginData = Map.of("username", "testUser", "password", "password");
        when(userService.login("testUser", "password")).thenReturn(user);

        ResponseEntity<User> response = userController.login(loginData);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(user, response.getBody());
    }

    // Test login - failure
    @Test
    public void testLoginUser_Failure() {
        Map<String, String> loginData = Map.of("username", "testUser", "password", "wrongPassword");
        when(userService.login("testUser", "wrongPassword")).thenThrow(new RuntimeException("Invalid username or password."));

        assertThrows(RuntimeException.class, () -> userController.login(loginData));
    }

    // Test get all users
    @Test
    public void testGetAllUsers() {
        User user1 = new User(1L, "user1", "user1@example.com", Role.BUYER, "Alice", "Smith", "1234567890", "password");
        User user2 = new User(2L, "user2", "user2@example.com", Role.SELLER, "Bob", "Brown", "0987654321", "password");
        when(userService.getAllUsers()).thenReturn(List.of(user1, user2));

        List<User> users = userController.getAllUsers();
        assertEquals(2, users.size());
        assertEquals("user1", users.get(0).getUsername());
    }

    // Test get user by ID - success
    @Test
    public void testGetUserById_Success() {
        User user = new User(1L, "testUser", "test@example.com", Role.BUYER, "John", "Doe", "1234567890", "password");
        when(userService.getUserById(1L)).thenReturn(Optional.of(user));

        ResponseEntity<User> response = userController.getUserById(1L);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(user, response.getBody());
    }

    // Test get user by ID - not found
    @Test
    public void testGetUserById_NotFound() {
        when(userService.getUserById(1L)).thenReturn(Optional.empty());

        ResponseEntity<User> response = userController.getUserById(1L);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNull(response.getBody());
    }

    // Test update user
    @Test
    public void testUpdateUser() {
        User existingUser = new User(1L, "oldUser", "old@example.com", Role.BUYER, "Old", "User", "1234567890", "oldPassword");
        User updatedUser = new User(1L, "newUser", "new@example.com", Role.BUYER, "New", "User", "0987654321", "newPassword");

        when(userService.updateUser(1L, updatedUser)).thenReturn(updatedUser);

        ResponseEntity<User> response = userController.updateUser(1L, updatedUser);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("newUser", response.getBody().getUsername());
        assertEquals("new@example.com", response.getBody().getEmail());
    }

    // Test delete user
    @Test
    public void testDeleteUser() {
        doNothing().when(userService).deleteUser(1L);

        ResponseEntity<Void> response = userController.deleteUser(1L);
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(userService, times(1)).deleteUser(1L);
    }
}
