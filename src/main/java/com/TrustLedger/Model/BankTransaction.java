package com.TrustLedger.Model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BankTransaction {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Long id;
    @Column(unique = true,nullable = false)
    private String transactionReference;
    private LocalDateTime transactionDateTime;
    @Column(nullable = false,scale = 2,precision = 15)
    private BigDecimal amount;
    @Enumerated(EnumType.STRING)
    private TransactionType transactionType;
    @Enumerated(EnumType.STRING)
    private TransactionStatus status;
    @ManyToOne
    @JoinColumn(name = "sender_account_id")
    private BankAccount senderAccount;

    @ManyToOne
    @JoinColumn(name = "receiver_account_id")
    private BankAccount receiverAccount;
    private String description;


}
