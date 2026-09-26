package com.TrustLedger.Controller;

import com.TrustLedger.DTOs.LoginRequestDTO;
import com.TrustLedger.DTOs.LoginResponseDTO;
import com.TrustLedger.DTOs.RegisterRequestDTO;
import com.TrustLedger.Service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(
            @Valid @RequestBody RegisterRequestDTO requestDTO) {

        authService.register(requestDTO);

        return new ResponseEntity<>(
                "Registration successful",
                HttpStatus.CREATED
        );
    }
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(
            @Valid @RequestBody LoginRequestDTO requestDTO) {

        String token = authService.login(requestDTO);

        LoginResponseDTO response =
                new LoginResponseDTO(token);

        return ResponseEntity.ok(response);
    }
}