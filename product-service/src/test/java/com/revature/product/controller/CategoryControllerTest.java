package com.revature.product.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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
import com.revature.product.model.Category;
import com.revature.product.service.CategoryService;

@ExtendWith(MockitoExtension.class) // Add this annotation

class CategoryControllerTest {

	@Mock

	private CategoryService categoryService;

	@InjectMocks

	private CategoryController categoryController;

	private MockMvc mockMvc;

	@BeforeEach

	void setUp() {

		mockMvc = MockMvcBuilders.standaloneSetup(categoryController).build();

	}

	@Test

	void testCreateCategory() throws Exception {

		Category category = Category.builder()

				.id(1L)

				.name("Electronics")

				.imageName("electronics.png")

				.build();

		when(categoryService.createCategory(any(Category.class))).thenReturn(category);

		mockMvc.perform(post("/categories")

				.contentType(MediaType.APPLICATION_JSON)

				.content(new ObjectMapper().writeValueAsString(category)))

				.andExpect(status().isOk())

				.andExpect(jsonPath("$.id").value(1))

				.andExpect(jsonPath("$.name").value("Electronics"))

				.andExpect(jsonPath("$.imageName").value("electronics.png"));

		verify(categoryService, times(1)).createCategory(any(Category.class));

	}

	@Test

	void testGetAllCategories() throws Exception {

		Category category1 = Category.builder().id(1L).name("Electronics").imageName("electronics.png").build();

		Category category2 = Category.builder().id(2L).name("Clothing").imageName("clothing.png").build();

		when(categoryService.getAllCategories()).thenReturn(Arrays.asList(category1, category2));

		mockMvc.perform(get("/categories"))

				.andExpect(status().isOk())

				.andExpect(jsonPath("$[0].name").value("Electronics"))

				.andExpect(jsonPath("$[1].name").value("Clothing"));

		verify(categoryService, times(1)).getAllCategories();

	}

	@Test

	void testGetCategoryById() throws Exception {

		Category category = Category.builder().id(1L).name("Electronics").imageName("electronics.png").build();

		lenient().when(categoryService.getCategoryById(1L)).thenReturn(Optional.of(category));

		mockMvc.perform(get("/categories/1"))

				.andExpect(status().isOk())

				.andExpect(jsonPath("$.name").value("Electronics"))

				.andExpect(jsonPath("$.imageName").value("electronics.png"));

		verify(categoryService, times(1)).getCategoryById(1L);

	}

	@Test

	void testGetCategoryById_NotFound() throws Exception {

		when(categoryService.getCategoryById(1L)).thenReturn(Optional.empty());

		mockMvc.perform(get("/categories/1"))

				.andExpect(status().isNotFound());

		verify(categoryService, times(1)).getCategoryById(1L);

	}

//    @Test

//    void testUpdateCategory() throws Exception {

//        Category existingCategory = Category.builder().id(1L).name("Electronics").imageName("electronics.png").build();

//        Category updatedCategory = Category.builder().id(1L).name("Updated Electronics").imageName("updated_electronics.png").build();

//

//        // Remove unnecessary lenient stubbing for getCategoryById

//        lenient().when(categoryService.updateCategory(eq(1L), any(Category.class))).thenReturn(updatedCategory);

//

//        mockMvc.perform(put("/categories/1")

//                            .contentType(MediaType.APPLICATION_JSON)

//                            .content(new ObjectMapper().writeValueAsString(updatedCategory)))

//                    .andExpect(status().isOk())

//                    .andExpect(jsonPath("$.name").value("Updated Electronics"))

//                    .andExpect(jsonPath("$.imageName").value("updated_electronics.png"));

//

//        verify(categoryService, times(1)).updateCategory(eq(1L), any(Category.class));

//    }

//	@Test
//
//	void testDeleteCategory() throws Exception {
//
//		Category category = Category.builder().id(1L).name("Electronics").imageName("electronics.png").build();
//
//		when(categoryService.getCategoryById(1L)).thenReturn(Optional.of(category));
//
//		mockMvc.perform(delete("/categories/1"))
//
//				.andExpect(status().isNoContent());
//
//		verify(categoryService, times(1)).deleteCategory(1L);
//
//	}

}