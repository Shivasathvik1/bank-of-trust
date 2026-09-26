package com.TrustLedger.Controller;

import com.TrustLedger.DTOs.BankTransactionDTO;
import com.TrustLedger.Model.TransactionType;
import com.TrustLedger.Service.BankTransactionService;

import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;


@RestController
@RequestMapping("/api/admin/transactions")
public class AdminTransactionController {

    private final BankTransactionService bankTransactionService;


    public AdminTransactionController(
            BankTransactionService bankTransactionService) {

        this.bankTransactionService =
                bankTransactionService;
    }


    // =====================================================
    // ADMIN
    // PAGINATED + FILTERED TRANSACTIONS
    // =====================================================

    @GetMapping
    public Page<BankTransactionDTO> getAllTransactions(

            @RequestParam(
                    defaultValue = "0"
            )
            int page,

            @RequestParam(
                    defaultValue = "10"
            )
            int size,

            @RequestParam(
                    required = false
            )
            TransactionType type,

            @RequestParam(
                    required = false
            )
            @DateTimeFormat(
                    iso = DateTimeFormat.ISO.DATE_TIME
            )
            LocalDateTime fromDate,

            @RequestParam(
                    required = false
            )
            @DateTimeFormat(
                    iso = DateTimeFormat.ISO.DATE_TIME
            )
            LocalDateTime toDate) {


        return bankTransactionService
                .getAllTransactions(
                        page,
                        size,
                        type,
                        fromDate,
                        toDate
                );
    }


    // =====================================================
    // TRANSACTIONS BY CUSTOMER
    // =====================================================

    @GetMapping(
            "/customer/{customerId}"
    )
    public List<BankTransactionDTO>
    getTransactionsByCustomerId(
            @PathVariable Long customerId) {


        return bankTransactionService
                .getTransactionsByCustomerId(
                        customerId
                );
    }


    // =====================================================
    // TRANSACTION BY ID
    // =====================================================

    @GetMapping("/{id}")
    public BankTransactionDTO
    getTransactionById(
            @PathVariable Long id) {


        return bankTransactionService
                .getTransactionById(
                        id
                );
    }


    // =====================================================
    // TRANSACTIONS BY ACCOUNT
    // =====================================================

    @GetMapping(
            "/account/{accountNumber}"
    )
    public List<BankTransactionDTO>
    getTransactionsByAccountNumber(
            @PathVariable Long accountNumber) {


        return bankTransactionService
                .getTransactionsByAccountNumber(
                        accountNumber
                );
    }


    // =====================================================
    // TRANSACTION BY REFERENCE
    // =====================================================

    @GetMapping(
            "/reference/{transactionReference}"
    )
    public BankTransactionDTO
    getTransactionByReference(
            @PathVariable
            String transactionReference) {


        return bankTransactionService
                .getTransactionByReference(
                        transactionReference
                );
    }
}