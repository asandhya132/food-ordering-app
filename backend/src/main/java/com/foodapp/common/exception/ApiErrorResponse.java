package com.foodapp.common.exception;

import java.time.OffsetDateTime;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiErrorResponse {
  private OffsetDateTime timestamp;
  private int status;
  private String error;
  private String message;
  private String path;
}

