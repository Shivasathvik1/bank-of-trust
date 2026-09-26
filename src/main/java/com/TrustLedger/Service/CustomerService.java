package com.TrustLedger.Service;

import com.TrustLedger.DTOs.CustomerDTO;
import com.TrustLedger.DTOs.CustomerRequestDTO;
import com.TrustLedger.Exception.CustomerNotFoundException;
import com.TrustLedger.Model.Customer;
import com.TrustLedger.Model.CustomerStatus;
import com.TrustLedger.Model.User;
import com.TrustLedger.Model.UserStatus;
import com.TrustLedger.Repository.CustomerRepository;
import com.TrustLedger.Repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Service
public class CustomerService {

    private final CustomerRepository custrepo;

    private final CurrentUserService
            currentUserService;

    private final UserRepository
            userRepository;


    public CustomerService(
            CustomerRepository custrepo,
            CurrentUserService currentUserService,
            UserRepository userRepository) {

        this.custrepo =
                custrepo;

        this.currentUserService =
                currentUserService;

        this.userRepository =
                userRepository;
    }


    // =========================================
    // CREATE CUSTOMER
    // =========================================

    public CustomerDTO saveCustomer(
            CustomerRequestDTO requestDTO) {

        Customer customer =
                new Customer();


        customer.setFirstName(
                requestDTO.getFirstName()
        );


        customer.setLastName(
                requestDTO.getLastName()
        );


        customer.setEmail(
                requestDTO.getEmail()
        );


        customer.setPhoneNumber(
                requestDTO.getPhoneNumber()
        );


        customer.setAddress(
                requestDTO.getAddress()
        );


        customer.setCreatedAt(
                LocalDateTime.now()
        );


        customer.setStatus(
                CustomerStatus.ACTIVE
        );


        Customer savedCustomer =
                custrepo.save(customer);


        return convertToDTO(
                savedCustomer
        );
    }


    // =========================================
    // GET CUSTOMER BY ID
    // =========================================

    public CustomerDTO getCustomerById(
            Long id) {

        Customer customer =
                custrepo.findById(id)
                        .orElseThrow(() ->
                                new CustomerNotFoundException(
                                        "Customer not found with id "
                                                + id
                                )
                        );


        return convertToDTO(
                customer
        );
    }


    // =========================================
    // GET ALL CUSTOMERS
    // =========================================

    public List<CustomerDTO>
    getAllCustomers() {

        List<Customer> customers =
                custrepo.findAll();


        List<CustomerDTO> customerDTOs =
                new ArrayList<>();


        for (
                Customer customer
                : customers
        ) {

            customerDTOs.add(
                    convertToDTO(
                            customer
                    )
            );
        }


        return customerDTOs;
    }


    // =========================================
    // DEACTIVATE CUSTOMER
    // =========================================

    @Transactional
    public CustomerDTO deactivateCustomer(
            Long id) {

        Customer customer =
                custrepo.findById(id)
                        .orElseThrow(() ->
                                new CustomerNotFoundException(
                                        "Customer not found with id "
                                                + id
                                )
                        );


        customer.setStatus(
                CustomerStatus.INACTIVE
        );


        User user =
                userRepository
                        .findByCustomerId(
                                id
                        )
                        .orElse(null);


        if (
                user != null
        ) {

            user.setStatus(
                    UserStatus.INACTIVE
            );

            userRepository.save(
                    user
            );
        }


        Customer updatedCustomer =
                custrepo.save(
                        customer
                );


        return convertToDTO(
                updatedCustomer
        );
    }


    // =========================================
    // UPDATE CUSTOMER
    // =========================================

    public CustomerDTO updateCustomer(
            Long id,
            Customer updatedCustomer) {

        Customer existingCustomer =
                custrepo.findById(id)
                        .orElseThrow(() ->
                                new CustomerNotFoundException(
                                        "Customer not found with id "
                                                + id
                                )
                        );


        existingCustomer.setFirstName(
                updatedCustomer
                        .getFirstName()
        );


        existingCustomer.setLastName(
                updatedCustomer
                        .getLastName()
        );


        existingCustomer.setEmail(
                updatedCustomer
                        .getEmail()
        );


        existingCustomer.setPhoneNumber(
                updatedCustomer
                        .getPhoneNumber()
        );


        existingCustomer.setAddress(
                updatedCustomer
                        .getAddress()
        );


        Customer savedCustomer =
                custrepo.save(
                        existingCustomer
                );


        return convertToDTO(
                savedCustomer
        );
    }


    // =========================================
    // GET MY PROFILE
    // =========================================

    public CustomerDTO getMyProfile() {

        Customer customer =
                currentUserService
                        .getCurrentCustomer();


        return convertToDTO(
                customer
        );
    }


    // =========================================
    // UPDATE CUSTOMER STATUS
    // =========================================

    @Transactional
    public CustomerDTO updateCustomerStatus(
            Long customerId,
            CustomerStatus status) {

        Customer customer =
                custrepo.findById(
                                customerId
                        )
                        .orElseThrow(() ->
                                new CustomerNotFoundException(
                                        "Customer not found with id "
                                                + customerId
                                )
                        );


        customer.setStatus(
                status
        );


        User user =
                userRepository
                        .findByCustomerId(
                                customerId
                        )
                        .orElse(null);


        if (
                user != null
        ) {

            if (
                    status ==
                            CustomerStatus.ACTIVE
            ) {

                user.setStatus(
                        UserStatus.ACTIVE
                );

            } else {

                user.setStatus(
                        UserStatus.INACTIVE
                );
            }


            userRepository.save(
                    user
            );
        }


        Customer updatedCustomer =
                custrepo.save(
                        customer
                );


        return convertToDTO(
                updatedCustomer
        );
    }


    // =========================================
    // ENTITY -> DTO
    // =========================================

    private CustomerDTO convertToDTO(
            Customer customer) {

        CustomerDTO dto =
                new CustomerDTO();


        dto.setId(
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


        dto.setCreatedAt(
                customer.getCreatedAt()
        );


        dto.setStatus(
                customer.getStatus()
        );


        return dto;
    }
}