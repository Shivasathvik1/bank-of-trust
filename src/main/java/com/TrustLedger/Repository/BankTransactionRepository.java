package com.TrustLedger.Repository;

import com.TrustLedger.Model.BankAccount;
import com.TrustLedger.Model.BankTransaction;
import com.TrustLedger.Model.TransactionType;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BankTransactionRepository
        extends JpaRepository<BankTransaction, Long> {

    List<BankTransaction>
    findBySenderAccount_Customer_IdOrReceiverAccount_Customer_Id(
            Long senderCustomerId,
            Long receiverCustomerId
    );

    List<BankTransaction>
    findBySenderAccount_AccountNumberOrReceiverAccount_AccountNumber(
            Long senderAccountNumber,
            Long receiverAccountNumber
    );

    Optional<BankTransaction>
    findByTransactionReference(
            String transactionReference
    );

    @Query("""
           SELECT t
           FROM BankTransaction t
           LEFT JOIN t.senderAccount sender
           LEFT JOIN t.receiverAccount receiver
           WHERE (
               sender.customer.id = :customerId
               OR receiver.customer.id = :customerId
           )
           AND (:type IS NULL OR t.transactionType = :type)
           AND (:fromDate IS NULL OR t.transactionDateTime >= :fromDate)
           AND (:toDate IS NULL OR t.transactionDateTime <= :toDate)
           ORDER BY t.transactionDateTime DESC
           """)
    Page<BankTransaction> findMyTransactions(
            @Param("customerId") Long customerId,
            @Param("type") TransactionType type,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            Pageable pageable
    );
    Page<BankTransaction>
    findBySenderAccountOrReceiverAccountOrderByTransactionDateTimeDesc(
            BankAccount senderAccount,
            BankAccount receiverAccount,
            Pageable pageable
    );
    @Query("""
       SELECT t
       FROM BankTransaction t
       WHERE
       (
            t.senderAccount.id = :accountId
            OR
            t.receiverAccount.id = :accountId
       )
       AND (
            :type IS NULL
            OR
            t.transactionType = :type
       )
       AND (
            :fromDate IS NULL
            OR
            t.transactionDateTime >= :fromDate
       )
       AND (
            :toDate IS NULL
            OR
            t.transactionDateTime <= :toDate
       )
       ORDER BY
            t.transactionDateTime DESC
       """)
    Page<BankTransaction> findAccountTransactions(
            @Param("accountId")
            Long accountId,

            @Param("type")
            TransactionType type,

            @Param("fromDate")
            LocalDateTime fromDate,

            @Param("toDate")
            LocalDateTime toDate,

            Pageable pageable
    );
    @Query("""
       SELECT t
       FROM BankTransaction t
       WHERE
           (:type IS NULL
                OR t.transactionType = :type)
       AND
           (:fromDate IS NULL
                OR t.transactionDateTime >= :fromDate)
       AND
           (:toDate IS NULL
                OR t.transactionDateTime <= :toDate)
       ORDER BY
           t.transactionDateTime DESC
       """)
    Page<BankTransaction> findAdminTransactions(

            @Param("type")
            TransactionType type,

            @Param("fromDate")
            LocalDateTime fromDate,

            @Param("toDate")
            LocalDateTime toDate,

            Pageable pageable
    );
}