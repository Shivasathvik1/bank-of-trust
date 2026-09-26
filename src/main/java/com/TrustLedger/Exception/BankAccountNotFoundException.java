package com.TrustLedger.Exception;

public class BankAccountNotFoundException extends RuntimeException {
    public BankAccountNotFoundException(String message){
        super(message);
    }

}
