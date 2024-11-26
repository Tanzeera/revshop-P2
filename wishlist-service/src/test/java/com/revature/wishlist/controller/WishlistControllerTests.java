package com.revature.wishlist.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.revature.wishlist.model.Wishlist;
import com.revature.wishlist.service.WishlistService;

import reactor.core.publisher.Mono;

@WebMvcTest(WishlistController.class)
class WishlistControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private WishlistService wishlistService;

    private Wishlist sampleWishlist;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        sampleWishlist = new Wishlist();
        sampleWishlist.setId(1L);
        sampleWishlist.setUserId(1L);
        sampleWishlist.setProductIds(List.of(101L, 102L));
    }

    @Test
    void addWishlist_ShouldReturnCreatedWishlist() throws Exception {
        when(wishlistService.addWishlist(any(Wishlist.class))).thenReturn(sampleWishlist);

        mockMvc.perform(post("/wishlist/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleWishlist)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(sampleWishlist.getId()))
                .andExpect(jsonPath("$.userId").value(sampleWishlist.getUserId()))
                .andExpect(jsonPath("$.productIds[0]").value(101L));
    }

    @Test
    void getWishlistByUserId_ShouldReturnWishlist() throws Exception {
        when(wishlistService.getWishlistByUserId(1L)).thenReturn(Optional.of(sampleWishlist));

        mockMvc.perform(get("/wishlist/user/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(sampleWishlist.getId()))
                .andExpect(jsonPath("$.userId").value(sampleWishlist.getUserId()))
                .andExpect(jsonPath("$.productIds[0]").value(101L));
    }

    @Test
    void getWishlistByUserId_ShouldReturnNotFoundIfWishlistDoesNotExist() throws Exception {
        when(wishlistService.getWishlistByUserId(2L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/wishlist/user/2"))
                .andExpect(status().isNotFound());
    }

    @Test
    void updateWishlist_ShouldReturnUpdatedWishlist() throws Exception {
        when(wishlistService.updateWishlist(any(Wishlist.class))).thenReturn(sampleWishlist);

        mockMvc.perform(put("/wishlist/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleWishlist)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(sampleWishlist.getId()))
                .andExpect(jsonPath("$.userId").value(sampleWishlist.getUserId()));
    }

    @Test
    void deleteWishlist_ShouldReturnNoContent() throws Exception {
        doNothing().when(wishlistService).deleteWishlist(1L);

        mockMvc.perform(delete("/wishlist/delete/1"))
                .andExpect(status().isNoContent());

        verify(wishlistService, times(1)).deleteWishlist(1L);
    }

    @Test
    void addProductToWishlist_ShouldReturnNoContent() throws Exception {
        doNothing().when(wishlistService).addProductToWishlist(1L, 101L);

        mockMvc.perform(post("/wishlist/addProduct/1/101"))
                .andExpect(status().isNoContent());

        verify(wishlistService, times(1)).addProductToWishlist(1L, 101L);
    }
    @Test
    void getUserInfo_ShouldReturnUserInfo() throws Exception {
        when(wishlistService.getUserInfo(1L)).thenReturn(Mono.just("User Info"));

        mockMvc.perform(get("/wishlist/user-info/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("User Info"));
    }



    @Test
    void getProductInfo_ShouldReturnProductInfo() throws Exception {
        when(wishlistService.getProductInfo(101L)).thenReturn(Mono.just("Product Info"));

        mockMvc.perform(get("/wishlist/product-info/101"))
                .andExpect(status().isOk())
                .andExpect(content().string("Product Info"));
    }

}
