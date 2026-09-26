package com.TrustLedger.Exception;

public class BankTransactionNotFoundException extends RuntimeException{
    public BankTransactionNotFoundException(String message){
        super(message);
    }
}
