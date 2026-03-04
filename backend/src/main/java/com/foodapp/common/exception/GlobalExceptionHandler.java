package com.foodapp.common.exception;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import java.time.OffsetDateTime;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

  @ExceptionHandler(NotFoundException.class)
  public ResponseEntity<ApiErrorResponse> handleNotFound(
      NotFoundException ex, HttpServletRequest request) {
    return build(HttpStatus.NOT_FOUND, ex.getMessage(), request.getRequestURI());
  }

  @ExceptionHandler(BadRequestException.class)
  public ResponseEntity<ApiErrorResponse> handleBadRequest(
      BadRequestException ex, HttpServletRequest request) {
    return build(HttpStatus.BAD_REQUEST, ex.getMessage(), request.getRequestURI());
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiErrorResponse> handleValidation(
      MethodArgumentNotValidException ex, HttpServletRequest request) {
    String msg =
        ex.getBindingResult().getFieldErrors().stream()
            .map(FieldError::getDefaultMessage)
            .collect(Collectors.joining("; "));
    return build(HttpStatus.BAD_REQUEST, msg, request.getRequestURI());
  }

  @ExceptionHandler(ConstraintViolationException.class)
  public ResponseEntity<ApiErrorResponse> handleConstraintViolation(
      ConstraintViolationException ex, HttpServletRequest request) {
    String msg =
        ex.getConstraintViolations().stream()
            .map(ConstraintViolation::getMessage)
            .collect(Collectors.joining("; "));
    return build(HttpStatus.BAD_REQUEST, msg, request.getRequestURI());
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ApiErrorResponse> handleGeneric(Exception ex, HttpServletRequest request) {
    log.error("Unhandled error at {}: {}", request.getRequestURI(), ex.getMessage(), ex);
    String message = toErrorMessage(ex);
    return build(HttpStatus.INTERNAL_SERVER_ERROR, message, request.getRequestURI());
  }

  private static String toErrorMessage(Throwable ex) {
    String name = ex.getClass().getSimpleName();
    String msg = ex.getMessage();
    if (msg != null && !msg.isBlank()) {
      return name + ": " + msg;
    }
    if (ex.getCause() != null) {
      String causeMsg = ex.getCause().getMessage();
      if (causeMsg != null && !causeMsg.isBlank()) {
        return name + " (cause: " + ex.getCause().getClass().getSimpleName() + "): " + causeMsg;
      }
      return name + " (cause: " + ex.getCause().getClass().getSimpleName() + ")";
    }
    return name + " (no message). Check server logs for stack trace.";
  }

  private ResponseEntity<ApiErrorResponse> build(HttpStatus status, String message, String path) {
    ApiErrorResponse body =
        ApiErrorResponse.builder()
            .timestamp(OffsetDateTime.now())
            .status(status.value())
            .error(status.getReasonPhrase())
            .message(message)
            .path(path)
            .build();
    return ResponseEntity.status(status).body(body);
  }
}

