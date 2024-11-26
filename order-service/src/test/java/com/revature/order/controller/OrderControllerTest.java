package com.revature.order.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import com.revature.order.model.Order;
import com.revature.order.model.OrderStatus;
import com.revature.order.service.OrderService;

import reactor.core.publisher.Mono;

public class OrderControllerTest {

    @Mock
    private OrderService orderService;

    @InjectMocks
    private OrderController orderController;

    private Order sampleOrder;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        sampleOrder = Order.builder()
                .id(1L)
                // Removed the orderNumber field
                .userId(123)
                .status(OrderStatus.PENDING)
                .billingAddress("123 Billing St.")
                .billingAddress("456 Shipping St.")
                .build();
    }

    @Test
    public void testCreateOrder() {
        // The mock now returns a sampleOrder without an orderNumber
        when(orderService.createOrder(any(Order.class))).thenReturn(sampleOrder);

        ResponseEntity<Order> response = orderController.createOrder(sampleOrder);
        assertEquals(200, response.getStatusCodeValue());
        // Removed orderNumber check
        assertEquals(123, response.getBody().getUserId());
    }

    @Test
    public void testGetUserInfo() {
        when(orderService.getUserInfo("USER123")).thenReturn(Mono.just("User Info"));

        Mono<String> response = orderController.getUserInfo("USER123");
        assertEquals("User Info", response.block());
    }

    @Test
    public void testGetProductInfo() {
        when(orderService.getProductInfo("PROD123")).thenReturn(Mono.just("Product Info"));

        Mono<String> response = orderController.getProductInfo("PROD123");
        assertEquals("Product Info", response.block());
    }

    @Test
    public void testGetCartInfo() {
        when(orderService.getCartInfo("CART123")).thenReturn(Mono.just("Cart Info"));

        Mono<String> response = orderController.getCartInfo("CART123");
        assertEquals("Cart Info", response.block());
    }

    @Test
    public void testGetOrderById() {
        when(orderService.getOrderById(1L)).thenReturn(Optional.of(sampleOrder));

        ResponseEntity<Order> response = orderController.getOrderById(1L);
        assertEquals(200, response.getStatusCodeValue());
        // Removed orderNumber check
        assertEquals(123, response.getBody().getUserId());
    }
}
