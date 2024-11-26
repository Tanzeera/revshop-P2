package com.example.auth_service.dtos;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MailRequestDto {
    private String to;
    private String subject;
    private String body;
}
