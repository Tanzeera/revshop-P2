package com.revature.notification_service.services;

import com.revature.notification_service.dtos.ApiResponseDto;
import com.revature.notification_service.dtos.MailRequestDto;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public interface NotificationService {
    ResponseEntity<ApiResponseDto<?>> sendEmail(MailRequestDto requestDto);
}
