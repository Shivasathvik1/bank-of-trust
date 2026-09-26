package com.TrustLedger.Exception;

public class ConcurrentTransactionException extends RuntimeException {
    public ConcurrentTransactionException(String message) {
        super(message);
    }
}
