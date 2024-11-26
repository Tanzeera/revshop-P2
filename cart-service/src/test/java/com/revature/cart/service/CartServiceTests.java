package com.revature.cart.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.web.reactive.function.client.WebClient;

import com.revature.cart.model.Cart;
import com.revature.cart.model.CartItem;
import com.revature.cart.repository.CartRepository;

@SpringBootTest
class CartServiceTests {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private WebClient.Builder webClientBuilder;

    @InjectMocks
    private CartService cartService;

    private Cart sampleCart;

    @BeforeEach
    void setUp() {
        sampleCart = new Cart();
        sampleCart.setUserId(1L);
        sampleCart.setCartItems(new ArrayList<>());
    }

    @Test
    void addCart_ShouldSaveCart() {
        // Arrange
        when(cartRepository.save(any(Cart.class))).thenAnswer(invocation -> invocation.getArgument(0)); // Avoid `thenReturn` 

        // Act
        Cart result = cartService.addCart(sampleCart);

        // Assert
        assertEquals(sampleCart, result);
    }

    @Test
    void getCartByUserId_ShouldReturnUserCarts() {
        // Arrange
        when(cartRepository.findByUserId(1L)).thenAnswer(invocation -> List.of(sampleCart)); // Avoid `thenReturn`

        // Act
        List<Cart> carts = cartService.getCartByUserId(1L);

        // Assert
        assertEquals(1, carts.size());
        assertEquals(sampleCart, carts.get(0));
    }

    @Test
    void addItemToCart_ShouldAddItemToExistingCart() {
        // Arrange
        CartItem item = new CartItem(123L, 123L, "Test Product", 2, 20.0, "image.png", "Red", "M"); // Dummy product ID used here
        when(cartRepository.findByUserId(1L)).thenAnswer(invocation -> List.of(sampleCart)); // Avoid `thenReturn`
        when(cartRepository.save(any(Cart.class))).thenAnswer(invocation -> invocation.getArgument(0)); // Avoid `thenReturn`

        // Act
        cartService.addItemToCart(1L, item);

        // Assert
        assertEquals(1, sampleCart.getCartItems().size());
        CartItem addedItem = sampleCart.getCartItems().get(0);
        assertEquals("Test Product", addedItem.getProductName());
        assertEquals("Red", addedItem.getColor());
        assertEquals("M", addedItem.getSize());
        assertEquals(2, addedItem.getQuantity());
        assertEquals(20.0, addedItem.getPrice());
    }


}
