package com.TrustLedger.Controller;

import com.TrustLedger.DTOs.AdminCreateRequestDTO;
import com.TrustLedger.DTOs.AdminUserDTO;
import com.TrustLedger.Model.UserStatus;
import com.TrustLedger.Service.AdminUserService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping(
        "/api/admin/admins"
)
public class AdminUserController {

    private final AdminUserService
            adminUserService;


    public AdminUserController(
            AdminUserService adminUserService) {

        this.adminUserService =
                adminUserService;
    }


    // =========================================
    // GET ALL ADMINS
    // =========================================

    @GetMapping
    public ResponseEntity<
            List<AdminUserDTO>>
    getAllAdmins() {

        return ResponseEntity.ok(
                adminUserService
                        .getAllAdmins()
        );
    }


    // =========================================
    // CREATE ADMIN
    // =========================================

    @PostMapping
    public ResponseEntity<AdminUserDTO>
    createAdmin(
            @Valid
            @RequestBody
            AdminCreateRequestDTO requestDTO) {

        AdminUserDTO admin =
                adminUserService
                        .createAdmin(
                                requestDTO
                        );


        return ResponseEntity
                .status(
                        HttpStatus.CREATED
                )
                .body(admin);
    }


    // =========================================
    // ACTIVATE / DEACTIVATE ADMIN
    // =========================================

    @PutMapping(
            "/{adminId}/status"
    )
    public ResponseEntity<AdminUserDTO>
    updateAdminStatus(

            @PathVariable
            Long adminId,

            @RequestParam
            UserStatus status) {

        return ResponseEntity.ok(
                adminUserService
                        .updateAdminStatus(
                                adminId,
                                status
                        )
        );
    }
}