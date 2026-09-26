package com.TrustLedger.Controller;

import com.TrustLedger.DTOs.BankAccountDTO;
import com.TrustLedger.Service.BankAccountService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class BankAccountController {

    private final BankAccountService bankAccountService;

    public BankAccountController(
            BankAccountService bankAccountService) {

        this.bankAccountService = bankAccountService;
    }

    @GetMapping("/me/accounts")
    public List<BankAccountDTO> getMyAccounts() {
        return bankAccountService.getMyAccounts();
    }
    @GetMapping("/me/accounts/{accountNumber}")
    public BankAccountDTO getMyAccount(
            @PathVariable Long accountNumber) {

        return bankAccountService
                .getMyAccount(accountNumber);
    }
}