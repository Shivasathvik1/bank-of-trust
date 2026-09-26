package com.TrustLedger.Service;

import com.TrustLedger.DTOs.BankTransactionDTO;
import com.TrustLedger.Exception.BankAccountNotFoundException;
import com.TrustLedger.Exception.BankTransactionNotFoundException;
import com.TrustLedger.Exception.UnauthorizedAccountAccessException;
import com.TrustLedger.Model.BankAccount;
import com.TrustLedger.Model.BankTransaction;
import com.TrustLedger.Model.Customer;
import com.TrustLedger.Model.TransactionType;
import com.TrustLedger.Repository.BankAccountRepository;
import com.TrustLedger.Repository.BankTransactionRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Service
public class BankTransactionService {

    private final BankTransactionRepository bankTransactionRepository;

    private final BankAccountRepository bankAccountRepository;

    private final CurrentUserService currentUserService;


    public BankTransactionService(
            BankTransactionRepository bankTransactionRepository,
            BankAccountRepository bankAccountRepository,
            CurrentUserService currentUserService) {

        this.bankTransactionRepository =
                bankTransactionRepository;

        this.bankAccountRepository =
                bankAccountRepository;

        this.currentUserService =
                currentUserService;
    }


    // =====================================================
    // ENTITY -> DTO
    // =====================================================

    private BankTransactionDTO convertTransactionToDTO(
            BankTransaction transaction) {

        BankTransactionDTO dto =
                new BankTransactionDTO();


        dto.setId(
                transaction.getId()
        );


        dto.setTransactionReference(
                transaction.getTransactionReference()
        );


        dto.setTransactionDateTime(
                transaction.getTransactionDateTime()
        );


        dto.setAmount(
                transaction.getAmount()
        );


        dto.setTransactionType(
                transaction.getTransactionType()
        );


        dto.setStatus(
                transaction.getStatus()
        );


        if (
                transaction.getSenderAccount()
                        != null
        ) {

            dto.setSenderAccountNumber(
                    transaction
                            .getSenderAccount()
                            .getAccountNumber()
            );
        }


        if (
                transaction.getReceiverAccount()
                        != null
        ) {

            dto.setReceiverAccountNumber(
                    transaction
                            .getReceiverAccount()
                            .getAccountNumber()
            );
        }


        dto.setDescription(
                transaction.getDescription()
        );


        return dto;
    }


    // =====================================================
    // DIRECTION RELATIVE TO CUSTOMER
    // =====================================================

    private String getTransactionDirection(
            BankTransaction transaction,
            Long customerId) {


        if (
                transaction.getTransactionType()
                        == TransactionType.DEPOSIT
        ) {

            return "CREDIT";
        }


        if (
                transaction.getTransactionType()
                        == TransactionType.WITHDRAWAL
        ) {

            return "DEBIT";
        }


        if (
                transaction.getTransactionType()
                        == TransactionType.TRANSFER
        ) {

            if (
                    transaction.getSenderAccount()
                            != null
                            &&
                            transaction
                                    .getSenderAccount()
                                    .getCustomer()
                                    .getId()
                                    .equals(customerId)
            ) {

                return "DEBIT";
            }


            return "CREDIT";
        }


        return null;
    }


    // =====================================================
    // DIRECTION RELATIVE TO ONE ACCOUNT
    // =====================================================

    private String getAccountTransactionDirection(
            BankTransaction transaction,
            Long accountNumber) {


        if (
                transaction.getTransactionType()
                        == TransactionType.DEPOSIT
        ) {

            return "CREDIT";
        }


        if (
                transaction.getTransactionType()
                        == TransactionType.WITHDRAWAL
        ) {

            return "DEBIT";
        }


        if (
                transaction.getTransactionType()
                        == TransactionType.TRANSFER
        ) {

            if (
                    transaction.getSenderAccount()
                            != null
                            &&
                            transaction
                                    .getSenderAccount()
                                    .getAccountNumber()
                                    .equals(accountNumber)
            ) {

                return "DEBIT";
            }


            if (
                    transaction.getReceiverAccount()
                            != null
                            &&
                            transaction
                                    .getReceiverAccount()
                                    .getAccountNumber()
                                    .equals(accountNumber)
            ) {

                return "CREDIT";
            }
        }


        return null;
    }


    // =====================================================
    // ADMIN
    // PAGINATED + FILTERED TRANSACTIONS
    // =====================================================

