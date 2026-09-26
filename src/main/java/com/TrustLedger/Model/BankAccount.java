package com.TrustLedger.Model;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(
        name = "bank_account"
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BankAccount {


    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;


    @Column(
            unique = true,
            nullable = false
    )
    private Long accountNumber;


    @Enumerated(
            EnumType.STRING
    )
    @Column(
            nullable = false
    )
    private AccountType accountType;


    @Column(
            precision = 15,
            scale = 2,
            nullable = false
    )
    private BigDecimal balance;


    @Column(
            nullable = false
    )
    private LocalDateTime createdAt;


    @Enumerated(
            EnumType.STRING
    )
    @Column(
            nullable = false
    )
    private AccountStatus status;


    // =========================================
    // OPTIMISTIC LOCKING
    // =========================================

    @Version
    private Long version;


    // =========================================
    // CUSTOMER
    // =========================================

    @ManyToOne(
            fetch = FetchType.LAZY
    )
    @JoinColumn(
            name = "customer_id",
            nullable = false
    )
    private Customer customer;


    // =========================================
    // SENT TRANSACTIONS
    // =========================================

    @OneToMany(
            mappedBy = "senderAccount"
    )
    private List<BankTransaction>
            sentTransactions =
            new ArrayList<>();


    // =========================================
    // RECEIVED TRANSACTIONS
    // =========================================

    @OneToMany(
            mappedBy = "receiverAccount"
    )
    private List<BankTransaction>
            receivedTransactions =
            new ArrayList<>();
}