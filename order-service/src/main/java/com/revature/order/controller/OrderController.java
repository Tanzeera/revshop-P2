package com.revature.order.controller;

import java.util.List;
import java.util.Optional;

import com.revature.order.feigns.AuthService;
import com.revature.order.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.revature.order.model.Order;
import com.revature.order.service.OrderService;

import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @Autowired
    private AuthService authService;

    // Create a new order
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        Order createdOrder = orderService.createOrder(order);
        ResponseEntity<User> userInfo = authService.getUserById(order.getUserId());
        if (userInfo != null && userInfo.getStatusCode().is2xxSuccessful() && userInfo.getBody() != null) {
            User user = userInfo.getBody();
            orderService.sendOrderSuccessEmail(user, order);
        } else {
            throw new RuntimeException("Failed to fetch user info for userId: " + order.getUserId());
        }
        return ResponseEntity.ok(createdOrder);
    }

    @GetMapping("/user-order/{userId}")
    public ResponseEntity<List<Order>> getOrderByUserId(@PathVariable Integer userId) {
        List<Order> allOrders = orderService.getOrderByUserId(userId); // Calling the service method
        System.out.println("Orders returned: " + allOrders);
        return ResponseEntity.ok(allOrders);
    }

    // Get user info from UserService
    @GetMapping("/user/{userId}")
    public Mono<String> getUserInfo(@PathVariable String userId) {
        return orderService.getUserInfo(userId);
    }

    // Get product info from ProductService
    @GetMapping("/product/{productId}")
    public Mono<String> getProductInfo(@PathVariable String productId) {
        return orderService.getProductInfo(productId);
    }

    // Get cart info from CartService
    @GetMapping("/cart/{cartId}")
    public Mono<String> getCartInfo(@PathVariable String cartId) {
        return orderService.getCartInfo(cartId);
    }

    // Get order by ID
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Optional<Order> order = orderService.getOrderById(id);
        return order.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Get all orders
    @GetMapping("/user-order")
    public ResponseEntity<List<Order>> getAllOrder() {
        List<Order> orders = orderService.getAllOrder();
        System.out.println(orders.size());
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id, @RequestBody Order orderDetails) {
        Optional<Order> updatedOrder = orderService.updateOrder(id, orderDetails);
        return updatedOrder.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
