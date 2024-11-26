package com.revature.product.service;

import com.revature.product.model.Category;
import com.revature.product.model.Product;
import com.revature.product.model.Review;
import com.revature.product.repository.ReviewRepository;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class ReviewServiceTest {

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private ProductService productService; // Mocking the ProductService to return Product objects

    @InjectMocks
    private ReviewService reviewService;

    @Test
    void testAddReview() {
        // Arrange: Mock the Product and Review data with updated Product constructor that takes a Category object
        Category category = new Category(1L, "Electronics", null);  // Create a Category object
        Product product = new Product(1L, "Laptop", "High performance laptop", "SKU123", 1000.0, 800.0, 50.0, category, "image1.jpg");
        Review review = new Review(null, product, "user123", 5, "Great product");

        Mockito.when(productService.getProductById(1L)).thenReturn(Optional.of(product)); // Mock product retrieval
        Mockito.when(reviewRepository.save(Mockito.any(Review.class))).thenReturn(review); // Mock review save

        // Act: Call the service method
        Review createdReview = reviewService.addReview(review);

        // Assert: Verify the result
        assertNotNull(createdReview);
        assertEquals("Great product", createdReview.getReviewText()); // Checking the review text
        assertEquals(5, createdReview.getRating()); // Checking the rating
        assertEquals(1L, createdReview.getProduct().getId()); // Checking the associated product's id
    }

    @Test
    void testGetReviewByIdExist() {
        // Arrange: Setup mock data with updated Product constructor with Category object
        Category category = new Category(1L, "Electronics", null);  // Create a Category object
        Product product = new Product(1L, "Laptop", "High performance laptop", "SKU123", 1000.0, 800.0, 50.0, category, "image1.jpg");
        Review review = new Review(1L, product, "user123", 5, "Great product");

        Mockito.when(reviewRepository.findById(1L)).thenReturn(Optional.of(review)); // Mock findById

        // Act: Call the service method
        Optional<Review> result = reviewService.getReviewById(1L);

        // Assert: Verify the result
        assertTrue(result.isPresent());
        assertEquals("Great product", result.get().getReviewText()); // Checking the review text
        assertEquals(1L, result.get().getProduct().getId()); // Checking associated product
    }

    @Test
    void testGetReviewByIdNotFound() {
        // Arrange: Setup mock behavior when no review is found
        Mockito.when(reviewRepository.findById(1L)).thenReturn(Optional.empty());

        // Act: Call the service method
        Optional<Review> result = reviewService.getReviewById(1L);

        // Assert: Verify the result is empty
        assertFalse(result.isPresent());
    }

    @Test
    void testGetReviewsByProductId() {
        // Arrange: Mock product and review data with Category object
        Category category = new Category(1L, "Electronics", null);  // Create a Category object
        Product product = new Product(1L, "Laptop", "High performance laptop", "SKU123", 1000.0, 800.0, 50.0, category, "image1.jpg");
        List<Review> reviews = List.of(
                new Review(1L, product, "user1", 4, "Good product"),
                new Review(2L, product, "user2", 2, "Bad product")
        );
        Mockito.when(reviewRepository.findByProduct_Id(1L)).thenReturn(reviews); // Mock review retrieval by product ID

        // Act: Call the service method
        List<Review> result = reviewService.getReviewsByProductId(1L);

        // Assert: Verify the list size and content
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Good product", result.get(0).getReviewText()); // Checking review text
        assertEquals("Bad product", result.get(1).getReviewText()); // Checking review text
    }

    @Test
    void testDeleteReview() {
        // Arrange: Setup mock data with updated Product constructor
        Category category = new Category(1L, "Electronics", null);  // Create a Category object
        Product product = new Product(1L, "Laptop", "High performance laptop", "SKU123", 1000.0, 800.0, 50.0, category, "image1.jpg");
        Review review = new Review(1L, product, "user123", 5, "Great product");

        Mockito.when(reviewRepository.findById(1L)).thenReturn(Optional.of(review));

        // Act: Call the service method
        reviewService.deleteReview(1L);

        // Assert: Verify that the deleteById method was called exactly once
        Mockito.verify(reviewRepository, Mockito.times(1)).deleteById(1L);
    }

}
