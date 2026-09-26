package com.TrustLedger.Service;

import com.TrustLedger.DTOs.AdminBankAccountDTO;
import com.TrustLedger.DTOs.BankAccountDTO;
import com.TrustLedger.DTOs.BankAccountRequestDTO;

import com.TrustLedger.Exception.AccountNumberAlreadyExistsException;
import com.TrustLedger.Exception.BankAccountNotFoundException;
import com.TrustLedger.Exception.CustomerNotFoundException;
import com.TrustLedger.Exception.UnauthorizedAccountAccessException;

import com.TrustLedger.Model.AccountStatus;
import com.TrustLedger.Model.BankAccount;
import com.TrustLedger.Model.Customer;
import com.TrustLedger.Model.CustomerStatus;

import com.TrustLedger.Repository.BankAccountRepository;
import com.TrustLedger.Repository.CustomerRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Service
public class BankAccountService {

    private final BankAccountRepository
            bankAccountRepository;

    private final CustomerRepository
            customerRepository;

    private final CurrentUserService
            currentUserService;


    public BankAccountService(
            BankAccountRepository bankAccountRepository,
            CustomerRepository customerRepository,
            CurrentUserService currentUserService) {

        this.bankAccountRepository =
                bankAccountRepository;

        this.customerRepository =
                customerRepository;

        this.currentUserService =
                currentUserService;
    }


    // =========================================
    // CREATE BANK ACCOUNT
    // =========================================

    public BankAccountDTO createBankAccount(
            Long customerId,
            BankAccountRequestDTO requestDTO) {

        if (
                bankAccountRepository
                        .existsByAccountNumber(
                                requestDTO.getAccountNumber()
                        )
        ) {

            throw new AccountNumberAlreadyExistsException(
                    "Account number already exists: "
                            + requestDTO.getAccountNumber()
            );
        }


        Customer customer =
                customerRepository
                        .findById(customerId)
                        .orElseThrow(() ->
                                new CustomerNotFoundException(
                                        "Customer not found with id: "
                                                + customerId
                                )
                        );


        if (
                customer.getStatus()
                        != CustomerStatus.ACTIVE
        ) {

            throw new IllegalArgumentException(
                    "Cannot create a bank account for an inactive customer"
            );
        }


        BankAccount bankAccount =
                new BankAccount();


        bankAccount.setAccountNumber(
                requestDTO.getAccountNumber()
        );


        bankAccount.setAccountType(
                requestDTO.getAccountType()
        );


        bankAccount.setBalance(
                requestDTO.getBalance()
        );


        /*
         * Backend decides new accounts
         * start ACTIVE.
         */
        bankAccount.setStatus(
                AccountStatus.ACTIVE
        );


        bankAccount.setCreatedAt(
                LocalDateTime.now()
        );


        bankAccount.setCustomer(
                customer
        );


        BankAccount savedAccount =
                bankAccountRepository.save(
                        bankAccount
                );


        return convertToDTO(
                savedAccount
        );
    }


    // =========================================
    // NORMAL BANK ACCOUNT DTO
    // =========================================

    public BankAccountDTO convertToDTO(
            BankAccount account) {

        BankAccountDTO dto =
                new BankAccountDTO();


        dto.setAccountNumber(
                account.getAccountNumber()
        );


        dto.setAccountType(
                account.getAccountType()
        );


        dto.setBalance(
                account.getBalance()
        );


        dto.setCreatedAt(
                account.getCreatedAt()
        );


        dto.setStatus(
                account.getStatus()
        );


        return dto;
    }


    // =========================================
    // ADMIN BANK ACCOUNT DTO
    // =========================================

    private AdminBankAccountDTO
    convertToAdminDTO(
            BankAccount account) {

        AdminBankAccountDTO dto =
                new AdminBankAccountDTO();


        // Bank information

        dto.setAccountNumber(
                account.getAccountNumber()
        );


        dto.setAccountType(
                account.getAccountType()
        );


        dto.setBalance(
                account.getBalance()
        );


        dto.setCreatedAt(
                account.getCreatedAt()
        );


        dto.setStatus(
                account.getStatus()
        );


        // Customer information

        Customer customer =
                account.getCustomer();


        if (
                customer != null
        ) {

            dto.setCustomerId(
                    customer.getId()
            );


            dto.setFirstName(
                    customer.getFirstName()
            );


            dto.setLastName(
                    customer.getLastName()
            );


            dto.setEmail(
                    customer.getEmail()
            );


            dto.setPhoneNumber(
                    customer.getPhoneNumber()
            );


            dto.setAddress(
                    customer.getAddress()
            );


            dto.setCustomerStatus(
                    customer.getStatus()
            );
        }


        return dto;
    }


