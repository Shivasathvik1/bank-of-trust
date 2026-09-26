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

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class CustomerServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CurrentUserService currentUserService;

    @InjectMocks
    private CustomerService customerService;


    private Customer customer;

    private User user;


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

        customer.setLastName(
                "K"
        );

        customer.setEmail(
                "gopi@example.com"
        );

        customer.setPhoneNumber(
                "1234567890"
        );

        customer.setAddress(
                "New Jersey"
        );

        customer.setCreatedAt(
                LocalDateTime.now()
        );

        customer.setStatus(
                CustomerStatus.ACTIVE
        );


        user =
                new User();

        user.setId(
                1L
        );

        user.setEmail(
                "gopi@example.com"
        );

        user.setStatus(
                UserStatus.ACTIVE
        );

        user.setCustomer(
                customer
        );
    }


    @Test
    void saveCustomer_success() {

        CustomerRequestDTO request =
                new CustomerRequestDTO();

        request.setFirstName(
                "Gopi"
        );

        request.setLastName(
                "K"
        );

        request.setEmail(
                "gopi@example.com"
        );

        request.setPhoneNumber(
                "1234567890"
        );

        request.setAddress(
                "New Jersey"
        );


        when(
                customerRepository
                        .save(
                                any(
                                        Customer.class
                                )
                        )
        ).thenAnswer(
                invocation -> {

                    Customer savedCustomer =
                            invocation
                                    .getArgument(
                                            0
                                    );

                    savedCustomer.setId(
                            1L
                    );

                    return savedCustomer;
                }
        );


        CustomerDTO result =
                customerService
                        .saveCustomer(
                                request
                        );


        assertEquals(
                "Gopi",
                result.getFirstName()
        );


        assertEquals(
                "gopi@example.com",
                result.getEmail()
        );


        assertEquals(
                CustomerStatus.ACTIVE,
                result.getStatus()
        );


        verify(
                customerRepository
        ).save(
                any(
                        Customer.class
                )
        );
    }


    @Test
    void getCustomerById_success() {

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


        CustomerDTO result =
                customerService
                        .getCustomerById(
                                1L
                        );


        assertEquals(
                1L,
                result.getId()
        );


        assertEquals(
                "Gopi",
                result.getFirstName()
        );
    }


    @Test
    void getCustomerById_notFound() {

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
                        customerService
                                .getCustomerById(
                                        99L
                                )
        );
    }


    @Test
    void getAllCustomers_success() {

        Customer customer2 =
                new Customer();

        customer2.setId(
                2L
        );

        customer2.setFirstName(
                "Sunny"
        );

        customer2.setEmail(
                "sunny@example.com"
        );

        customer2.setStatus(
                CustomerStatus.ACTIVE
        );


        when(
                customerRepository
                        .findAll()
        ).thenReturn(
                List.of(
                        customer,
                        customer2
                )
        );


        List<CustomerDTO> result =
                customerService
                        .getAllCustomers();


        assertEquals(
                2,
                result.size()
        );


        assertEquals(
                "Gopi",
                result.get(0)
                        .getFirstName()
        );


        assertEquals(
                "Sunny",
                result.get(1)
                        .getFirstName()
        );
    }


    @Test
    void deactivateCustomer_success() {

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
                userRepository
                        .findByCustomerId(
                                1L
                        )
        ).thenReturn(
                Optional.of(
                        user
                )
        );


        when(
                customerRepository
                        .save(
                                customer
                        )
        ).thenReturn(
                customer
        );


        when(
                userRepository
                        .save(
                                user
                        )
        ).thenReturn(
                user
        );


        CustomerDTO result =
                customerService
                        .deactivateCustomer(
                                1L
                        );


        assertEquals(
                CustomerStatus.INACTIVE,
                result.getStatus()
        );


        assertEquals(
                CustomerStatus.INACTIVE,
                customer.getStatus()
        );


        assertEquals(
                UserStatus.INACTIVE,
                user.getStatus()
        );


        verify(
                customerRepository
        ).save(
                customer
        );


        verify(
                userRepository
        ).save(
                user
        );
    }


    @Test
    void updateCustomer_success() {

        Customer updatedCustomer =
                new Customer();

        updatedCustomer.setFirstName(
                "Gopi Updated"
        );

        updatedCustomer.setLastName(
                "Kumar"
        );

        updatedCustomer.setEmail(
                "newgopi@example.com"
        );

        updatedCustomer.setPhoneNumber(
                "9999999999"
        );

        updatedCustomer.setAddress(
                "New York"
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
                customerRepository
                        .save(
                                customer
                        )
        ).thenReturn(
                customer
        );


        CustomerDTO result =
                customerService
                        .updateCustomer(
                                1L,
                                updatedCustomer
                        );


        assertEquals(
                "Gopi Updated",
                result.getFirstName()
        );


        assertEquals(
                "newgopi@example.com",
                result.getEmail()
        );


        assertEquals(
                "New York",
                result.getAddress()
        );
    }


    @Test
    void getMyProfile_success() {

        when(
                currentUserService
                        .getCurrentCustomer()
        ).thenReturn(
                customer
        );


        CustomerDTO result =
                customerService
                        .getMyProfile();


        assertEquals(
                1L,
                result.getId()
        );


        assertEquals(
                "gopi@example.com",
                result.getEmail()
        );


        assertEquals(
                CustomerStatus.ACTIVE,
                result.getStatus()
        );
    }
}