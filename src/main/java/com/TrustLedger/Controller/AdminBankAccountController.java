package com.TrustLedger.Controller;

import com.TrustLedger.DTOs.AdminBankAccountDTO;
import com.TrustLedger.DTOs.BankAccountDTO;
import com.TrustLedger.DTOs.BankAccountRequestDTO;

import com.TrustLedger.Model.AccountStatus;

import com.TrustLedger.Service.BankAccountService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping(
        "/api/admin"
)
public class AdminBankAccountController {

    private final BankAccountService
            bankAccountService;


    public AdminBankAccountController(
            BankAccountService bankAccountService) {

        this.bankAccountService =
                bankAccountService;
    }


    // =========================================
    // ADMIN - ALL BANK ACCOUNTS
    // =========================================

    @GetMapping(
            "/accounts"
    )
    public List<AdminBankAccountDTO>
    getAllBankAccounts() {

        return bankAccountService
                .getAllBankAccountsForAdmin();
    }


    // =========================================
    // ADMIN - ONE BANK ACCOUNT
    // Includes customer information
    // =========================================

    @GetMapping(
            "/accounts/{accountNumber}"
    )
    public AdminBankAccountDTO
    getBankAccountByAccountNumber(
            @PathVariable
            Long accountNumber) {

        return bankAccountService
                .getAdminBankAccountByAccountNumber(
                        accountNumber
                );
    }


    // =========================================
    // CREATE BANK ACCOUNT
    // =========================================

    @PostMapping(
            "/customers/{customerId}/accounts"
    )
    public BankAccountDTO
    createBankAccount(

            @PathVariable
            Long customerId,

            @Valid
            @RequestBody
            BankAccountRequestDTO requestDTO) {

        return bankAccountService
                .createBankAccount(
                        customerId,
                        requestDTO
                );
    }


    // =========================================
    // CUSTOMER'S ACCOUNTS
    // =========================================

    @GetMapping(
            "/customers/{customerId}/accounts"
    )
    public List<BankAccountDTO>
    getAccountsByCustomerId(
            @PathVariable
            Long customerId) {

        return bankAccountService
                .getAccountsByCustomerId(
                        customerId
                );
    }


    // =========================================
    // CHANGE ACCOUNT STATUS
    // =========================================

    @PutMapping(
            "/accounts/{accountNumber}/status"
    )
    public BankAccountDTO
    updateAccountStatus(

            @PathVariable
            Long accountNumber,

            @RequestParam
            AccountStatus status) {

        return bankAccountService
                .updateAccountStatus(
                        accountNumber,
                        status
                );
    }
}