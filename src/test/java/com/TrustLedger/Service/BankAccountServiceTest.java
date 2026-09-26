package com.TrustLedger.Service;

import com.TrustLedger.DTOs.BankAccountDTO;
import com.TrustLedger.DTOs.BankAccountRequestDTO;
import com.TrustLedger.Exception.AccountNumberAlreadyExistsException;
import com.TrustLedger.Exception.CustomerNotFoundException;
import com.TrustLedger.Model.AccountStatus;
import com.TrustLedger.Model.AccountType;
import com.TrustLedger.Model.BankAccount;
import com.TrustLedger.Model.Customer;
import com.TrustLedger.Model.CustomerStatus;
import com.TrustLedger.Repository.BankAccountRepository;
import com.TrustLedger.Repository.CustomerRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class BankAccountServiceTest {

    @Mock
    private BankAccountRepository bankAccountRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private CurrentUserService currentUserService;

    @InjectMocks
    private BankAccountService bankAccountService;


    private Customer customer;

    private BankAccount account;


    @BeforeEach
    void setUp() {

        customer =
                new Customer();

        customer.setId(
                1L
        );

        customer.setFirstName(
                "Gopi"
        );

        customer.setStatus(
                CustomerStatus.ACTIVE
        );


        account =
                new BankAccount();

        account.setAccountNumber(
                10001L
        );

        account.setAccountType(
                AccountType.CHECKING
        );

        account.setBalance(
                new BigDecimal(
                        "1000.00"
                )
        );

        account.setStatus(
                AccountStatus.ACTIVE
        );

        account.setCreatedAt(
                LocalDateTime.now()
        );

        account.setCustomer(
                customer
        );
    }


    // =====================================================
    // CREATE ACCOUNT SUCCESS
    // =====================================================

    @Test
    void createBankAccount_success() {

        BankAccountRequestDTO request =
                new BankAccountRequestDTO();

        request.setAccountNumber(
                10001L
        );

        request.setAccountType(
                AccountType.CHECKING
        );

        request.setBalance(
                new BigDecimal(
                        "1000.00"
                )
        );


        when(
                bankAccountRepository
                        .existsByAccountNumber(
                                10001L
                        )
        ).thenReturn(
                false
        );


        when(
                customerRepository
                        .findById(
                                1L
                        )
        ).thenReturn(
                Optional.of(
                        customer
                )
        );


        when(
                bankAccountRepository
                        .save(
                                any(
                                        BankAccount.class
                                )
                        )
        ).thenAnswer(
                invocation ->
                        invocation.getArgument(
                                0
                        )
        );


        BankAccountDTO result =
                bankAccountService
                        .createBankAccount(
                                1L,
                                request
                        );


        assertEquals(
                10001L,
                result.getAccountNumber()
        );


        assertEquals(
                new BigDecimal(
                        "1000.00"
                ),
                result.getBalance()
        );


        assertEquals(
                AccountStatus.ACTIVE,
                result.getStatus()
        );


        verify(
                bankAccountRepository
        ).save(
                any(
                        BankAccount.class
                )
        );
    }


    // =====================================================
    // DUPLICATE ACCOUNT NUMBER
    // =====================================================

    @Test
    void createBankAccount_duplicateAccountNumber() {

        BankAccountRequestDTO request =
                new BankAccountRequestDTO();

        request.setAccountNumber(
                10001L
        );


        when(
                bankAccountRepository
                        .existsByAccountNumber(
                                10001L
                        )
        ).thenReturn(
                true
        );


        assertThrows(
                AccountNumberAlreadyExistsException.class,
                () ->
                        bankAccountService
                                .createBankAccount(
                                        1L,
                                        request
                                )
        );


        verify(
                customerRepository,
                never()
        ).findById(
                anyLong()
        );


        verify(
                bankAccountRepository,
                never()
        ).save(
                any()
        );
    }


    // =====================================================
    // CUSTOMER NOT FOUND
    // =====================================================

    @Test
    void createBankAccount_customerNotFound() {

        BankAccountRequestDTO request =
                new BankAccountRequestDTO();

        request.setAccountNumber(
                10001L
        );


        when(
                bankAccountRepository
                        .existsByAccountNumber(
                                10001L
                        )
        ).thenReturn(
                false
        );


        when(
                customerRepository
                        .findById(
                                99L
                        )
        ).thenReturn(
                Optional.empty()
        );


        assertThrows(
                CustomerNotFoundException.class,
                () ->
                        bankAccountService
                                .createBankAccount(
                                        99L,
                                        request
                                )
        );


        verify(
                bankAccountRepository,
                never()
        ).save(
                any()
        );
    }


    // =====================================================
    // GET MY ACCOUNTS SUCCESS
    // =====================================================

    @Test
    void getMyAccounts_success() {

        when(
                currentUserService
                        .getCurrentCustomerId()
        ).thenReturn(
                1L
        );


        when(
                bankAccountRepository
                        .findByCustomer_Id(
                                1L
                        )
        ).thenReturn(
                List.of(
                        account
                )
        );


        List<BankAccountDTO> result =
                bankAccountService
                        .getMyAccounts();


        assertEquals(
                1,
                result.size()
        );


        assertEquals(
                10001L,
                result.get(0)
                        .getAccountNumber()
        );
    }


    // =====================================================
    // GET MY ACCOUNTS - EMPTY LIST
    // =====================================================

    @Test
    void getMyAccounts_noAccountsFound() {

        when(
                currentUserService
                        .getCurrentCustomerId()
        ).thenReturn(
                1L
        );


        when(
                bankAccountRepository
                        .findByCustomer_Id(
                                1L
                        )
        ).thenReturn(
                List.of()
        );


        List<BankAccountDTO> result =
                bankAccountService
                        .getMyAccounts();


        assertNotNull(
                result
        );


        assertTrue(
                result.isEmpty()
        );
    }


    // =====================================================
    // UPDATE ACCOUNT STATUS
    // =====================================================

    @Test
    void updateAccountStatus_success() {

        when(
                bankAccountRepository
                        .findByAccountNumber(
                                10001L
                        )
        ).thenReturn(
                Optional.of(
                        account
                )
        );


        when(
                bankAccountRepository
                        .save(
                                account
                        )
        ).thenReturn(
                account
        );


        BankAccountDTO result =
                bankAccountService
                        .updateAccountStatus(
                                10001L,
                                AccountStatus.BLOCKED
                        );


        assertEquals(
                AccountStatus.BLOCKED,
                result.getStatus()
        );


        assertEquals(
                AccountStatus.BLOCKED,
                account.getStatus()
        );


        verify(
                bankAccountRepository
        ).save(
                account
        );
    }
}