package com.TrustLedger.Service;

import com.TrustLedger.DTOs.AccountTransactionRequestDTO;
import java.util.Objects;
import com.TrustLedger.DTOs.TransferRequestDTO;
import com.TrustLedger.Exception.*;
import com.TrustLedger.Model.*;
import com.TrustLedger.Repository.BankAccountRepository;
import com.TrustLedger.Repository.BankTransactionRepository;
import com.TrustLedger.Repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class TransactionService {

    private final UserRepository userRepository;
    private final BankAccountRepository bankAccountRepository;
    private final BankTransactionRepository bankTransactionRepository;
    private final CurrentUserService currentUserService;


    public TransactionService(
            UserRepository userRepository,
            BankAccountRepository bankAccountRepository,
            BankTransactionRepository bankTransactionRepository,
            CurrentUserService currentUserService) {

        this.userRepository =
                userRepository;

        this.bankAccountRepository =
                bankAccountRepository;

        this.bankTransactionRepository =
                bankTransactionRepository;

        this.currentUserService =
                currentUserService;
    }


    /*
     * Money stored in the database uses scale = 2.
     *
     * Examples:
     *
     * 10      -> valid
     * 10.5    -> valid
     * 10.50   -> valid
     * 0.01    -> valid
     *
     * 0.001   -> invalid
     * 0.005   -> invalid
     */
    private BigDecimal validateMoney(
            BigDecimal amount) {

        if (amount == null) {

            throw new InvalidTransferException(
                    "Amount is required"
            );
        }


        if (amount.compareTo(
                BigDecimal.ZERO
        ) <= 0) {

            throw new InvalidTransferException(
                    "Amount must be greater than zero"
            );
        }


        /*
         * Do NOT silently round money.
         *
         * setScale(2, UNNECESSARY)
         * means:
         *
         * 10.50 -> accepted
         * 10.5  -> accepted
         * 0.005 -> exception
         */
        try {

            amount =
                    amount.setScale(
                            2,
                            RoundingMode.UNNECESSARY
                    );

        } catch (
                ArithmeticException exception
        ) {

            throw new InvalidTransferException(
                    "Amount cannot have more than 2 decimal places"
            );
        }


        /*
         * NUMERIC(15,2)
         *
         * 13 digits are allowed
         * before the decimal point.
         */
        BigDecimal maximumAmount =
                new BigDecimal(
                        "9999999999999.99"
                );


        if (amount.compareTo(
                maximumAmount
        ) > 0) {

            throw new InvalidTransferException(
                    "Amount is too large"
            );
        }


        return amount;
    }


    @Transactional
    public void transferMoney(
            TransferRequestDTO requestDTO) {

        BigDecimal amount =
                validateMoney(
                        requestDTO.getAmount()
                );

        if (
                Objects.equals(
                        requestDTO.getSenderAccountNumber(),
                        requestDTO.getReceiverAccountNumber()
                )
        ) {

            throw new InvalidTransferException(
                    "Sender and receiver accounts cannot be the same"
            );
        }


        BankAccount senderAccount =
                bankAccountRepository
                        .findByAccountNumber(
                                requestDTO
                                        .getSenderAccountNumber()
                        )
                        .orElseThrow(() ->
                                new BankAccountNotFoundException(
                                        "Sender account not found"
                                )
                        );


        String loggedInEmail =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();


        User loggedInUser =
                userRepository
                        .findByEmail(
                                loggedInEmail
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        Customer loggedInCustomer =
                currentUserService
                        .getCurrentCustomer();


        if (!senderAccount
                .getCustomer()
                .getId()
                .equals(
                        loggedInCustomer
                                .getId()
                )) {

            throw new UnauthorizedAccountAccessException(
                    "You are not allowed to transfer from this account"
            );
        }


        BankAccount receiverAccount =
                bankAccountRepository
                        .findByAccountNumber(
                                requestDTO
                                        .getReceiverAccountNumber()
                        )
                        .orElseThrow(() ->
                                new BankAccountNotFoundException(
                                        "Receiver account not found"
                                )
                        );


        if (
                senderAccount.getStatus()
                        !=
                        AccountStatus.ACTIVE
        ) {

            throw new InvalidTransferException(
                    "Sender account is not active"
            );
        }


        if (
                receiverAccount.getStatus()
                        !=
                        AccountStatus.ACTIVE
        ) {

            throw new InvalidTransferException(
                    "Receiver account is not active"
            );
        }


        /*
         * Sender customer must be ACTIVE.
         */
        if (
                senderAccount
                        .getCustomer()
                        .getStatus()
                        !=
                        CustomerStatus.ACTIVE
        ) {

            throw new InvalidTransferException(
                    "Sender customer is not active"
            );
        }


        /*
         * Receiver customer must be ACTIVE.
         */
        if (
                receiverAccount
                        .getCustomer()
                        .getStatus()
                        !=
                        CustomerStatus.ACTIVE
        ) {

            throw new InvalidTransferException(
                    "Receiver customer is not active"
            );
        }


        if (senderAccount
                .getBalance()
                .compareTo(
                        amount
                ) < 0) {

            throw new InsufficientBalanceException(
                    "Insufficient balance"
            );
        }


        BigDecimal senderNewBalance =
                senderAccount
                        .getBalance()
                        .subtract(amount)
                        .setScale(
                                2,
                                RoundingMode.UNNECESSARY
                        );


        BigDecimal receiverNewBalance =
                receiverAccount
                        .getBalance()
                        .add(amount)
                        .setScale(
                                2,
                                RoundingMode.UNNECESSARY
                        );


        senderAccount.setBalance(
                senderNewBalance
        );


        receiverAccount.setBalance(
                receiverNewBalance
        );


        bankAccountRepository.save(
                senderAccount
        );


        bankAccountRepository.save(
                receiverAccount
        );


        BankTransaction transaction =
                new BankTransaction();


        transaction.setTransactionReference(
                UUID.randomUUID()
                        .toString()
        );


        transaction.setTransactionDateTime(
                LocalDateTime.now()
        );


        transaction.setAmount(
                amount
        );


        transaction.setTransactionType(
                TransactionType.TRANSFER
        );


        transaction.setStatus(
                TransactionStatus.SUCCESS
        );


        transaction.setSenderAccount(
                senderAccount
        );


        transaction.setReceiverAccount(
                receiverAccount
        );


        transaction.setDescription(
                requestDTO
                        .getDescription()
        );


        bankTransactionRepository.save(
                transaction
        );
    }


    @Transactional
    public void depositMoney(
            AccountTransactionRequestDTO requestDTO) {

        BigDecimal amount =
                validateMoney(
                        requestDTO.getAmount()
                );


        BankAccount account =
                bankAccountRepository
                        .findByAccountNumber(
                                requestDTO
                                        .getAccountNumber()
                        )
                        .orElseThrow(() ->
                                new BankAccountNotFoundException(
                                        "Account not found"
                                )
                        );


        String loggedInEmail =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();


        User loggedInUser =
                userRepository
                        .findByEmail(
                                loggedInEmail
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        Customer loggedInCustomer =
                loggedInUser
                        .getCustomer();


        if (!account
                .getCustomer()
                .getId()
                .equals(
                        loggedInCustomer
                                .getId()
                )) {

            throw new UnauthorizedAccountAccessException(
                    "You are not allowed to deposit into this account"
            );
        }


        if (
                account.getStatus()
                        !=
                        AccountStatus.ACTIVE
        ) {

            throw new InvalidTransferException(
                    "Account is not active"
            );
        }


        BigDecimal newBalance =
                account
                        .getBalance()
                        .add(amount)
                        .setScale(
                                2,
                                RoundingMode.UNNECESSARY
                        );


        /*
         * BankAccount balance uses
         * NUMERIC(15,2).
         */
        BigDecimal maximumBalance =
                new BigDecimal(
                        "9999999999999.99"
                );


        if (newBalance.compareTo(
                maximumBalance
        ) > 0) {

            throw new InvalidTransferException(
                    "Account balance would exceed the maximum allowed amount"
            );
        }


        account.setBalance(
                newBalance
        );


        bankAccountRepository.save(
                account
        );


        BankTransaction transaction =
                new BankTransaction();


        transaction.setTransactionReference(
                UUID.randomUUID()
                        .toString()
        );


        transaction.setTransactionDateTime(
                LocalDateTime.now()
        );


        transaction.setAmount(
                amount
        );


        transaction.setTransactionType(
                TransactionType.DEPOSIT
        );


        transaction.setStatus(
                TransactionStatus.SUCCESS
        );


        transaction.setReceiverAccount(
                account
        );


        transaction.setDescription(
                requestDTO
                        .getDescription()
        );


        bankTransactionRepository.save(
                transaction
        );
    }


    @Transactional
    public void withdrawMoney(
            AccountTransactionRequestDTO requestDTO) {

        BigDecimal amount =
                validateMoney(
                        requestDTO.getAmount()
                );


        BankAccount account =
                bankAccountRepository
                        .findByAccountNumber(
                                requestDTO
                                        .getAccountNumber()
                        )
                        .orElseThrow(() ->
                                new BankAccountNotFoundException(
                                        "Account not found"
                                )
                        );


        String loggedInEmail =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();


        User loggedInUser =
                userRepository
                        .findByEmail(
                                loggedInEmail
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        Customer loggedInCustomer =
                loggedInUser
                        .getCustomer();


        if (!account
                .getCustomer()
                .getId()
                .equals(
                        loggedInCustomer
                                .getId()
                )) {

            throw new UnauthorizedAccountAccessException(
                    "You are not allowed to withdraw from this account"
            );
        }


        if (
                account.getStatus()
                        !=
                        AccountStatus.ACTIVE
        ) {

            throw new InvalidTransferException(
                    "Account is not active"
            );
        }


        if (account
                .getBalance()
                .compareTo(
                        amount
                ) < 0) {

            throw new InsufficientBalanceException(
                    "Insufficient balance"
            );
        }


        BigDecimal newBalance =
                account
                        .getBalance()
                        .subtract(amount)
                        .setScale(
                                2,
                                RoundingMode.UNNECESSARY
                        );


        account.setBalance(
                newBalance
        );


        bankAccountRepository.save(
                account
        );


        BankTransaction transaction =
                new BankTransaction();


        transaction.setTransactionReference(
                UUID.randomUUID()
                        .toString()
        );


        transaction.setTransactionDateTime(
                LocalDateTime.now()
        );


        transaction.setAmount(
                amount
        );


        transaction.setTransactionType(
                TransactionType.WITHDRAWAL
        );


        transaction.setStatus(
                TransactionStatus.SUCCESS
        );


        transaction.setSenderAccount(
                account
        );


        transaction.setDescription(
                requestDTO
                        .getDescription()
        );


        bankTransactionRepository.save(
                transaction
        );
    }
}