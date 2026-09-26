package com.TrustLedger.Repository;

import com.TrustLedger.Model.Role;
import com.TrustLedger.Model.User;
import com.TrustLedger.Model.UserStatus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface UserRepository
        extends JpaRepository<User, Long> {

    Optional<User> findByEmail(
            String email
    );

    boolean existsByEmail(
            String email
    );

    List<User> findByRole(
            Role role
    );

    Optional<User> findByCustomerId(
            Long customerId
    );

    long countByRoleAndStatus(
            Role role,
            UserStatus status
    );
}