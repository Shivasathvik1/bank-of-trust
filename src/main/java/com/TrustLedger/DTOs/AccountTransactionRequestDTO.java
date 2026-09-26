package com.TrustLedger.DTOs;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class AccountTransactionRequestDTO {

    @NotNull(message = "Account number is required")
    private Long accountNumber;

    @NotNull(message = "Amount is required")
    @DecimalMin(
            value = "0.01",
            inclusive = true,
            message = "Amount must be at least 0.01"
    )
    @Digits(
            integer = 13,
            fraction = 2,
            message = "Amount must have at most 2 decimal places"
    )
    private BigDecimal amount;

    @Size(
            max = 255,
            message = "Description cannot exceed 255 characters"
    )
    private String description;


    public AccountTransactionRequestDTO() {
    }


    public AccountTransactionRequestDTO(
            Long accountNumber,
            BigDecimal amount,
            String description) {

        this.accountNumber =
                accountNumber;

        this.amount =
                amount;

        this.description =
                description;
    }


    public Long getAccountNumber() {
        return accountNumber;
    }


    public void setAccountNumber(
            Long accountNumber) {

        this.accountNumber =
                accountNumber;
    }


    public BigDecimal getAmount() {
        return amount;
    }


    public void setAmount(
            BigDecimal amount) {

        this.amount =
                amount;
    }


    public String getDescription() {
        return description;
    }


    public void setDescription(
            String description) {

        this.description =
                description;
    }
}