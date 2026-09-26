package com.TrustLedger.Service;

import com.TrustLedger.DTOs.AccountTransactionRequestDTO;
import com.TrustLedger.DTOs.TransferRequestDTO;
import com.TrustLedger.Exception.InsufficientBalanceException;
import com.TrustLedger.Exception.InvalidTransferException;
import com.TrustLedger.Exception.UnauthorizedAccountAccessException;
import com.TrustLedger.Model.*;
import com.TrustLedger.Repository.BankAccountRepository;
import com.TrustLedger.Repository.BankTransactionRepository;
import com.TrustLedger.Repository.UserRepository;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {


    @Mock
    private UserRepository userRepository;


    @Mock
    private BankAccountRepository bankAccountRepository;


    @Mock
    private BankTransactionRepository bankTransactionRepository;


    @Mock
    private CurrentUserService currentUserService;


    @InjectMocks
    private TransactionService transactionService;


    private Customer customer;

    private Customer receiverCustomer;

    private BankAccount senderAccount;

    private BankAccount receiverAccount;

    private User loggedInUser;


    @BeforeEach
    void setUp() {


        // =========================================
        // CUSTOMER
        // =========================================

        customer =
                new Customer();

        customer.setId(
                1L
        );

        customer.setStatus(
                CustomerStatus.ACTIVE
        );


        // =========================================
        // RECEIVER CUSTOMER
        // =========================================

        receiverCustomer =
                new Customer();

        receiverCustomer.setId(
                2L
        );

        receiverCustomer.setStatus(
                CustomerStatus.ACTIVE
        );


        // =========================================
        // SENDER ACCOUNT
        // =========================================

        senderAccount =
                new BankAccount();

        senderAccount.setAccountNumber(
                10001L
        );

        senderAccount.setBalance(
                new BigDecimal(
                        "1000.00"
                )
        );

        senderAccount.setStatus(
                AccountStatus.ACTIVE
        );

        senderAccount.setCustomer(
                customer
        );


        // =========================================
        // RECEIVER ACCOUNT
        // =========================================

        receiverAccount =
                new BankAccount();

        receiverAccount.setAccountNumber(
                20001L
        );

        receiverAccount.setBalance(
                new BigDecimal(
                        "500.00"
                )
        );

        receiverAccount.setStatus(
                AccountStatus.ACTIVE
        );

        receiverAccount.setCustomer(
                receiverCustomer
        );


        // =========================================
        // LOGGED-IN USER
        // =========================================

        loggedInUser =
                new User();

        loggedInUser.setEmail(
                "customer@test.com"
        );

        loggedInUser.setCustomer(
                customer
        );

        loggedInUser.setStatus(
                UserStatus.ACTIVE
        );


        // =========================================
        // SPRING SECURITY CONTEXT
        // =========================================

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        "customer@test.com",
                        null,
                        List.of()
                );


        SecurityContextHolder
                .getContext()
                .setAuthentication(
                        authentication
                );


        /*
         * TransactionService calls
         * userRepository.findByEmail(...)
         *
         * lenient() is used because some tests
         * may throw before reaching this call.
         */
        lenient()
                .when(
                        userRepository
                                .findByEmail(
                                        "customer@test.com"
                                )
                )
                .thenReturn(
                        Optional.of(
                                loggedInUser
                        )
                );
    }


    @AfterEach
    void tearDown() {

        SecurityContextHolder
                .clearContext();
    }


    // =====================================================
    // TRANSFER SUCCESS
    // =====================================================

    @Test
    void transferMoney_success() {


        TransferRequestDTO request =
                new TransferRequestDTO();


        request.setSenderAccountNumber(
                10001L
        );

        request.setReceiverAccountNumber(
                20001L
        );

        request.setAmount(
                new BigDecimal(
                        "200.00"
                )
        );

        request.setDescription(
                "Test transfer"
        );


        when(
                bankAccountRepository
                        .findByAccountNumber(
                                10001L
                        )
        ).thenReturn(
                Optional.of(
                        senderAccount
                )
        );


        when(
                bankAccountRepository
                        .findByAccountNumber(
                                20001L
                        )
        ).thenReturn(
                Optional.of(
                        receiverAccount
                )
        );


        when(
                currentUserService
                        .getCurrentCustomer()
        ).thenReturn(
                customer
        );


        transactionService
                .transferMoney(
                        request
                );


        assertEquals(
                new BigDecimal(
                        "800.00"
                ),
                senderAccount.getBalance()
        );


        assertEquals(
                new BigDecimal(
                        "700.00"
                ),
                receiverAccount.getBalance()
        );


        verify(
                bankAccountRepository
        ).save(
                senderAccount
        );


        verify(
                bankAccountRepository
        ).save(
                receiverAccount
        );


        ArgumentCaptor<BankTransaction> captor =
                ArgumentCaptor.forClass(
                        BankTransaction.class
                );


        verify(
                bankTransactionRepository
        ).save(
                captor.capture()
        );


        BankTransaction savedTransaction =
                captor.getValue();


        assertEquals(
                TransactionType.TRANSFER,
                savedTransaction
                        .getTransactionType()
        );


        assertEquals(
                TransactionStatus.SUCCESS,
                savedTransaction
                        .getStatus()
        );


        assertEquals(
                new BigDecimal(
                        "200.00"
                ),
                savedTransaction
                        .getAmount()
        );
    }


    // =====================================================
    // TRANSFER - INSUFFICIENT BALANCE
    // =====================================================

    @Test
    void transferMoney_insufficientBalance() {


        TransferRequestDTO request =
                new TransferRequestDTO();


        request.setSenderAccountNumber(
                10001L
        );

        request.setReceiverAccountNumber(
                20001L
        );

        request.setAmount(
                new BigDecimal(
                        "5000.00"
                )
        );


        when(
                bankAccountRepository
                        .findByAccountNumber(
                                10001L
                        )
        ).thenReturn(
                Optional.of(
                        senderAccount
                )
        );


        when(
                bankAccountRepository
                        .findByAccountNumber(
                                20001L
                        )
        ).thenReturn(
                Optional.of(
                        receiverAccount
                )
        );


        when(
                currentUserService
                        .getCurrentCustomer()
        ).thenReturn(
                customer
        );


        assertThrows(
                InsufficientBalanceException.class,
                () ->
                        transactionService
                                .transferMoney(
                                        request
                                )
        );


        verify(
                bankTransactionRepository,
                never()
        ).save(
                any()
        );
    }


    // =====================================================
    // TRANSFER - SAME ACCOUNT
    // =====================================================

    @Test
    void transferMoney_sameAccount() {

        TransferRequestDTO request =
                new TransferRequestDTO();


        request.setSenderAccountNumber(
                10001L
        );

        request.setReceiverAccountNumber(
                10001L
        );

        request.setAmount(
                new BigDecimal(
                        "100.00"
                )
        );


        assertThrows(
                InvalidTransferException.class,
                () ->
                        transactionService
                                .transferMoney(
                                        request
                                )
        );


        verifyNoInteractions(
                bankAccountRepository
        );


        verifyNoInteractions(
                bankTransactionRepository
        );
    }


    // =====================================================
    // TRANSFER - NOT OWNER
    // =====================================================

    @Test
    void transferMoney_notOwner() {


        Customer anotherCustomer =
                new Customer();


        anotherCustomer.setId(
                99L
        );

        anotherCustomer.setStatus(
                CustomerStatus.ACTIVE
        );


        TransferRequestDTO request =
                new TransferRequestDTO();


        request.setSenderAccountNumber(
                10001L
        );

        request.setReceiverAccountNumber(
                20001L
        );

        request.setAmount(
                new BigDecimal(
                        "100.00"
                )
        );


        when(
                bankAccountRepository
                        .findByAccountNumber(
                                10001L
                        )
        ).thenReturn(
                Optional.of(
                        senderAccount
                )
        );


        when(
                currentUserService
                        .getCurrentCustomer()
        ).thenReturn(
                anotherCustomer
        );


        assertThrows(
                UnauthorizedAccountAccessException.class,
                () ->
                        transactionService
                                .transferMoney(
                                        request
                                )
        );
    }


    // =====================================================
    // TRANSFER - BLOCKED SENDER
    // =====================================================

    @Test
    void transferMoney_blockedSender() {


        senderAccount.setStatus(
                AccountStatus.BLOCKED
        );


        TransferRequestDTO request =
                new TransferRequestDTO();


        request.setSenderAccountNumber(
                10001L
        );

        request.setReceiverAccountNumber(
                20001L
        );

        request.setAmount(
                new BigDecimal(
                        "100.00"
                )
        );


        when(
                bankAccountRepository
                        .findByAccountNumber(
                                10001L
                        )
        ).thenReturn(
                Optional.of(
                        senderAccount
                )
        );


        when(
                bankAccountRepository
                        .findByAccountNumber(
                                20001L
                        )
        ).thenReturn(
                Optional.of(
                        receiverAccount
                )
        );


        when(
                currentUserService
                        .getCurrentCustomer()
        ).thenReturn(
                customer
        );


        assertThrows(
                InvalidTransferException.class,
                () ->
                        transactionService
                                .transferMoney(
                                        request
                                )
        );
    }


    // =====================================================
    // DEPOSIT SUCCESS
    // =====================================================

    @Test
    void depositMoney_success() {


        AccountTransactionRequestDTO request =
                new AccountTransactionRequestDTO();


        request.setAccountNumber(
                10001L
        );

        request.setAmount(
                new BigDecimal(
                        "200.00"
                )
        );

        request.setDescription(
                "Test deposit"
        );


        when(
                bankAccountRepository
                        .findByAccountNumber(
                                10001L
                        )
        ).thenReturn(
                Optional.of(
                        senderAccount
                )
        );


        transactionService
                .depositMoney(
                        request
                );


        assertEquals(
                new BigDecimal(
                        "1200.00"
                ),
                senderAccount.getBalance()
        );


        verify(
                bankAccountRepository
        ).save(
                senderAccount
        );


        verify(
                bankTransactionRepository
        ).save(
                any(
                        BankTransaction.class
                )
        );
    }


    // =====================================================
    // DEPOSIT - NOT OWNER
    // =====================================================

    @Test
    void depositMoney_notOwner() {


        Customer anotherCustomer =
                new Customer();

        anotherCustomer.setId(
                99L
        );


        /*
         * For depositMoney(), ownership comes from
         * loggedInUser.getCustomer().
         */
        loggedInUser.setCustomer(
                anotherCustomer
        );


        AccountTransactionRequestDTO request =
                new AccountTransactionRequestDTO();


        request.setAccountNumber(
                10001L
        );

        request.setAmount(
                new BigDecimal(
                        "200.00"
                )
        );


        when(
                bankAccountRepository
                        .findByAccountNumber(
                                10001L
                        )
        ).thenReturn(
                Optional.of(
                        senderAccount
                )
        );


        assertThrows(
                UnauthorizedAccountAccessException.class,
                () ->
                        transactionService
                                .depositMoney(
                                        request
                                )
        );
    }


    // =====================================================
    // WITHDRAW SUCCESS
    // =====================================================

    @Test
    void withdrawMoney_success() {


        AccountTransactionRequestDTO request =
                new AccountTransactionRequestDTO();


        request.setAccountNumber(
                10001L
        );

        request.setAmount(
                new BigDecimal(
                        "200.00"
                )
        );

        request.setDescription(
                "ATM withdrawal"
        );


        when(
                bankAccountRepository
                        .findByAccountNumber(
                                10001L
                        )
        ).thenReturn(
                Optional.of(
                        senderAccount
                )
        );


        transactionService
                .withdrawMoney(
                        request
                );


        assertEquals(
                new BigDecimal(
                        "800.00"
                ),
                senderAccount.getBalance()
        );


        verify(
                bankAccountRepository
        ).save(
                senderAccount
        );


        verify(
                bankTransactionRepository
        ).save(
                any(
                        BankTransaction.class
                )
        );
    }


    // =====================================================
    // WITHDRAW - INSUFFICIENT BALANCE
    // =====================================================

    @Test
    void withdrawMoney_insufficientBalance() {


        AccountTransactionRequestDTO request =
                new AccountTransactionRequestDTO();


        request.setAccountNumber(
                10001L
        );

        request.setAmount(
                new BigDecimal(
                        "5000.00"
                )
        );


        when(
                bankAccountRepository
                        .findByAccountNumber(
                                10001L
                        )
        ).thenReturn(
                Optional.of(
                        senderAccount
                )
        );


        assertThrows(
                InsufficientBalanceException.class,
                () ->
                        transactionService
                                .withdrawMoney(
                                        request
                                )
        );


        verify(
                bankTransactionRepository,
                never()
        ).save(
                any()
        );
    }
}