package com.TrustLedger.Controller;

import com.TrustLedger.DTOs.CustomerDTO;
import com.TrustLedger.Service.CustomerService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(
            CustomerService customerService) {

        this.customerService = customerService;
    }

    @GetMapping("/me")
    public CustomerDTO getMyProfile() {

        return customerService.getMyProfile();
    }
}