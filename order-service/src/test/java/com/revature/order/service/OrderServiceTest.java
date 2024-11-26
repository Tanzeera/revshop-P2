package com.revature.order.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClient.RequestHeadersUriSpec;
import org.springframework.web.reactive.function.client.WebClient.ResponseSpec;

import com.revature.order.model.Order;
import com.revature.order.repository.OrderRepository;

import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

public class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private WebClient.Builder webClientBuilder;

    @Mock
    private WebClient webClient;

    @Mock
    private RequestHeadersUriSpec<?> requestHeadersUriSpec;

    @Mock
    private ResponseSpec responseSpec;

    @InjectMocks
    private OrderService orderService;

    private Order sampleOrder;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Initialize sampleOrder with test data
        sampleOrder = new Order();
        sampleOrder.setId(1L);
        sampleOrder.setOrderType("ORD123");

        // Use doReturn instead of when to avoid generic type issues
        doReturn(webClient).when(webClientBuilder).build();
        doReturn(requestHeadersUriSpec).when(webClient).get();
        doReturn(requestHeadersUriSpec).when(requestHeadersUriSpec).uri(anyString());
        doReturn(responseSpec).when(requestHeadersUriSpec).retrieve();
    }

    @Test
    public void testCreateOrder() {
        // Arrange
        when(orderRepository.save(any(Order.class))).thenReturn(sampleOrder);

        // Act
        Order createdOrder = orderService.createOrder(sampleOrder);

        // Assert
        assertEquals("ORD123", createdOrder.getOrderType());
    }

    @Test
    public void testGetUserInfo() {
        // Arrange
        String expectedUserInfo = "User Info";
        when(responseSpec.bodyToMono(String.class)).thenReturn(Mono.just(expectedUserInfo));

        // Act
        Mono<String> response = orderService.getUserInfo("USER123");

        // Assert
        StepVerifier.create(response)
            .expectNext(expectedUserInfo)
            .verifyComplete();

        // Verify WebClient chain calls
        verify(webClient).get();
        verify(requestHeadersUriSpec).uri("http://user-service/users/USER123");
    }

    @Test
    void testGetProductInfo() {
        // Arrange
        String expectedProductInfo = "Product information";
        when(responseSpec.bodyToMono(String.class)).thenReturn(Mono.just(expectedProductInfo));

        // Act
        Mono<String> productInfoMono = orderService.getProductInfo("123");

        // Assert
        StepVerifier.create(productInfoMono)
            .expectNext(expectedProductInfo)
            .verifyComplete();

        // Verify WebClient chain calls
        verify(webClient).get();
        verify(requestHeadersUriSpec).uri("http://product-service/products/123");
    }

    @Test
    public void testGetCartInfo() {
        // Arrange
        String expectedCartInfo = "Cart Info";
        when(responseSpec.bodyToMono(String.class)).thenReturn(Mono.just(expectedCartInfo));

        // Act
        Mono<String> response = orderService.getCartInfo("CART123");

        // Assert
        StepVerifier.create(response)
            .expectNext(expectedCartInfo)
            .verifyComplete();

        // Verify WebClient chain calls
        verify(webClient).get();
        verify(requestHeadersUriSpec).uri("http://cart-service/cart/CART123");
    }

    @Test
    public void testGetOrderById() {
        // Arrange
        when(orderRepository.findById(1L)).thenReturn(Optional.of(sampleOrder));

        // Act
        Optional<Order> order = orderService.getOrderById(1L);

        // Assert
        assertEquals("ORD123", order.get().getOrderType());
    }
}
