package com.revature.cart.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.revature.cart.model.Cart;
import com.revature.cart.model.CartItem;
import com.revature.cart.repository.CartRepository;

import reactor.core.publisher.Mono;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private WebClient.Builder webClientBuilder;

    // Fetch user info from the User Service using Load Balancer
    public Mono<String> getUserInfo(Long userId) {
        return webClientBuilder.build()
            .get()
            .uri("http://authentication-service/auth/users/" + userId)  // Load-balancing with lb://user-service
            .retrieve()
            .bodyToMono(String.class);
    }

    public void deleteAllCartItemsByUserId(Long userId) {
        List<Cart> carts = cartRepository.findByUserId(userId);

        for (Cart cart : carts) {
            cart.getCartItems().clear();  // Clear all cart items in the cart
            cartRepository.save(cart);    // Save the empty cart back to the repository
        }
    }

    // Fetch product info from the Product Service using Load Balancer
    public Mono<String> getProductInfo(Long productId) {
        return webClientBuilder.build()
            .get()
            .uri("http://product-service/products/" + productId)  // Load-balancing with lb://product-service
            .retrieve()
            .bodyToMono(String.class);
    }

    public Cart addCart(Cart cart) {
        return cartRepository.save(cart);
    }

    public List<Cart> getCartByUserId(Long userId) {
        return cartRepository.findByUserId(userId);
    }

    public Cart updateCart(Cart cart) {
        return cartRepository.save(cart);
    }

    public void deleteCart(Long cartId) {
        cartRepository.deleteById(cartId);
    }

    public void addItemToCart(Long userId, CartItem cartItem) {
        // Fetch all carts for the user
        List<Cart> carts = cartRepository.findByUserId(userId);

        Cart cart;
        if (carts.isEmpty()) {
            // If no carts exist, create a new one
            cart = new Cart();
            cart.setUserId(userId);
        } else {
            // Otherwise, use the most recent cart (you can adjust this logic as needed)
            cart = carts.get(0);  // Assuming the first cart in the list is the one you want
        }

        // Add the item to the cart
        cart.getCartItems().add(cartItem);

        // Save the cart back to the repository
        cartRepository.save(cart);
    }

    // Method to increase the quantity of a CartItem within a Cart
    public Optional<Cart> increaseCartItemQuantity(Long cartId, Long cartItemId) {
        Optional<Cart> cartOptional = cartRepository.findById(cartId);

        if (cartOptional.isPresent()) {
            Cart cart = cartOptional.get();
            boolean itemFound = false;

            // Find the CartItem by ID and increase its quantity
            for (CartItem item : cart.getCartItems()) {
                if (item.getId().equals(cartItemId)) {
                    item.setQuantity(item.getQuantity() + 1);
                    itemFound = true;
                    break;
                }
            }

            if (itemFound) {
                // Save the updated cart
                Cart updatedCart = cartRepository.save(cart);
                return Optional.of(updatedCart);
            }
        }

        return Optional.empty();  // Return empty if cart or item not found
    }


    // Method to decrease the quantity of a CartItem within a Cart
    public Optional<Cart> decreaseCartItemQuantity(Long cartId, Long cartItemId) {
        Optional<Cart> cartOptional = cartRepository.findById(cartId);

        if (cartOptional.isPresent()) {
            Cart cart = cartOptional.get();
            boolean itemFound = false;

            // Find the CartItem by ID and decrease its quantity
            for (CartItem item : cart.getCartItems()) {
                if (item.getId().equals(cartItemId)) {
                    if (item.getQuantity() > 1) {
                        item.setQuantity(item.getQuantity() - 1);
                    } else {
                        // Optionally, remove the item from the cart if quantity reaches 1
                        cart.getCartItems().remove(item);
                    }
                    itemFound = true;
                    break;
                }
            }

            if (itemFound) {
                // Save the updated cart
                Cart updatedCart = cartRepository.save(cart);
                return Optional.of(updatedCart);
            }
        }

        return Optional.empty();  // Return empty if cart or item not found
    }

}
