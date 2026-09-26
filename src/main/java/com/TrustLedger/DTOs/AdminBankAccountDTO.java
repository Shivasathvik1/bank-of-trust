package com.TrustLedger.DTOs;

import com.TrustLedger.Model.AccountStatus;
import com.TrustLedger.Model.AccountType;
import com.TrustLedger.Model.CustomerStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminBankAccountDTO {

    // BANK ACCOUNT
    private Long accountNumber;

    private AccountType accountType;

    private BigDecimal balance;

    private LocalDateTime createdAt;

    private AccountStatus status;


    // CUSTOMER
    private Long customerId;

    private String firstName;

    private String lastName;

    private String email;

    private String phoneNumber;

    private String address;

    private CustomerStatus customerStatus;
}