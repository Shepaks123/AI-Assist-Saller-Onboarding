package com.example.selleronboarding.exception;

import org.springframework.http.HttpStatus;

/** Throw this from a service to send a clean {"message": "..."} error to the frontend. */
public class ApiException extends RuntimeException {
    private final HttpStatus status;

    public ApiException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() { return status; }
}