    public Page<BankTransactionDTO>
    getAllTransactions(
            int page,
            int size,
            TransactionType type,
            LocalDateTime fromDate,
            LocalDateTime toDate) {


        if (page < 0) {

            throw new IllegalArgumentException(
                    "Page number cannot be negative"
            );
        }


        if (
                size <= 0 ||
                        size > 100
        ) {

            throw new IllegalArgumentException(
                    "Page size must be between 1 and 100"
            );
        }


        if (
                fromDate != null &&
                        toDate != null &&
                        fromDate.isAfter(toDate)
        ) {

            throw new IllegalArgumentException(
                    "From date cannot be after to date"
            );
        }


        Pageable pageable =
                PageRequest.of(
                        page,
                        size
                );


        Page<BankTransaction> transactions =
                bankTransactionRepository
                        .findAdminTransactions(
                                type,
                                fromDate,
                                toDate,
                                pageable
                        );


        return transactions.map(
                this::convertTransactionToDTO
        );
    }


    // =====================================================
    // ADMIN
    // TRANSACTIONS BY CUSTOMER ID
    // =====================================================

    public List<BankTransactionDTO>
    getTransactionsByCustomerId(
            Long customerId) {


        List<BankTransaction> transactions =
                bankTransactionRepository
                        .findBySenderAccount_Customer_IdOrReceiverAccount_Customer_Id(
                                customerId,
                                customerId
                        );


        if (
                transactions.isEmpty()
        ) {

            throw new BankTransactionNotFoundException(
                    "No transactions found for customer id: "
                            + customerId
            );
        }


        List<BankTransactionDTO> dtoList =
                new ArrayList<>();


        for (
                BankTransaction transaction :
                transactions
        ) {

            dtoList.add(
                    convertTransactionToDTO(
                            transaction
                    )
            );
        }


        return dtoList;
    }


    // =====================================================
    // ADMIN
    // TRANSACTION BY ID
    // =====================================================

    public BankTransactionDTO
    getTransactionById(
            Long id) {


        BankTransaction transaction =
                bankTransactionRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new BankTransactionNotFoundException(
                                        "No transaction found with id: "
                                                + id
                                )
                        );


