package com.revature.product.service;

import com.revature.product.model.Category;
import com.revature.product.repository.CategoryRepository;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryService categoryService;

    @Test
    void testCreateCategory() {
        Category category = new Category(1L, "Electronics", "electronics.jpg");
        Mockito.when(categoryRepository.save(Mockito.any(Category.class))).thenReturn(category);

        Category createdCategory = categoryService.createCategory(category);
        assertNotNull(createdCategory);
        assertEquals("Electronics", createdCategory.getName());
    }

    @Test
    void testGetAllCategories() {
        List<Category> categories = List.of(
                new Category(1L, "Electronics", "electronics.jpg"),
                new Category(2L, "Books", "books.jpg")
        );
        Mockito.when(categoryRepository.findAll()).thenReturn(categories);

        List<Category> result = categoryService.getAllCategories();
        assertEquals(2, result.size());
    }

    @Test
    void testGetCategoryByIdExist() {
        Category category = new Category(1L, "Electronics", "electronics.jpg");
        Mockito.when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));

        Optional<Category> result = categoryService.getCategoryById(1L);
        assertTrue(result.isPresent());
        assertEquals("Electronics", result.get().getName());
    }

    @Test
    void testGetCategoryByIdNotFound() {
        Mockito.when(categoryRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<Category> result = categoryService.getCategoryById(1L);
        assertFalse(result.isPresent());
    }

    @Test
    void testUpdateCategory() {
        Category existingCategory = new Category(1L, "Electronics", "electronics.jpg");
        Category updatedCategoryDetails = new Category(1L, "Home Appliances", "home_appliances.jpg");

        Mockito.when(categoryRepository.findById(1L)).thenReturn(Optional.of(existingCategory));
        Mockito.when(categoryRepository.save(Mockito.any(Category.class))).thenReturn(updatedCategoryDetails);

        Category updatedCategory = categoryService.updateCategory(1L, updatedCategoryDetails);
        assertNotNull(updatedCategory);
        assertEquals("Home Appliances", updatedCategory.getName());
    }

    @Test
    void testDeleteCategory() {
        Category category = new Category(1L, "Electronics", "electronics.jpg");
        Mockito.when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));

        categoryService.deleteCategory(1L);
        Mockito.verify(categoryRepository, Mockito.times(1)).delete(category);
    }
}
