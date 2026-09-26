package com.TrustLedger.Model;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User {


    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;


    @Column(
            unique = true,
            nullable = false
    )
    private String email;


    @Column(
            nullable = false
    )
    private String password;


    @Enumerated(
            EnumType.STRING
    )
    @Column(
            nullable = false
    )
    private Role role;


    @OneToOne
    @JoinColumn(
            name = "customer_id"
    )
    private Customer customer;


    @Enumerated(
            EnumType.STRING
    )
    @Column(
            nullable = false
    )
    private UserStatus status;
}