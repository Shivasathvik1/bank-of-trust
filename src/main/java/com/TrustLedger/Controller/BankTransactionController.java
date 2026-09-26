package com.TrustLedger.Controller;

import com.TrustLedger.DTOs.AccountTransactionRequestDTO;
import com.TrustLedger.DTOs.BankTransactionDTO;
import com.TrustLedger.DTOs.TransferRequestDTO;
import com.TrustLedger.Model.TransactionType;
import com.TrustLedger.Service.BankTransactionService;
import com.TrustLedger.Service.TransactionService;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/transactions")
public class BankTransactionController {

    private final TransactionService transactionService;
    private final BankTransactionService bankTransactionService;

    public BankTransactionController(
            TransactionService transactionService,
            BankTransactionService bankTransactionService) {

        this.transactionService = transactionService;
        this.bankTransactionService = bankTransactionService;
    }


    // =========================
    // TRANSFER
    // =========================

    @PostMapping("/transfer")
    public String transferMoney(
            @Valid @RequestBody TransferRequestDTO requestDTO) {

        transactionService.transferMoney(requestDTO);

        return "Transfer successful";
    }


    // =========================
    // DEPOSIT
    // =========================

    @PostMapping("/deposit")
    public String depositMoney(
            @Valid @RequestBody AccountTransactionRequestDTO requestDTO) {

        transactionService.depositMoney(requestDTO);

        return "Deposit successful";
    }


    // =========================
    // WITHDRAW
    // =========================

    @PostMapping("/withdraw")
    public String withdrawMoney(
            @Valid @RequestBody AccountTransactionRequestDTO requestDTO) {

        transactionService.withdrawMoney(requestDTO);

        return "Withdrawal successful";
    }


    // =========================
    // MY TRANSACTIONS
    // =========================

    @GetMapping("/my")
    public Page<BankTransactionDTO> getMyTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) TransactionType type,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime from,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime to) {

        if (page < 0) {
            throw new IllegalArgumentException(
                    "Page number cannot be negative"
            );
        }

        if (size <= 0 || size > 100) {
            throw new IllegalArgumentException(
                    "Page size must be between 1 and 100"
            );
        }

        if (from != null &&
                to != null &&
                from.isAfter(to)) {

            throw new IllegalArgumentException(
                    "From date cannot be after to date"
            );
        }

        return bankTransactionService
                .getMyTransactions(
                        page,
                        size,
                        type,
                        from,
                        to
                );
    }


    // =========================
    // TRANSACTION BY REFERENCE
    // =========================

    @GetMapping("/reference/{transactionReference}")
    public BankTransactionDTO getMyTransactionByReference(
            @PathVariable String transactionReference) {

        return bankTransactionService
                .getMyTransactionByReference(
                        transactionReference
                );
    }

    @GetMapping("/my/account/{accountNumber}")
    public Page<BankTransactionDTO>
    getMyAccountTransactions(

            @PathVariable
            Long accountNumber,

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
                    iso =
                            DateTimeFormat.ISO.DATE_TIME
            )
            LocalDateTime from,

            @RequestParam(
                    required = false
            )
            @DateTimeFormat(
                    iso =
                            DateTimeFormat.ISO.DATE_TIME
            )
            LocalDateTime to) {


        return bankTransactionService
                .getMyAccountTransactions(
                        accountNumber,
                        page,
                        size,
                        type,
                        from,
                        to
                );
    }
}