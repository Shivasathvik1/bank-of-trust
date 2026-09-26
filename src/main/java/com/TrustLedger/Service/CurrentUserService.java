package com.TrustLedger.Service;

import com.TrustLedger.Exception.InvalidCredentialsException;
import com.TrustLedger.Exception.UnauthorizedAccountAccessException;
import com.TrustLedger.Model.Customer;
import com.TrustLedger.Model.CustomerStatus;
import com.TrustLedger.Model.User;
import com.TrustLedger.Repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserService {

    private final UserRepository userRepository;

    public CurrentUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getCurrentUser() {

        String email =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("Authenticated user not found")
        );
    }

    public Customer getCurrentCustomer() {

        Customer customer =
                getCurrentUser().getCustomer();

        if (customer.getStatus() != CustomerStatus.ACTIVE) {

            throw new UnauthorizedAccountAccessException(
                    "Customer account is inactive"
            );
        }

        return customer;
    }

    public Long getCurrentCustomerId() {
        return getCurrentCustomer().getId();
    }
}