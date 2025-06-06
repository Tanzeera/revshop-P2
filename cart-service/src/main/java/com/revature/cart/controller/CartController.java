package com.revature.cart.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.revature.cart.model.Cart;
import com.revature.cart.model.CartItem;
import com.revature.cart.service.CartService;

@RestController
@RequestMapping("/cart")
@CrossOrigin(origins = "http://localhost:5173")
public class CartController {
    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<Cart> addCart(@RequestBody Cart cart) {
        Cart createdCart = cartService.addCart(cart);
        return ResponseEntity.ok(createdCart);
    }

    @DeleteMapping("/deleteAll/{userId}")
    public ResponseEntity<String> deleteAllCartItemsByUserId(@PathVariable Long userId) {
        cartService.deleteAllCartItemsByUserId(userId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body("All cart items for user with ID " + userId + " have been deleted.");
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Cart>> getCartByUserId(@PathVariable Long userId) {
        List<Cart> carts = cartService.getCartByUserId(userId);
        if (carts.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(carts);
    }

    @PutMapping("/update")
    public ResponseEntity<Cart> updateCart(@RequestBody Cart cart) {
        Cart updatedCart = cartService.updateCart(cart);
        return ResponseEntity.ok(updatedCart);
    }

    @DeleteMapping("/delete/{cartId}")
    public ResponseEntity<Void> deleteCart(@PathVariable Long cartId) {
        cartService.deleteCart(cartId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/addItem/{userId}")
    public ResponseEntity<Void> addItemToCart(@PathVariable Long userId, @RequestBody CartItem cartItem) {
        cartService.addItemToCart(userId, cartItem);
        return ResponseEntity.noContent().build();
    }

    // Fetch user and product information
    @GetMapping("/user-info/{userId}")
    public ResponseEntity<String> getUserInfo(@PathVariable Long userId) {
        return cartService.getUserInfo(userId)
            .map(ResponseEntity::ok)
            .block();
    }

    @GetMapping("/product-info/{productId}")
    public ResponseEntity<String> getProductInfo(@PathVariable Long productId) {
        return cartService.getProductInfo(productId)
            .map(ResponseEntity::ok)
            .block();
    }

    @PutMapping("/{cartId}/item/{cartItemId}/increase")
    public ResponseEntity<Cart> increaseCartItemQuantity(@PathVariable Long cartId, @PathVariable Long cartItemId) {
        Optional<Cart> updatedCart = cartService.increaseCartItemQuantity(cartId, cartItemId);

        if (updatedCart.isPresent()) {
            return ResponseEntity.ok(updatedCart.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoint to decrease the quantity of a CartItem within a Cart
    @PutMapping("/{cartId}/item/{cartItemId}/decrease")
    public ResponseEntity<Cart> decreaseCartItemQuantity(@PathVariable Long cartId, @PathVariable Long cartItemId) {
        Optional<Cart> updatedCart = cartService.decreaseCartItemQuantity(cartId, cartItemId);

        if (updatedCart.isPresent()) {
            return ResponseEntity.ok(updatedCart.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
