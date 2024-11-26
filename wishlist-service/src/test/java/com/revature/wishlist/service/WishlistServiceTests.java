package com.revature.wishlist.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional; 

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.web.reactive.function.client.WebClient;

import com.revature.wishlist.model.Wishlist;
import com.revature.wishlist.repository.WishlistRepository;

@SpringBootTest
class WishlistServiceTests {

    @Mock
    private WishlistRepository wishlistRepository;

    @Mock
    private WebClient.Builder webClientBuilder;

    @InjectMocks
    private WishlistService wishlistService;

    private Wishlist sampleWishlist;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Sample wishlist setup
        sampleWishlist = new Wishlist();
        sampleWishlist.setId(1L);
        sampleWishlist.setUserId(1L);
        sampleWishlist.setProductIds(new ArrayList<>());
    }

    @Test
    void addWishlist_ShouldSaveWishlist() {
        when(wishlistRepository.save(sampleWishlist)).thenReturn(sampleWishlist);

        Wishlist result = wishlistService.addWishlist(sampleWishlist);

        assertEquals(sampleWishlist, result);
        verify(wishlistRepository, times(1)).save(sampleWishlist);
    }

    @Test
    void getWishlistByUserId_ShouldReturnWishlist() {
        when(wishlistRepository.findByUserId(1L)).thenReturn(Optional.of(sampleWishlist));

        Optional<Wishlist> result = wishlistService.getWishlistByUserId(1L);

        assertTrue(result.isPresent());
        assertEquals(sampleWishlist, result.get());
    }

    @Test
    void getWishlistByUserId_ShouldReturnEmptyIfWishlistNotFound() {
        when(wishlistRepository.findByUserId(2L)).thenReturn(Optional.empty());

        Optional<Wishlist> result = wishlistService.getWishlistByUserId(2L);

        assertFalse(result.isPresent());
    }

    @Test
    void updateWishlist_ShouldUpdateAndReturnWishlist() {
        when(wishlistRepository.save(sampleWishlist)).thenReturn(sampleWishlist);

        Wishlist result = wishlistService.updateWishlist(sampleWishlist);

        assertEquals(sampleWishlist, result);
        verify(wishlistRepository, times(1)).save(sampleWishlist);
    }

    @Test
    void deleteWishlist_ShouldDeleteWishlist() {
        doNothing().when(wishlistRepository).deleteById(1L);

        wishlistService.deleteWishlist(1L);

        verify(wishlistRepository, times(1)).deleteById(1L);
    }

    @Test
    void addProductToWishlist_ShouldAddProductToExistingWishlist() {
        Long productId = 101L;
        sampleWishlist.setProductIds(new ArrayList<>());

        when(wishlistRepository.findByUserId(1L)).thenReturn(Optional.of(sampleWishlist));
        when(wishlistRepository.save(sampleWishlist)).thenReturn(sampleWishlist);

        wishlistService.addProductToWishlist(1L, productId);

        assertTrue(sampleWishlist.getProductIds().contains(productId));
        verify(wishlistRepository, times(1)).save(sampleWishlist);
    }

    @Test
    void addProductToWishlist_ShouldThrowExceptionIfProductAlreadyInWishlist() {
        Long productId = 101L;
        sampleWishlist.setProductIds(List.of(productId));

        when(wishlistRepository.findByUserId(1L)).thenReturn(Optional.of(sampleWishlist));

        Exception exception = assertThrows(RuntimeException.class, () -> {
            wishlistService.addProductToWishlist(1L, productId);
        });

        assertEquals("Product already exists in the wishlist", exception.getMessage());
        verify(wishlistRepository, never()).save(any(Wishlist.class));
    }

    
    
//    @Test
//    void getUserInfo_ShouldReturnUserInfo() {
//        WebClient webClient = mock(WebClient.class);
//        WebClient.RequestHeadersUriSpec<?> request = mock(WebClient.RequestHeadersUriSpec.class);
//        WebClient.ResponseSpec responseSpec = mock(WebClient.ResponseSpec.class);
//
//        when(webClientBuilder.build()).thenReturn(webClient);
//        when(webClient.get()).thenReturn(any()); // Allows for any RequestHeadersUriSpec type
//        when(request.uri("http://localhost:8081/users/1")).thenReturn(any());
//        when(request.retrieve()).thenReturn(responseSpec);
//        when(responseSpec.bodyToMono(String.class)).thenReturn(Mono.just("User Info"));
//
//        Mono<String> userInfo = wishlistService.getUserInfo(1L);
//
//        assertEquals("User Info", userInfo.block());
//    }
//
//    @Test
//    void getProductInfo_ShouldReturnProductInfo() {
//        WebClient webClient = mock(WebClient.class);
//        WebClient.RequestHeadersUriSpec<?> request = mock(WebClient.RequestHeadersUriSpec.class);
//        WebClient.ResponseSpec responseSpec = mock(WebClient.ResponseSpec.class);
//
//        when(webClientBuilder.build()).thenReturn(webClient);
//        when(webClient.get()).thenReturn(any()); // Allows for any RequestHeadersUriSpec type
//        when(request.uri("http://localhost:8082/products/101")).thenReturn(any());
//        when(request.retrieve()).thenReturn(responseSpec);
//        when(responseSpec.bodyToMono(String.class)).thenReturn(Mono.just("Product Info"));
//
//        Mono<String> productInfo = wishlistService.getProductInfo(101L);
//
//        assertEquals("Product Info", productInfo.block());
//    }


}
