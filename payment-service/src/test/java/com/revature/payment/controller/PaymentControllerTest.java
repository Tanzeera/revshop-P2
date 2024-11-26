package com.revature.payment.controller;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.Optional;

import com.revature.payment.model.PaymentDetails;
import com.revature.payment.model.PaymentStatus;
import com.revature.payment.service.PaymentService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
public class PaymentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Mock
    private PaymentService paymentService;

    @InjectMocks
    private PaymentController paymentController;

    @Autowired
    private ObjectMapper objectMapper;

    private PaymentDetails paymentDetails;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        paymentDetails = new PaymentDetails(1, "testPaymentId", "testPaymentLink", 123, 100.0, PaymentStatus.INITIATED);
    }

    // Test case for createPayment
    @Test
    public void testCreatePayment() throws Exception {
        when(paymentService.createPayment(any(PaymentDetails.class))).thenReturn(paymentDetails);

        mockMvc.perform(post("/api/payments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(paymentDetails)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.orderId").value(paymentDetails.getOrderId()))
                .andExpect(jsonPath("$.paymentId").value(paymentDetails.getPaymentId()));
    }

    // Test case for updatePaymentStatus
    @Test
    public void testUpdatePaymentStatus() throws Exception {
        paymentDetails.setStatus(PaymentStatus.SUCCESS);
        when(paymentService.updatePaymentStatus(eq(paymentDetails.getId()), eq(PaymentStatus.SUCCESS)))
                .thenReturn(paymentDetails);

        mockMvc.perform(put("/api/payments/" + paymentDetails.getId() + "/status")
                .param("status", PaymentStatus.SUCCESS.name()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(PaymentStatus.SUCCESS.name()));
    }

    // Test case for getPaymentDetails
    @Test
    public void testGetPaymentDetails() throws Exception {
        when(paymentService.getPaymentDetails(paymentDetails.getId())).thenReturn(Optional.of(paymentDetails));

        mockMvc.perform(get("/api/payments/" + paymentDetails.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderId").value(paymentDetails.getOrderId()))
                .andExpect(jsonPath("$.paymentId").value(paymentDetails.getPaymentId()));
    }

    // Test case for getPaymentDetails when payment not found
    @Test
    public void testGetPaymentDetailsNotFound() throws Exception {
        when(paymentService.getPaymentDetails(paymentDetails.getId())).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/payments/" + paymentDetails.getId()))
                .andExpect(status().isNotFound());
    }

    // Test case for getUserInfo
    @Test
    public void testGetUserInfo() throws Exception {
        String userId = "123";
        String userInfo = "{\"id\":\"123\", \"name\":\"John Doe\"}";
        when(paymentService.getUserInfo(userId)).thenReturn(userInfo);

        mockMvc.perform(get("/api/payments/user/" + userId))
                .andExpect(status().isOk())
                .andExpect(content().string(userInfo));
    }
}
