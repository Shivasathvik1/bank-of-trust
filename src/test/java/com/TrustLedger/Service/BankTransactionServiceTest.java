package com.TrustLedger.Service;

import com.TrustLedger.DTOs.BankTransactionDTO;
import com.TrustLedger.Exception.BankTransactionNotFoundException;
import com.TrustLedger.Exception.UnauthorizedAccountAccessException;
import com.TrustLedger.Model.*;
import com.TrustLedger.Repository.BankAccountRepository;
import com.TrustLedger.Repository.BankTransactionRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class BankTransactionServiceTest {


    @Mock
    private BankTransactionRepository
            bankTransactionRepository;


    @Mock
    private BankAccountRepository
            bankAccountRepository;


    @Mock
    private CurrentUserService
            currentUserService;


    @InjectMocks
    private BankTransactionService
            bankTransactionService;


    private Customer customer1;

    private Customer customer2;

    private BankAccount account1;

    private BankAccount account2;

    private BankTransaction transferTransaction;

    private BankTransaction depositTransaction;

    private BankTransaction withdrawalTransaction;


    @BeforeEach
    void setUp() {


        customer1 =
                new Customer();

        customer1.setId(
                1L
        );


        customer2 =
                new Customer();

        customer2.setId(
                2L
        );


        account1 =
                new BankAccount();

        account1.setId(
                10L
        );

        account1.setAccountNumber(
                10001L
        );

        account1.setCustomer(
                customer1
        );


        account2 =
                new BankAccount();

        account2.setId(
                20L
        );

        account2.setAccountNumber(
                20001L
        );

        account2.setCustomer(
                customer2
        );


        transferTransaction =
                new BankTransaction();

        transferTransaction.setId(
                1L
        );

        transferTransaction.setTransactionReference(
                "transfer-ref"
        );

        transferTransaction.setTransactionDateTime(
                LocalDateTime.now()
        );

        transferTransaction.setAmount(
                new BigDecimal(
                        "200.00"
                )
        );

        transferTransaction.setTransactionType(
                TransactionType.TRANSFER
        );

        transferTransaction.setStatus(
                TransactionStatus.SUCCESS
        );

        transferTransaction.setSenderAccount(
                account1
        );

        transferTransaction.setReceiverAccount(
                account2
        );

        transferTransaction.setDescription(
                "Transfer"
        );


        depositTransaction =
                new BankTransaction();

        depositTransaction.setId(
                2L
        );

        depositTransaction.setTransactionReference(
                "deposit-ref"
        );

        depositTransaction.setTransactionDateTime(
                LocalDateTime.now()
        );

        depositTransaction.setAmount(
                new BigDecimal(
                        "500.00"
                )
        );

        depositTransaction.setTransactionType(
                TransactionType.DEPOSIT
        );

        depositTransaction.setStatus(
                TransactionStatus.SUCCESS
        );

        depositTransaction.setReceiverAccount(
                account1
        );

        depositTransaction.setDescription(
                "Deposit"
        );


        withdrawalTransaction =
                new BankTransaction();

        withdrawalTransaction.setId(
                3L
        );

        withdrawalTransaction.setTransactionReference(
                "withdraw-ref"
        );

        withdrawalTransaction.setTransactionDateTime(
                LocalDateTime.now()
        );

        withdrawalTransaction.setAmount(
                new BigDecimal(
                        "100.00"
                )
        );

        withdrawalTransaction.setTransactionType(
                TransactionType.WITHDRAWAL
        );

        withdrawalTransaction.setStatus(
                TransactionStatus.SUCCESS
        );

        withdrawalTransaction.setSenderAccount(
                account1
        );

        withdrawalTransaction.setDescription(
                "ATM"
        );
    }


    // =====================================================
    // ADMIN - GET ALL TRANSACTIONS
    // =====================================================

    @Test
    void getAllTransactions_success() {


        Page<BankTransaction> page =
                new PageImpl<>(
                        List.of(
                                transferTransaction,
                                depositTransaction
                        )
                );


        when(
                bankTransactionRepository
                        .findAdminTransactions(
                                isNull(),
                                isNull(),
                                isNull(),
                                any(Pageable.class)
                        )
        ).thenReturn(
                page
        );


        Page<BankTransactionDTO> result =
                bankTransactionService
                        .getAllTransactions(
                                0,
                                10,
                                null,
                                null,
                                null
                        );


        assertEquals(
                2,
                result.getContent()
                        .size()
        );


        assertEquals(
                "transfer-ref",
                result.getContent()
                        .get(0)
                        .getTransactionReference()
        );


        assertEquals(
                "deposit-ref",
                result.getContent()
                        .get(1)
                        .getTransactionReference()
        );


        verify(
                bankTransactionRepository,
                times(1)
        ).findAdminTransactions(
                isNull(),
                isNull(),
                isNull(),
                any(Pageable.class)
        );
    }


    @Test
    void getAllTransactions_withTypeFilter() {


        Page<BankTransaction> page =
                new PageImpl<>(
                        List.of(
                                depositTransaction
                        )
                );


        when(
                bankTransactionRepository
                        .findAdminTransactions(
                                eq(
                                        TransactionType.DEPOSIT
                                ),
                                isNull(),
                                isNull(),
                                any(Pageable.class)
                        )
        ).thenReturn(
                page
        );


        Page<BankTransactionDTO> result =
                bankTransactionService
                        .getAllTransactions(
                                0,
                                10,
                                TransactionType.DEPOSIT,
                                null,
                                null
                        );


        assertEquals(
                1,
                result.getContent()
                        .size()
        );


        assertEquals(
                TransactionType.DEPOSIT,
                result.getContent()
                        .get(0)
                        .getTransactionType()
        );
    }


    @Test
    void getAllTransactions_invalidPage() {


        assertThrows(
                IllegalArgumentException.class,
                () ->
                        bankTransactionService
                                .getAllTransactions(
                                        -1,
                                        10,
                                        null,
                                        null,
                                        null
                                )
        );


        verify(
                bankTransactionRepository,
                never()
        ).findAdminTransactions(
                any(),
                any(),
                any(),
                any()
        );
    }


    @Test
    void getAllTransactions_invalidSize() {


        assertThrows(
                IllegalArgumentException.class,
                () ->
                        bankTransactionService
                                .getAllTransactions(
                                        0,
                                        0,
                                        null,
                                        null,
                                        null
                                )
        );


        assertThrows(
                IllegalArgumentException.class,
                () ->
                        bankTransactionService
                                .getAllTransactions(
                                        0,
                                        101,
                                        null,
                                        null,
                                        null
                                )
        );
    }


    @Test
    void getAllTransactions_invalidDateRange() {


        LocalDateTime fromDate =
                LocalDateTime.of(
                        2026,
                        9,
                        20,
                        0,
                        0
                );


        LocalDateTime toDate =
                LocalDateTime.of(
                        2026,
                        9,
                        10,
                        0,
                        0
                );


        assertThrows(
                IllegalArgumentException.class,
                () ->
                        bankTransactionService
                                .getAllTransactions(
                                        0,
                                        10,
                                        null,
                                        fromDate,
                                        toDate
                                )
        );
    }


    // =====================================================
    // ADMIN - GET TRANSACTION BY ID
    // =====================================================

    @Test
    void getTransactionById_success() {


        when(
                bankTransactionRepository
                        .findById(
                                1L
                        )
        ).thenReturn(
                Optional.of(
                        transferTransaction
                )
        );


        BankTransactionDTO result =
                bankTransactionService
                        .getTransactionById(
                                1L
                        );


        assertEquals(
                "transfer-ref",
                result.getTransactionReference()
        );


        assertEquals(
                TransactionType.TRANSFER,
                result.getTransactionType()
        );
    }


    @Test
    void getTransactionById_notFound() {


        when(
                bankTransactionRepository
                        .findById(
                                99L
                        )
        ).thenReturn(
                Optional.empty()
        );


        assertThrows(
                BankTransactionNotFoundException.class,
                () ->
                        bankTransactionService
                                .getTransactionById(
                                        99L
                                )
        );
    }


    // =====================================================
    // ADMIN - TRANSACTIONS BY ACCOUNT
    // =====================================================

    @Test
    void getTransactionsByAccountNumber_success() {


        when(
                bankTransactionRepository
                        .findBySenderAccount_AccountNumberOrReceiverAccount_AccountNumber(
                                10001L,
                                10001L
                        )
        ).thenReturn(
                List.of(
                        transferTransaction,
                        depositTransaction
                )
        );


        List<BankTransactionDTO> result =
                bankTransactionService
                        .getTransactionsByAccountNumber(
                                10001L
                        );


        assertEquals(
                2,
                result.size()
        );


        assertEquals(
                "DEBIT",
                result.get(0)
                        .getDirection()
        );


        assertEquals(
                "CREDIT",
                result.get(1)
                        .getDirection()
        );
    }


    @Test
    void getTransactionsByAccountNumber_notFound() {


        when(
                bankTransactionRepository
                        .findBySenderAccount_AccountNumberOrReceiverAccount_AccountNumber(
                                99999L,
                                99999L
                        )
        ).thenReturn(
                List.of()
        );


        assertThrows(
                BankTransactionNotFoundException.class,
                () ->
                        bankTransactionService
                                .getTransactionsByAccountNumber(
                                        99999L
                                )
        );
    }


    // =====================================================
    // CUSTOMER - ALL MY TRANSACTIONS
    // =====================================================

    @Test
    void getMyTransactions_transferSent_directionDebit() {


        when(
                currentUserService
                        .getCurrentCustomerId()
        ).thenReturn(
                1L
        );


        Page<BankTransaction> page =
                new PageImpl<>(
                        List.of(
                                transferTransaction
                        )
                );


        when(
                bankTransactionRepository
                        .findMyTransactions(
                                eq(
                                        1L
                                ),
                                isNull(),
                                isNull(),
                                isNull(),
                                any(Pageable.class)
                        )
        ).thenReturn(
                page
        );


        Page<BankTransactionDTO> result =
                bankTransactionService
                        .getMyTransactions(
                                0,
                                10,
                                null,
                                null,
                                null
                        );


        assertEquals(
                1,
                result.getContent()
                        .size()
        );


        assertEquals(
                "DEBIT",
                result.getContent()
                        .get(0)
                        .getDirection()
        );
    }


    @Test
    void getMyTransactions_deposit_directionCredit() {


        when(
                currentUserService
                        .getCurrentCustomerId()
        ).thenReturn(
                1L
        );


        Page<BankTransaction> page =
                new PageImpl<>(
                        List.of(
                                depositTransaction
                        )
                );


        when(
                bankTransactionRepository
                        .findMyTransactions(
                                eq(
                                        1L
                                ),
                                isNull(),
                                isNull(),
                                isNull(),
                                any(Pageable.class)
                        )
        ).thenReturn(
                page
        );


        Page<BankTransactionDTO> result =
                bankTransactionService
                        .getMyTransactions(
                                0,
                                10,
                                null,
                                null,
                                null
                        );


        assertEquals(
                "CREDIT",
                result.getContent()
                        .get(0)
                        .getDirection()
        );
    }


    @Test
    void getMyTransactions_withdrawal_directionDebit() {


        when(
                currentUserService
                        .getCurrentCustomerId()
        ).thenReturn(
                1L
        );


        Page<BankTransaction> page =
                new PageImpl<>(
                        List.of(
                                withdrawalTransaction
                        )
                );


        when(
                bankTransactionRepository
                        .findMyTransactions(
                                eq(
                                        1L
                                ),
                                isNull(),
                                isNull(),
                                isNull(),
                                any(Pageable.class)
                        )
        ).thenReturn(
                page
        );


        Page<BankTransactionDTO> result =
                bankTransactionService
                        .getMyTransactions(
                                0,
                                10,
                                null,
                                null,
                                null
                        );


        assertEquals(
                "DEBIT",
                result.getContent()
                        .get(0)
                        .getDirection()
        );
    }


    // =====================================================
    // ADMIN - REFERENCE
    // =====================================================

    @Test
    void getTransactionByReference_success() {


        when(
                bankTransactionRepository
                        .findByTransactionReference(
                                "transfer-ref"
                        )
        ).thenReturn(
                Optional.of(
                        transferTransaction
                )
        );


        BankTransactionDTO result =
                bankTransactionService
                        .getTransactionByReference(
                                "transfer-ref"
                        );


        assertEquals(
                "transfer-ref",
                result.getTransactionReference()
        );
    }


    // =====================================================
    // CUSTOMER - OWN REFERENCE
    // =====================================================

    @Test
    void getMyTransactionByReference_success() {


        when(
                currentUserService
                        .getCurrentCustomerId()
        ).thenReturn(
                1L
        );


        when(
                bankTransactionRepository
                        .findByTransactionReference(
                                "transfer-ref"
                        )
        ).thenReturn(
                Optional.of(
                        transferTransaction
                )
        );


        BankTransactionDTO result =
                bankTransactionService
                        .getMyTransactionByReference(
                                "transfer-ref"
                        );


        assertEquals(
                "DEBIT",
                result.getDirection()
        );


        assertEquals(
                "transfer-ref",
                result.getTransactionReference()
        );
    }


    @Test
    void getMyTransactionByReference_notOwner() {


        when(
                currentUserService
                        .getCurrentCustomerId()
        ).thenReturn(
                99L
        );


        when(
                bankTransactionRepository
                        .findByTransactionReference(
                                "transfer-ref"
                        )
        ).thenReturn(
                Optional.of(
                        transferTransaction
                )
        );


        assertThrows(
                UnauthorizedAccountAccessException.class,
                () ->
                        bankTransactionService
                                .getMyTransactionByReference(
                                        "transfer-ref"
                                )
        );
    }


    // =====================================================
    // CUSTOMER - ONE ACCOUNT TRANSACTIONS
    // =====================================================

    @Test
    void getMyAccountTransactions_success() {


        when(
                currentUserService
                        .getCurrentCustomer()
        ).thenReturn(
                customer1
        );


        when(
                bankAccountRepository
                        .findByAccountNumber(
                                10001L
                        )
        ).thenReturn(
                Optional.of(
                        account1
                )
        );


        Page<BankTransaction> page =
                new PageImpl<>(
                        List.of(
                                transferTransaction,
                                depositTransaction
                        )
                );


        when(
                bankTransactionRepository
                        .findAccountTransactions(
                                eq(
                                        10L
                                ),
                                isNull(),
                                isNull(),
                                isNull(),
                                any(Pageable.class)
                        )
        ).thenReturn(
                page
        );


        Page<BankTransactionDTO> result =
                bankTransactionService
                        .getMyAccountTransactions(
                                10001L,
                                0,
                                10,
                                null,
                                null,
                                null
                        );


        assertEquals(
                2,
                result.getContent()
                        .size()
        );


        assertEquals(
                "DEBIT",
                result.getContent()
                        .get(0)
                        .getDirection()
        );


        assertEquals(
                "CREDIT",
                result.getContent()
                        .get(1)
                        .getDirection()
        );
    }


    @Test
    void getMyAccountTransactions_notOwner() {


        when(
                currentUserService
                        .getCurrentCustomer()
        ).thenReturn(
                customer2
        );


        when(
                bankAccountRepository
                        .findByAccountNumber(
                                10001L
                        )
        ).thenReturn(
                Optional.of(
                        account1
                )
        );


        assertThrows(
                UnauthorizedAccountAccessException.class,
                () ->
                        bankTransactionService
                                .getMyAccountTransactions(
                                        10001L,
                                        0,
                                        10,
                                        null,
                                        null,
                                        null
                                )
        );
    }
}