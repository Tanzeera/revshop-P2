package com.revature.payment.model;


import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PaymentDetails extends BaseModel{
    private Integer orderId;
    private String paymentId;
    private String paymentLink;
    private Integer userId;
    private Double totalAmount;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

//
//    public String getOrderId() {
//        return orderId;
//    }
//
//    public void setOrderId(String orderId) {
//        this.orderId = orderId;
//    }
//
//    public String getPaymentId() {
//        return paymentId;
//    }
//
//    public void setPaymentId(String paymentId) {
//        this.paymentId = paymentId;
//    }
//
//    public String getPaymentLink() {
//        return paymentLink;
//    }
//
//    public void setPaymentLink(String paymentLink) {
//        this.paymentLink = paymentLink;
//    }
//
//    public PaymentStatus getStatus() {
//        return status;
//    }
//
//    public void setStatus(PaymentStatus status) {
//        this.status = status;
//    }
}


