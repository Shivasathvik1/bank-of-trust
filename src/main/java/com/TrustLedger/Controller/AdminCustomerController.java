package com.TrustLedger.Controller;

import com.TrustLedger.DTOs.CustomerDTO;
import com.TrustLedger.Model.CustomerStatus;
import com.TrustLedger.Service.CustomerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/customers")
public class AdminCustomerController {

    private final CustomerService customerService;

    public AdminCustomerController(
            CustomerService customerService) {

        this.customerService = customerService;
    }

    // ADMIN - get all customers
    @GetMapping
    public List<CustomerDTO> getAllCustomers() {

        return customerService.getAllCustomers();
    }

    // ADMIN - get customer by id
    @GetMapping("/{customerId}")
    public CustomerDTO getCustomerById(
            @PathVariable Long customerId) {

        return customerService.getCustomerById(
                customerId
        );
    }

    // ADMIN - activate / deactivate customer
    @PutMapping("/{customerId}/status")
    public CustomerDTO updateCustomerStatus(
            @PathVariable Long customerId,
            @RequestParam CustomerStatus status) {

        return customerService
                .updateCustomerStatus(
                        customerId,
                        status
                );
    }
}