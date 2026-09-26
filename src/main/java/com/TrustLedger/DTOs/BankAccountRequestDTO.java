package com.TrustLedger.DTOs;

import com.TrustLedger.Model.AccountStatus;
import com.TrustLedger.Model.AccountType;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;


public class BankAccountRequestDTO {

    @NotNull(
            message = "Account number is required"
    )
    @Positive(
            message = "Account number must be greater than zero"
    )
    private Long accountNumber;


    @NotNull(
            message = "Account type is required"
    )
    private AccountType accountType;


    @NotNull(
            message = "Opening balance is required"
    )
    @DecimalMin(
            value = "0.00",
            inclusive = true,
            message = "Opening balance cannot be negative"
    )
    @Digits(
            integer = 13,
            fraction = 2,
            message = "Opening balance must have at most 2 decimal places"
    )
    private BigDecimal balance;


    @NotNull(
            message = "Account status is required"
    )
    private AccountStatus status;


    public BankAccountRequestDTO() {
    }


    public BankAccountRequestDTO(
            Long accountNumber,
            AccountType accountType,
            BigDecimal balance,
            AccountStatus status) {

        this.accountNumber =
                accountNumber;

        this.accountType =
                accountType;

        this.balance =
                balance;

        this.status =
                status;
    }


    public Long getAccountNumber() {

        return accountNumber;
    }


    public void setAccountNumber(
            Long accountNumber) {

        this.accountNumber =
                accountNumber;
    }


    public AccountType getAccountType() {

        return accountType;
    }


    public void setAccountType(
            AccountType accountType) {

        this.accountType =
                accountType;
    }


    public BigDecimal getBalance() {

        return balance;
    }


    public void setBalance(
            BigDecimal balance) {

        this.balance =
                balance;
    }


    public AccountStatus getStatus() {

        return status;
    }


    public void setStatus(
            AccountStatus status) {

        this.status =
                status;
    }
}