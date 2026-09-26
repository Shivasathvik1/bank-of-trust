package com.TrustLedger.DTOs;

import com.TrustLedger.Model.TransactionStatus;
import com.TrustLedger.Model.TransactionType;
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
public class BankTransactionDTO {
    private Long id;
    private String transactionReference;
    private LocalDateTime transactionDateTime;
    private BigDecimal amount;
    private TransactionType transactionType;
    private TransactionStatus status;
    private Long senderAccountNumber;
    private Long receiverAccountNumber;
    private String description;
    private String direction;


}
