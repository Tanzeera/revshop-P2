package com.revature.user.logging;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {

    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);

    // Define a pointcut to capture all methods in com.revature.controller package
    @Pointcut("execution(* com.revature..*(..))")
    public void controllerMethods() {
        // Pointcut for all controller methods
    }

    // Log before the method execution
    @Before("controllerMethods()")
    public void logBefore(JoinPoint joinPoint) {
        logger.info("Executing method: " + joinPoint.getSignature().getName());
        Object[] args = joinPoint.getArgs();
        if (args.length > 0) {
            logger.info("Arguments: ");
            for (Object arg : args) {
                logger.info("  -> " + arg);
            }
        }
    }

    // Log after successful execution of the method
    @AfterReturning(pointcut = "controllerMethods()", returning = "result")
    public void logAfterReturning(JoinPoint joinPoint, Object result) {
        logger.info("Method executed successfully: " + joinPoint.getSignature().getName());
        logger.info("Return value: " + result);
    }

    // Log if an exception is thrown by the method
    @AfterThrowing(pointcut = "controllerMethods()", throwing = "exception")
    public void logAfterThrowing(JoinPoint joinPoint, Throwable exception) {
        logger.error("Exception in method: " + joinPoint.getSignature().getName());
        logger.error("Exception: " + exception.getMessage());
    }
}