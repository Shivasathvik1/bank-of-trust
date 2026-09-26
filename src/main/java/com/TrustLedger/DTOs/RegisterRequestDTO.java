package com.TrustLedger.DTOs;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequestDTO {
    @NotBlank
    private String firstName;
    private String lastName;
    @NotBlank
    @Email
    private String email;
    @NotBlank
    @Size(min =8,max=15)
    private String phoneNumber;
    @NotBlank
    private String address;
    @NotBlank
    @Size(min=8)
    private String password;
}
