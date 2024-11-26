package com.revature.cart.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import com.revature.cart.model.Cart;
import com.revature.cart.model.CartItem;
import com.revature.cart.service.CartService;

import reactor.core.publisher.Mono;

@WebMvcTest(CartController.class)
class CartControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CartService cartService;

    @Test
    void getCartByUserId_ShouldReturnUserCarts() throws Exception {
        Cart cart = new Cart(1L, Collections.emptyList());
        when(cartService.getCartByUserId(1L)).thenReturn(List.of(cart));

        mockMvc.perform(get("/cart/user/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].userId").value(1L));
    }

    @Test
    void addItemToCart_ShouldAddItemToCart() throws Exception {
        CartItem cartItem = new CartItem(1L, 1L, "Test Product", 1, 15.0, "image.png", "Red", "M");

        mockMvc.perform(post("/cart/addItem/1")
                .contentType("application/json")
                .content("{\"productId\":1,\"productName\":\"Test Product\",\"quantity\":1,\"price\":15.0,\"image\":\"image.png\",\"color\":\"Red\",\"size\":\"M\"}"))
            .andExpect(status().isNoContent());
    }

    @Test
    void getUserInfo_ShouldReturnUserInfo() throws Exception {
        when(cartService.getUserInfo(1L)).thenReturn(Mono.just("User Info"));

        mockMvc.perform(get("/cart/user-info/1"))
            .andExpect(status().isOk())
            .andExpect(content().string("User Info"));
    }
}
