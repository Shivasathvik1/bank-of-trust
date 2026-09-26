package com.TrustLedger.Service;

import com.TrustLedger.DTOs.LoginRequestDTO;
import com.TrustLedger.DTOs.RegisterRequestDTO;
import com.TrustLedger.Exception.EmailAlreadyExistsException;
import com.TrustLedger.Exception.InvalidCredentialsException;
import com.TrustLedger.Exception.UnauthorizedAccountAccessException;
import com.TrustLedger.Model.Customer;
import com.TrustLedger.Model.CustomerStatus;
import com.TrustLedger.Model.Role;
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

import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private JwtService jwtService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;


    private Customer customer;

    private User user;


    @BeforeEach
    void setUp() {

        customer =
                new Customer();

        customer.setId(
                1L
        );

        customer.setEmail(
                "gopi@example.com"
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

        user.setPassword(
                "encodedPassword"
        );

        user.setRole(
                Role.CUSTOMER
        );

        user.setStatus(
                UserStatus.ACTIVE
        );

        user.setCustomer(
                customer
        );
    }


    // =====================================================
    // REGISTER SUCCESS
    // =====================================================

    @Test
    void register_success() {

        RegisterRequestDTO request =
                new RegisterRequestDTO();

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

        request.setPassword(
                "gopi@123"
        );


        when(
                userRepository
                        .existsByEmail(
                                "gopi@example.com"
                        )
        ).thenReturn(
                false
        );


        when(
                passwordEncoder
                        .encode(
                                "gopi@123"
                        )
        ).thenReturn(
                "encodedPassword"
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


        authService.register(
                request
        );


        verify(
                customerRepository
        ).save(
                any(
                        Customer.class
                )
        );


        verify(
                userRepository
        ).save(
                any(
                        User.class
                )
        );


        verify(
                passwordEncoder
        ).encode(
                "gopi@123"
        );
    }


    // =====================================================
    // REGISTER DUPLICATE EMAIL
    // =====================================================

    @Test
    void register_duplicateEmail() {

        RegisterRequestDTO request =
                new RegisterRequestDTO();


        request.setEmail(
                "gopi@example.com"
        );


        when(
                userRepository
                        .existsByEmail(
                                "gopi@example.com"
                        )
        ).thenReturn(
                true
        );


        assertThrows(
                EmailAlreadyExistsException.class,
                () ->
                        authService.register(
                                request
                        )
        );


        verify(
                customerRepository,
                never()
        ).save(
                any()
        );


        verify(
                userRepository,
                never()
        ).save(
                any()
        );
    }


    // =====================================================
    // LOGIN SUCCESS
    // =====================================================

    @Test
    void login_success() {

        LoginRequestDTO request =
                new LoginRequestDTO();


        request.setEmail(
                "gopi@example.com"
        );

        request.setPassword(
                "gopi@123"
        );


        when(
                userRepository
                        .findByEmail(
                                "gopi@example.com"
                        )
        ).thenReturn(
                Optional.of(
                        user
                )
        );


        when(
                passwordEncoder
                        .matches(
                                "gopi@123",
                                "encodedPassword"
                        )
        ).thenReturn(
                true
        );


        when(
                jwtService
                        .generateToken(
                                user
                        )
        ).thenReturn(
                "fake-jwt-token"
        );


        String token =
                authService.login(
                        request
                );


        assertEquals(
                "fake-jwt-token",
                token
        );


        verify(
                jwtService
        ).generateToken(
                user
        );
    }


    // =====================================================
    // LOGIN WRONG PASSWORD
    // =====================================================

    @Test
    void login_wrongPassword() {

        LoginRequestDTO request =
                new LoginRequestDTO();


        request.setEmail(
                "gopi@example.com"
        );

        request.setPassword(
                "wrongPassword"
        );


        when(
                userRepository
                        .findByEmail(
                                "gopi@example.com"
                        )
        ).thenReturn(
                Optional.of(
                        user
                )
        );


        when(
                passwordEncoder
                        .matches(
                                "wrongPassword",
                                "encodedPassword"
                        )
        ).thenReturn(
                false
        );


        assertThrows(
                InvalidCredentialsException.class,
                () ->
                        authService.login(
                                request
                        )
        );


        verify(
                jwtService,
                never()
        ).generateToken(
                any()
        );
    }


    // =====================================================
    // LOGIN INACTIVE CUSTOMER
    // =====================================================

    @Test
    void login_inactiveCustomer() {

        customer.setStatus(
                CustomerStatus.INACTIVE
        );


        LoginRequestDTO request =
                new LoginRequestDTO();


        request.setEmail(
                "gopi@example.com"
        );

        request.setPassword(
                "gopi@123"
        );


        when(
                userRepository
                        .findByEmail(
                                "gopi@example.com"
                        )
        ).thenReturn(
                Optional.of(
                        user
                )
        );


        when(
                passwordEncoder
                        .matches(
                                "gopi@123",
                                "encodedPassword"
                        )
        ).thenReturn(
                true
        );


        assertThrows(
                UnauthorizedAccountAccessException.class,
                () ->
                        authService.login(
                                request
                        )
        );


        verify(
                jwtService,
                never()
        ).generateToken(
                any()
        );
    }
}