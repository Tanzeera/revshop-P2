package com.revature.product.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;

import com.cloudinary.Cloudinary;
import com.revature.product.model.Category;
import com.revature.product.model.Product;
import com.revature.product.repository.ProductRepository;

@ExtendWith(MockitoExtension.class)
@SpringBootTest
public class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private Cloudinary cloudinary;

    @Mock
    private CategoryService categoryService;

    @InjectMocks
    private ProductService productService;


    @Test
    void testGetAllProducts() {
        Category category = new Category(1L, "Electronics", "electronics.jpg");

        List<Product> products = List.of(
                new Product(1L, "Laptop", "High performance laptop", "SKU123", 1000.0, 800.0, 50.0, category, "image1.jpg"),
                new Product(2L, "Phone", "Latest model", "SKU456", 500.0, 400.0, 100.0, category, "image2.jpg")
        );
        Mockito.when(productRepository.findAll()).thenReturn(products);

        List<Product> result = productService.getAllProducts();
        assertEquals(2, result.size());
        assertEquals("Laptop", result.get(0).getName());
        assertEquals("Phone", result.get(1).getName());
    }

    @Test
    void testGetProductByIdExist() {
        Category category = new Category(1L, "Electronics", "electronics.jpg");
        Product product = new Product(1L, "Laptop", "High performance laptop", "SKU123", 
                                      1000.0, 800.0, 50.0, category, "image1.jpg");

        Mockito.when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        Optional<Product> result = productService.getProductById(1L);
        assertTrue(result.isPresent());
        assertEquals("Laptop", result.get().getName());
        assertEquals("Electronics", result.get().getCategory().getName());
        assertEquals(800.0, result.get().getDiscountedPrice());
        assertEquals(50.0, result.get().getQuantity());
    }

    @Test
    void testGetProductByIdNotFound() {
        Mockito.when(productRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<Product> result = productService.getProductById(1L);
        assertFalse(result.isPresent());
    }

    @Test
    void testUpdateProduct() {
        Category category = new Category(1L, "Electronics", "electronics.jpg");

        Product existingProduct = new Product(1L, "Laptop", "High performance laptop", "SKU123", 
                                              1000.0, 800.0, 50.0, category, "image1.jpg");
        Product updatedProductDetails = new Product(1L, "Smartphone", "Updated model", "SKU789", 
                                                    800.0, 650.0, 60.0, category, "image2.jpg");

        Mockito.when(productRepository.findById(1L)).thenReturn(Optional.of(existingProduct));
        Mockito.when(productRepository.save(Mockito.any(Product.class))).thenReturn(updatedProductDetails);

        Product updatedProduct = productService.updateProduct(1L, updatedProductDetails);
        assertNotNull(updatedProduct);
        assertEquals("Smartphone", updatedProduct.getName());
        assertEquals("Updated model", updatedProduct.getDescription());
        assertEquals(800.0, updatedProduct.getPrice());
        assertEquals(650.0, updatedProduct.getDiscountedPrice());
        assertEquals(60.0, updatedProduct.getQuantity());
    }

    @Test
    void testDeleteProduct() {
        Category category = new Category(1L, "Electronics", "electronics.jpg");
        Product product = new Product(1L, "Laptop", "High performance laptop", "SKU123", 
                                      1000.0, 800.0, 50.0, category, "image1.jpg");

        Mockito.when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        productService.deleteProduct(1L);
        Mockito.verify(productRepository, Mockito.times(1)).delete(product);
    }

    @Test
    void testGetProductsByCategoryId() {
        Category category = new Category(1L, "Electronics", "electronics.jpg");

        List<Product> products = List.of(
                new Product(1L, "Laptop", "High performance laptop", "SKU123", 1000.0, 800.0, 50.0, category, "image1.jpg"),
                new Product(2L, "Phone", "Latest model", "SKU456", 500.0, 400.0, 100.0, category, "image2.jpg")
        );
        Mockito.when(productRepository.findByCategoryId(1L)).thenReturn(products);

        List<Product> result = productService.getProductsByCategoryId(1L);
        assertEquals(2, result.size());
        assertEquals("Laptop", result.get(0).getName());
        assertEquals("Phone", result.get(1).getName());
    }
}
