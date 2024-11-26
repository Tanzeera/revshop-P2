package com.revature.order.service;

import java.util.List;
import java.util.Optional;

import com.revature.order.dtos.MailRequestDto;
import com.revature.order.feigns.NotificationService;
import com.revature.order.model.OrderLineItems;
import com.revature.order.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.revature.order.model.Order;
import com.revature.order.repository.OrderRepository;

import reactor.core.publisher.Mono;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final WebClient.Builder webClientBuilder;

    @Autowired
    private NotificationService notificationService;

    public OrderService(OrderRepository orderRepository, WebClient.Builder webClientBuilder) {
        this.orderRepository = orderRepository;
        this.webClientBuilder = webClientBuilder;
    }

    // Create a new order
    public Order createOrder(Order order) {
        // Save order to the database
        return orderRepository.save(order);
    }

    // Get user info from the UserService
    public Mono<String> getUserInfo(String userId) {
        return webClientBuilder.build()
                .get()
                .uri("http://user-service/users/" + userId) // User service
                .retrieve()
                .bodyToMono(String.class);
    }

    // Get product info from ProductService
    public Mono<String> getProductInfo(String productId) {
        return webClientBuilder.build()
                .get()
                .uri("http://product-service/products/" + productId) // Product service
                .retrieve()
                .bodyToMono(String.class);
    }

    // Get cart info from CartService
    public Mono<String> getCartInfo(String cartId) {
        return webClientBuilder.build()
                .get()
                .uri("http://cart-service/cart/" + cartId) // Cart service
                .retrieve()
                .bodyToMono(String.class);
    }

    // Find order by ID
    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public List<Order> getOrderByUserId(Integer userId) {
        return orderRepository.findByUserId(userId);
    }

    public List<Order> getAllOrder() {
        return orderRepository.findAll();
    }

    // Update an existing order
    public Optional<Order> updateOrder(Long id, Order orderDetails) {
        return orderRepository.findById(id).map(order -> {
            // order.setBillingAddress(orderDetails.getBillingAddress());
            order.setStatus(orderDetails.getStatus());
            // order.setTotalAmount(orderDetails.getTotalAmount());
            // order.setUserId(orderDetails.getUserId());
            // order.setOrderType(orderDetails.getOrderType());
            return orderRepository.save(order);
        });
    }

    public void sendOrderSuccessEmail(User user, Order order) {
        String logoUrl = "https://res.cloudinary.com/dbleggv6z/image/upload/v1731652628/RevShop/logo9090_qzlz4t.png";
        String subject = "Your Order Confirmation - RevShop";

        // Build the order items table
        StringBuilder itemsTable = new StringBuilder();
        itemsTable.append("<table style='width: 100%; border-collapse: collapse; margin-top: 10px;'>")
                .append("<tr style='background-color: #f5f5f5;'>")
                .append("<th style='padding: 8px; border: 1px solid #ddd;'>Item Name</th>")
                .append("<th style='padding: 8px; border: 1px solid #ddd;'>Price</th>")
                .append("<th style='padding: 8px; border: 1px solid #ddd;'>Quantity</th>")
                .append("<th style='padding: 8px; border: 1px solid #ddd;'>Total</th>")
                .append("</tr>");

        for (OrderLineItems item : order.getOrderLineItems()) {
            itemsTable.append("<tr>")
                    .append("<td style='padding: 8px; border: 1px solid #ddd;'>").append(item.getName()).append("</td>")
                    .append("<td style='padding: 8px; border: 1px solid #ddd;'>$").append(item.getPrice()).append("</td>")
                    .append("<td style='padding: 8px; border: 1px solid #ddd;'>").append(item.getQuantity()).append("</td>")
                    .append("<td style='padding: 8px; border: 1px solid #ddd;'>$").append(item.getPrice() * item.getQuantity()).append("</td>")
                    .append("</tr>");
        }

        itemsTable.append("</table>");

        // Build the email content
        String content = "<div style='font-family: Arial, sans-serif; color: #333; line-height: 1.5;'>"
                + "<div style='text-align: center; margin-bottom: 20px;'>"
                + "<img src='" + logoUrl + "' alt='RevShop Logo' style='width: 150px; height: auto;' />"
                + "</div>"
                + "<h1 style='text-align: center; color: #444;'>Thank you for your order, " + user.getFirstName() + "!</h1>"
                + "<p style='text-align: center;'>We appreciate your purchase from RevShop. Here are the details of your order:</p>"
                + "<div style='background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;'>"
                + "<h2 style='color: #444;'>Order Details</h2>"
                + "<p><strong>Order ID:</strong> " + order.getId() + "</p>"
                + "<p><strong>Order Type:</strong> " + order.getOrderType() + "</p>"
                + "<p><strong>Status:</strong> " + order.getStatus() + "</p>"
                + "<p><strong>Billing Address:</strong> " + order.getBillingAddress() + "</p>"
                + itemsTable.toString()
                + "<h3 style='text-align: right; color: #444;'>Total Amount: $" + order.getTotalAmount() + "</h3>"
                + "</div>"
                + "<p>Thank you for shopping with us! If you have any questions, feel free to contact our support team.</p>"
                + "<p style='text-align: center;'><strong>Welcome to RevShop!</strong></p>"
                + "<p style='text-align: center;'>RevShop Team</p>"
                + "</div>";

        // Create and send the email
        MailRequestDto mail = MailRequestDto.builder()
                .subject(subject)
                .body(content)
                .to(user.getEmail())
                .build();

        notificationService.sendEmail(mail);
    }


}
