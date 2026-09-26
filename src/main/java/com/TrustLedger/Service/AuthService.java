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

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;


@Service
public class AuthService {

    private final JwtService
            jwtService;

    private final UserRepository
            userRepository;

    private final CustomerRepository
            customerRepository;

    private final PasswordEncoder
            passwordEncoder;


    public AuthService(
            JwtService jwtService,
            UserRepository userRepository,
            CustomerRepository customerRepository,
            PasswordEncoder passwordEncoder) {

        this.jwtService =
                jwtService;

        this.userRepository =
                userRepository;

        this.customerRepository =
                customerRepository;

        this.passwordEncoder =
                passwordEncoder;
    }


    // =========================================
    // REGISTER CUSTOMER
    // =========================================

    @Transactional
    public void register(
            RegisterRequestDTO requestDTO) {

        String email =
                requestDTO
                        .getEmail()
                        .trim()
                        .toLowerCase();


        if (
                userRepository
                        .existsByEmail(email)
        ) {

            throw new EmailAlreadyExistsException(
                    "Email already registered"
            );
        }


        // =====================================
        // CREATE CUSTOMER
        // =====================================

        Customer customer =
                new Customer();


        customer.setFirstName(
                requestDTO.getFirstName()
        );


        customer.setLastName(
                requestDTO.getLastName()
        );


        customer.setEmail(
                email
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
                customerRepository.save(
                        customer
                );


        // =====================================
        // CREATE LOGIN USER
        // =====================================

        User user =
                new User();


        user.setEmail(
                email
        );


        user.setPassword(
                passwordEncoder.encode(
                        requestDTO.getPassword()
                )
        );


        user.setRole(
                Role.CUSTOMER
        );


        user.setCustomer(
                savedCustomer
        );


        /*
         * IMPORTANT:
         *
         * Customer status and User status
         * are separate.
         *
         * Customer status controls the
         * banking/customer account.
         *
         * User status controls whether
         * authentication is allowed.
         */
        user.setStatus(
                UserStatus.ACTIVE
        );


        userRepository.save(
                user
        );
    }


    // =========================================
    // LOGIN
    // =========================================

    public String login(
            LoginRequestDTO requestDTO) {

        String email =
                requestDTO
                        .getEmail()
                        .trim()
                        .toLowerCase();


        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new InvalidCredentialsException(
                                        "Invalid email or password"
                                )
                        );


        // =====================================
        // CHECK PASSWORD
        // =====================================

        boolean passwordMatches =
                passwordEncoder.matches(
                        requestDTO.getPassword(),
                        user.getPassword()
                );


        if (!passwordMatches) {

            throw new InvalidCredentialsException(
                    "Invalid email or password"
            );
        }


        // =====================================
        // CHECK LOGIN USER STATUS
        // =====================================

        /*
         * Applies to BOTH:
         *
         * CUSTOMER
         * ADMIN
         */

        if (
                user.getStatus()
                        != UserStatus.ACTIVE
        ) {

            throw new UnauthorizedAccountAccessException(
                    "Account is inactive. Please contact an administrator."
            );
        }


        // =====================================
        // EXTRA CUSTOMER CHECK
        // =====================================

        /*
         * User status should normally already
         * block the customer.
         *
         * We keep this second check as an
         * additional safety check.
         */

        if (
                user.getRole()
                        == Role.CUSTOMER
        ) {

            if (
                    user.getCustomer()
                            == null
            ) {

                throw new UnauthorizedAccountAccessException(
                        "Customer profile is not linked to this account"
                );
            }


            if (
                    user.getCustomer()
                            .getStatus()
                            != CustomerStatus.ACTIVE
            ) {

                throw new UnauthorizedAccountAccessException(
                        "Customer account is inactive"
                );
            }
        }


        // =====================================
        // GENERATE JWT
        // =====================================

        return jwtService
                .generateToken(
                        user
                );
    }
}