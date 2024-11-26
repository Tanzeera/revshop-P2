package com.revature.product.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.revature.product.model.Review;
import com.revature.product.repository.ReviewRepository;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    public Review addReview(Review review) {
        return reviewRepository.save(review);
    }

    public Optional<Review> getReviewById(Long reviewId) {
        return reviewRepository.findById(reviewId);
    }

    public List<Review> getReviewsByProductId(Long productId) {
        return reviewRepository.findByProduct_Id(productId);
    }

    public List<Review> getReviewsByUserId(String userId) {
        return reviewRepository.findByUserId(userId);
    }

    public Review updateReview(Review review) {
        if (reviewRepository.existsById(review.getId())) {
            return reviewRepository.save(review);
        }
        return null; // Handle review not found (could throw exception)
    }

    public void deleteReview(Long reviewId) {
        reviewRepository.deleteById(reviewId);
    }

    public List<Review> getAllReview() {
        return reviewRepository.findAll();
    }

    public Double getAverageRatingByProductId(Long productId) {
        List<Review> reviews = reviewRepository.findByProduct_Id(productId);
        return reviews.isEmpty() ? 0.0
                : reviews.stream()
                        .mapToInt(Review::getRating)
                        .average()
                        .orElse(0.0);
    }
}
