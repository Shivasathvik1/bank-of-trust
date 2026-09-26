package com.TrustLedger.DTOs;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class TransferRequestDTO {

    @NotNull(message = "Sender account number is required")
    private Long senderAccountNumber;

    @NotNull(message = "Receiver account number is required")
    private Long receiverAccountNumber;

    @NotNull(message = "Transfer amount is required")
    @DecimalMin(
            value = "0.01",
            inclusive = true,
            message = "Transfer amount must be at least 0.01"
    )
    @Digits(
            integer = 13,
            fraction = 2,
            message = "Transfer amount must have at most 2 decimal places"
    )
    private BigDecimal amount;

    @Size(
            max = 255,
            message = "Description cannot exceed 255 characters"
    )
    private String description;


    public TransferRequestDTO() {
    }


    public TransferRequestDTO(
            Long senderAccountNumber,
            Long receiverAccountNumber,
            BigDecimal amount,
            String description) {

        this.senderAccountNumber =
                senderAccountNumber;

        this.receiverAccountNumber =
                receiverAccountNumber;

        this.amount =
                amount;

        this.description =
                description;
    }


    public Long getSenderAccountNumber() {
        return senderAccountNumber;
    }


    public void setSenderAccountNumber(
            Long senderAccountNumber) {

        this.senderAccountNumber =
                senderAccountNumber;
    }


    public Long getReceiverAccountNumber() {
        return receiverAccountNumber;
    }


    public void setReceiverAccountNumber(
            Long receiverAccountNumber) {

        this.receiverAccountNumber =
                receiverAccountNumber;
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