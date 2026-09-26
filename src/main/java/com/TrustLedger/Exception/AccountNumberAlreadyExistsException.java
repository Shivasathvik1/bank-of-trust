package com.TrustLedger.Exception;

public class AccountNumberAlreadyExistsException extends RuntimeException {
    public AccountNumberAlreadyExistsException(String message) {
        super(message);
    }
}
