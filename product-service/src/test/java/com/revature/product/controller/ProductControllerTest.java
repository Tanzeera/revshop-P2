package com.revature.product.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
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
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.revature.product.model.Product;
import com.revature.product.service.ProductService;

@WebMvcTest(ProductController.class)
public class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    @Autowired
    private ObjectMapper objectMapper;

    private Product product;

    @BeforeEach
    public void setup() {
        product = Product.builder()
                .id(1L)
                .name("Test Product")
                .description("Test Description")
                .skuCode("SKU123")
                .price(100.0)
                .quantity(10.0)
                .discountedPrice(90.0)
                .imageUrl("http://test.com/image.jpg")
                .build();
    }

    @Test
    public void testCreateProduct() throws Exception {
        // Mock image file
        MockMultipartFile mockImage = new MockMultipartFile(
                "image", "test.jpg", MediaType.IMAGE_JPEG_VALUE, "Test Image Content".getBytes()
        );

        // Mock product JSON
        String productJson = objectMapper.writeValueAsString(product);
        MockMultipartFile productPart = new MockMultipartFile(
                "product", "", MediaType.APPLICATION_JSON_VALUE, productJson.getBytes()
        );

        when(productService.createProduct(any(Product.class), any(MockMultipartFile.class)))
                .thenReturn(product);

        mockMvc.perform(MockMvcRequestBuilders.multipart("/products")
                        .file(productPart)
                        .file(mockImage))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Product"));
    }

    @Test
    public void testGetAllProducts() throws Exception {
        when(productService.getAllProducts()).thenReturn(List.of(product));

        mockMvc.perform(MockMvcRequestBuilders.get("/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Test Product"));
    }

    @Test
    public void testGetProductById() throws Exception {
        when(productService.getProductById(1L)).thenReturn(Optional.of(product));

        mockMvc.perform(MockMvcRequestBuilders.get("/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Product"));
    }

    @Test
    public void testUpdateProduct() throws Exception {
        when(productService.updateProduct(anyLong(), any(Product.class))).thenReturn(product);

        mockMvc.perform(MockMvcRequestBuilders.put("/products/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(product)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Product"));
    }

    @Test
    public void testDeleteProduct() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/products/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    public void testGetProductsByCategoryId() throws Exception {
        when(productService.getProductsByCategoryId(1L)).thenReturn(List.of(product));

        mockMvc.perform(MockMvcRequestBuilders.get("/products/categoryProduct/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Test Product"));
    }
}