        return convertTransactionToDTO(
                transaction
        );
    }


    // =====================================================
    // ADMIN
    // TRANSACTIONS BY ACCOUNT NUMBER
    // =====================================================

    public List<BankTransactionDTO>
    getTransactionsByAccountNumber(
            Long accountNumber) {


        List<BankTransaction> transactions =
                bankTransactionRepository
                        .findBySenderAccount_AccountNumberOrReceiverAccount_AccountNumber(
                                accountNumber,
                                accountNumber
                        );


        if (
                transactions.isEmpty()
        ) {

            throw new BankTransactionNotFoundException(
                    "No transactions found for account number: "
                            + accountNumber
            );
        }


        List<BankTransactionDTO> dtoList =
                new ArrayList<>();


        for (
                BankTransaction transaction :
                transactions
        ) {

            BankTransactionDTO dto =
                    convertTransactionToDTO(
                            transaction
                    );


            dto.setDirection(
                    getAccountTransactionDirection(
                            transaction,
                            accountNumber
                    )
            );


            dtoList.add(dto);
        }


        return dtoList;
    }


    // =====================================================
    // CUSTOMER
    // ALL MY TRANSACTIONS
    // =====================================================

    public Page<BankTransactionDTO>
    getMyTransactions(
            int page,
            int size,
            TransactionType type,
            LocalDateTime fromDate,
            LocalDateTime toDate) {


        Long customerId =
                currentUserService
                        .getCurrentCustomerId();


        if (page < 0) {

            throw new IllegalArgumentException(
                    "Page number cannot be negative"
            );
        }


        if (
                size <= 0 ||
                        size > 100
        ) {

            throw new IllegalArgumentException(
                    "Page size must be between 1 and 100"
            );
        }


        if (
                fromDate != null &&
                        toDate != null &&
                        fromDate.isAfter(toDate)
        ) {

            throw new IllegalArgumentException(
                    "From date cannot be after to date"
            );
        }


        Pageable pageable =
                PageRequest.of(
                        page,
                        size
                );


        Page<BankTransaction> transactions =
                bankTransactionRepository
                        .findMyTransactions(
                                customerId,
                                type,
                                fromDate,
                                toDate,
                                pageable
                        );


        return transactions.map(
                transaction -> {

                    BankTransactionDTO dto =
                            convertTransactionToDTO(
                                    transaction
                            );


                    dto.setDirection(
                            getTransactionDirection(
                                    transaction,
                                    customerId
                            )
                    );


                    return dto;
                }
        );
    }


    // =====================================================
    // ADMIN
    // TRANSACTION BY REFERENCE
    // =====================================================

    public BankTransactionDTO
    getTransactionByReference(
            String transactionReference) {


        BankTransaction transaction =
                bankTransactionRepository
                        .findByTransactionReference(
                                transactionReference
                        )
                        .orElseThrow(() ->
                                new BankTransactionNotFoundException(
                                        "Transaction not found with reference: "
                                                + transactionReference
                                )
                        );


        return convertTransactionToDTO(
                transaction
        );
    }


    // =====================================================
    // CUSTOMER
    // OWN TRANSACTION BY REFERENCE
    // =====================================================

    public BankTransactionDTO
    getMyTransactionByReference(
            String transactionReference) {


        Long customerId =
                currentUserService
                        .getCurrentCustomerId();


        BankTransaction transaction =
                bankTransactionRepository
                        .findByTransactionReference(
                                transactionReference
                        )
                        .orElseThrow(() ->
                                new BankTransactionNotFoundException(
                                        "Transaction not found"
                                )
                        );


        boolean belongsToCustomer =
                false;


        if (
                transaction.getSenderAccount()
                        != null
                        &&
                        transaction
                                .getSenderAccount()
                                .getCustomer()
                                .getId()
                                .equals(customerId)
        ) {

            belongsToCustomer =
                    true;
        }


        if (
                transaction.getReceiverAccount()
                        != null
                        &&
                        transaction
                                .getReceiverAccount()
                                .getCustomer()
                                .getId()
                                .equals(customerId)
        ) {

            belongsToCustomer =
                    true;
        }


        if (
                !belongsToCustomer
        ) {

            throw new UnauthorizedAccountAccessException(
                    "You are not allowed to view this transaction"
            );
        }


        BankTransactionDTO dto =
                convertTransactionToDTO(
                        transaction
                );


        dto.setDirection(
                getTransactionDirection(
                        transaction,
                        customerId
                )
        );


        return dto;
    }


    // =====================================================
    // CUSTOMER
    // TRANSACTIONS FOR ONE OF MY ACCOUNTS
    // =====================================================

    public Page<BankTransactionDTO>
    getMyAccountTransactions(
            Long accountNumber,
            int page,
            int size,
            TransactionType type,
            LocalDateTime fromDate,
            LocalDateTime toDate) {


        Customer customer =
                currentUserService
                        .getCurrentCustomer();


        BankAccount account =
                bankAccountRepository
                        .findByAccountNumber(
                                accountNumber
                        )
                        .orElseThrow(() ->
                                new BankAccountNotFoundException(
                                        "Bank account not found"
                                )
                        );


        if (
                account.getCustomer() == null
                        ||
                        !account
                                .getCustomer()
                                .getId()
                                .equals(
                                        customer.getId()
                                )
        ) {

            throw new UnauthorizedAccountAccessException(
                    "You are not allowed to view transactions for this account"
            );
        }


        if (page < 0) {

            throw new IllegalArgumentException(
                    "Page number cannot be negative"
            );
        }


        if (
                size <= 0 ||
                        size > 100
        ) {

            throw new IllegalArgumentException(
                    "Page size must be between 1 and 100"
            );
        }


        if (
                fromDate != null &&
                        toDate != null &&
                        fromDate.isAfter(toDate)
        ) {

            throw new IllegalArgumentException(
                    "From date cannot be after to date"
            );
        }


        Pageable pageable =
                PageRequest.of(
                        page,
                        size
                );


        Page<BankTransaction> transactions =
                bankTransactionRepository
                        .findAccountTransactions(
                                account.getId(),
                                type,
                                fromDate,
                                toDate,
                                pageable
                        );


        return transactions.map(
                transaction -> {

                    BankTransactionDTO dto =
                            convertTransactionToDTO(
                                    transaction
                            );


                    dto.setDirection(
                            getAccountTransactionDirection(
                                    transaction,
                                    accountNumber
                            )
                    );


                    return dto;
                }
        );
    }
}