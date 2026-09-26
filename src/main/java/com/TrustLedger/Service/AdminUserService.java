package com.TrustLedger.Service;

import com.TrustLedger.DTOs.AdminCreateRequestDTO;
import com.TrustLedger.DTOs.AdminUserDTO;
import com.TrustLedger.Model.Role;
import com.TrustLedger.Model.User;
import com.TrustLedger.Model.UserStatus;
import com.TrustLedger.Repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
public class AdminUserService {

    private final UserRepository
            userRepository;

    private final PasswordEncoder
            passwordEncoder;


    public AdminUserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository =
                userRepository;

        this.passwordEncoder =
                passwordEncoder;
    }


    // =========================================
    // CREATE ADMIN
    // =========================================

    @Transactional
    public AdminUserDTO createAdmin(
            AdminCreateRequestDTO requestDTO) {

        String email =
                requestDTO
                        .getEmail()
                        .trim()
                        .toLowerCase();


        if (
                userRepository
                        .existsByEmail(email)
        ) {

            throw new IllegalArgumentException(
                    "Email is already registered"
            );
        }


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
                Role.ADMIN
        );


        user.setCustomer(
                null
        );


        user.setStatus(
                UserStatus.ACTIVE
        );


        User savedUser =
                userRepository.save(
                        user
                );


        return convertToDTO(
                savedUser
        );
    }


    // =========================================
    // GET ALL ADMINS
    // =========================================

    public List<AdminUserDTO>
    getAllAdmins() {

        return userRepository
                .findByRole(
                        Role.ADMIN
                )
                .stream()
                .map(
                        this::convertToDTO
                )
                .toList();
    }


    // =========================================
    // UPDATE ADMIN STATUS
    // =========================================

    @Transactional
    public AdminUserDTO updateAdminStatus(
            Long adminId,
            UserStatus status) {

        User admin =
                userRepository
                        .findById(adminId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Admin not found with id "
                                                + adminId
                                )
                        );


        // Make sure this user is actually an ADMIN
        if (
                admin.getRole()
                        != Role.ADMIN
        ) {

            throw new IllegalArgumentException(
                    "User is not an administrator"
            );
        }


        // Prevent deactivating the last active admin
        if (
                status ==
                        UserStatus.INACTIVE
                        &&
                        admin.getStatus()
                                == UserStatus.ACTIVE
        ) {

            long activeAdmins =
                    userRepository
                            .countByRoleAndStatus(
                                    Role.ADMIN,
                                    UserStatus.ACTIVE
                            );


            if (
                    activeAdmins <= 1
            ) {

                throw new IllegalArgumentException(
                        "At least one active administrator must remain"
                );
            }
        }


        admin.setStatus(
                status
        );


        User updatedAdmin =
                userRepository.save(
                        admin
                );


        return convertToDTO(
                updatedAdmin
        );
    }


    // =========================================
    // ENTITY -> DTO
    // =========================================

    private AdminUserDTO convertToDTO(
            User user) {

        return new AdminUserDTO(
                user.getId(),
                user.getEmail(),
                user.getRole().name(),
                user.getStatus().name()
        );
    }
}