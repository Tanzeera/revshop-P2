package com.revature.product.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.revature.product.model.Product;
import com.revature.product.repository.ProductRepository;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    private final Cloudinary cloudinary;

    @Autowired
    public ProductService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    // Create a new product with image upload
    public Product createProduct(Product product, MultipartFile imageFile) {
        try {
            // Upload image to Cloudinary
            Map<String, Object> uploadResult = cloudinary.uploader().upload(imageFile.getBytes(), ObjectUtils.emptyMap());
            String imageUrl = (String) uploadResult.get("url");
            product.setImageUrl(imageUrl); // Set the image URL

            // Save product in the database
            return productRepository.save(product);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image", e);
        }
    }

    // Get all products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Get a product by ID
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    // Update an existing product
    public Product updateProduct(Long id, Product productDetails) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id " + id));

        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setSkuCode(productDetails.getSkuCode());
        product.setPrice(productDetails.getPrice());
        product.setCategory(productDetails.getCategory());
        product.setImageUrl(productDetails.getImageUrl());
        product.setQuantity(productDetails.getQuantity());

        return productRepository.save(product);
    }

    // Delete a product
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id " + id));
        productRepository.delete(product);
    }
 // Get products by category ID
    public List<Product> getProductsByCategoryId(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }
}
