package com.TrustLedger.DTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserDTO {

    private Long id;

    private String email;

    private String role;

    private String status;
}