    // =========================================
    // ADMIN - GET ALL BANK ACCOUNTS
    // =========================================

    public List<AdminBankAccountDTO>
    getAllBankAccountsForAdmin() {

        List<BankAccount> accounts =
                bankAccountRepository
                        .findAll();


        List<AdminBankAccountDTO> result =
                new ArrayList<>();


        for (
                BankAccount account :
                accounts
        ) {

            result.add(
                    convertToAdminDTO(
                            account
                    )
            );
        }


        return result;
    }


    // =========================================
    // ADMIN - GET ONE ACCOUNT
    // =========================================

    public AdminBankAccountDTO
    getAdminBankAccountByAccountNumber(
            Long accountNumber) {

        BankAccount account =
                bankAccountRepository
                        .findByAccountNumber(
                                accountNumber
                        )
                        .orElseThrow(() ->
                                new BankAccountNotFoundException(
                                        "Account not found with account number: "
                                                + accountNumber
                                )
                        );


        return convertToAdminDTO(
                account
        );
    }


    // =========================================
    // NORMAL GET ACCOUNT
    // =========================================

    public BankAccountDTO
    getBankAccountByAccountNumber(
            Long accountNumber) {

        BankAccount account =
                bankAccountRepository
                        .findByAccountNumber(
                                accountNumber
                        )
                        .orElseThrow(() ->
                                new BankAccountNotFoundException(
                                        "Account not found with account number: "
                                                + accountNumber
                                )
                        );


        return convertToDTO(
                account
        );
    }


    // =========================================
    // ACCOUNTS BY CUSTOMER
    // =========================================

    public List<BankAccountDTO>
    getAccountsByCustomerId(
            Long customerId) {

        customerRepository
                .findById(customerId)
                .orElseThrow(() ->
                        new CustomerNotFoundException(
                                "Customer not found with id "
                                        + customerId
                        )
                );


        List<BankAccount> accounts =
                bankAccountRepository
                        .findByCustomer_Id(
                                customerId
                        );


        /*
         * Returning [] is cleaner for UI
         * than throwing when a customer
         * simply has no bank accounts.
         */

        List<BankAccountDTO> result =
                new ArrayList<>();


        for (
                BankAccount account :
                accounts
        ) {

            result.add(
                    convertToDTO(
                            account
                    )
            );
        }


        return result;
    }


    // =========================================
    // CUSTOMER - MY ACCOUNTS
    // =========================================

    public List<BankAccountDTO>
    getMyAccounts() {

        Long customerId =
                currentUserService
                        .getCurrentCustomerId();


        List<BankAccount> accounts =
                bankAccountRepository
                        .findByCustomer_Id(
                                customerId
                        );


        List<BankAccountDTO> result =
                new ArrayList<>();


        for (
                BankAccount account :
                accounts
        ) {

            result.add(
                    convertToDTO(
                            account
                    )
            );
        }


        return result;
    }


    // =========================================
    // UPDATE ACCOUNT STATUS
    // =========================================

    public BankAccountDTO
    updateAccountStatus(
            Long accountNumber,
            AccountStatus status) {

        BankAccount account =
                bankAccountRepository
                        .findByAccountNumber(
                                accountNumber
                        )
                        .orElseThrow(() ->
                                new BankAccountNotFoundException(
                                        "Account not found with account number: "
                                                + accountNumber
                                )
                        );


        account.setStatus(
                status
        );


        BankAccount updatedAccount =
                bankAccountRepository.save(
                        account
                );


        return convertToDTO(
                updatedAccount
        );
    }


    // =========================================
    // CUSTOMER - GET MY ONE ACCOUNT
    // =========================================

    public BankAccountDTO getMyAccount(
            Long accountNumber) {

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
                account.getCustomer()
                        == null
                        ||
                        !account.getCustomer()
                                .getId()
                                .equals(
                                        customer.getId()
                                )
        ) {

            throw new UnauthorizedAccountAccessException(
                    "You are not allowed to access this account"
            );
        }


        return convertToDTO(
                account
        );
    }
}