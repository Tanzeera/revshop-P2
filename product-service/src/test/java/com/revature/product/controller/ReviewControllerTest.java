package com.revature.product.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.revature.product.model.Review;
import com.revature.product.service.ReviewService;

@ExtendWith(MockitoExtension.class)

public class ReviewControllerTest {

	private MockMvc mockMvc;

	@Mock

	private ReviewService reviewService;

	@InjectMocks

	private ReviewController reviewController;

	private ObjectMapper objectMapper;

	@BeforeEach

	void setUp() {

		objectMapper = new ObjectMapper();

		mockMvc = MockMvcBuilders.standaloneSetup(reviewController).build();

	}

	@Test

	void testAddReview() throws Exception {

		Review review = Review.builder()

				.id(1L)

				.userId("user123")

				.rating(5)

				.reviewText("Great product!")

				.build();

		when(reviewService.addReview(any(Review.class))).thenReturn(review);

		mockMvc.perform(post("/reviews/add")

				.contentType(MediaType.APPLICATION_JSON)

				.content(objectMapper.writeValueAsString(review)))

				.andExpect(status().isOk())

				.andExpect(jsonPath("$.userId").value("user123"))

				.andExpect(jsonPath("$.rating").value(5))

				.andExpect(jsonPath("$.reviewText").value("Great product!"));

		verify(reviewService, times(1)).addReview(any(Review.class));

	}

	@Test

	void testGetReviewById() throws Exception {

		Review review = Review.builder()

				.id(1L)

				.userId("user123")

				.rating(5)

				.reviewText("Great product!")

				.build();

		when(reviewService.getReviewById(1L)).thenReturn(Optional.of(review));

		mockMvc.perform(get("/reviews/1"))

				.andExpect(status().isOk())

				.andExpect(jsonPath("$.userId").value("user123"))

				.andExpect(jsonPath("$.rating").value(5))

				.andExpect(jsonPath("$.reviewText").value("Great product!"));

		verify(reviewService, times(1)).getReviewById(1L);

	}

	@Test

	void testGetReviewByIdNotFound() throws Exception {

		when(reviewService.getReviewById(1L)).thenReturn(Optional.empty());

		mockMvc.perform(get("/reviews/1"))

				.andExpect(status().isNotFound());

		verify(reviewService, times(1)).getReviewById(1L);

	}

	@Test

	void testGetReviewsByProductId() throws Exception {

		Review review1 = Review.builder()

				.id(1L)

				.userId("user123")

				.rating(5)

				.reviewText("Great product!")

				.build();

		Review review2 = Review.builder()

				.id(2L)

				.userId("user456")

				.rating(4)

				.reviewText("Good product")

				.build();

		when(reviewService.getReviewsByProductId(1L)).thenReturn(Arrays.asList(review1, review2));

		mockMvc.perform(get("/reviews/product/1"))

				.andExpect(status().isOk())

				.andExpect(jsonPath("$[0].userId").value("user123"))

				.andExpect(jsonPath("$[1].userId").value("user456"));

		verify(reviewService, times(1)).getReviewsByProductId(1L);

	}

	@Test

	void testGetReviewsByUserId() throws Exception {

		Review review1 = Review.builder()

				.id(1L)

				.userId("user123")

				.rating(5)

				.reviewText("Great product!")

				.build();

		Review review2 = Review.builder()

				.id(2L)

				.userId("user123")

				.rating(4)

				.reviewText("Good product")

				.build();

		when(reviewService.getReviewsByUserId("user123")).thenReturn(Arrays.asList(review1, review2));

		mockMvc.perform(get("/reviews/user/user123"))

				.andExpect(status().isOk())

				.andExpect(jsonPath("$[0].userId").value("user123"))

				.andExpect(jsonPath("$[1].userId").value("user123"));

		verify(reviewService, times(1)).getReviewsByUserId("user123");

	}

	@Test

	void testUpdateReview() throws Exception {

		Review existingReview = Review.builder()

				.id(1L)

				.userId("user123")

				.rating(5)

				.reviewText("Great product!")

				.build();

		Review updatedReview = Review.builder()

				.id(1L)

				.userId("user123")

				.rating(4)

				.reviewText("Good product")

				.build();

		when(reviewService.updateReview(any(Review.class))).thenReturn(updatedReview);

		mockMvc.perform(put("/reviews/update")

				.contentType(MediaType.APPLICATION_JSON)

				.content(objectMapper.writeValueAsString(updatedReview)))

				.andExpect(status().isOk())

				.andExpect(jsonPath("$.userId").value("user123"))

				.andExpect(jsonPath("$.rating").value(4))

				.andExpect(jsonPath("$.reviewText").value("Good product"));

		verify(reviewService, times(1)).updateReview(any(Review.class));

	}

	@Test

	void testDeleteReview() throws Exception {

		doNothing().when(reviewService).deleteReview(1L);

		mockMvc.perform(delete("/reviews/delete/1"))

				.andExpect(status().isNoContent());

		verify(reviewService, times(1)).deleteReview(1L);

	}

}