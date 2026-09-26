package com.TrustLedger.DTOs;

import com.TrustLedger.Model.AccountStatus;
import com.TrustLedger.Model.AccountType;
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
public class BankAccountDTO {

    private Long accountNumber;
    private AccountType accountType;
    private BigDecimal balance;
    private LocalDateTime createdAt;
    private AccountStatus status;
}
