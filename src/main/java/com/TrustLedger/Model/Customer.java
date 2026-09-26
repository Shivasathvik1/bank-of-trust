package com.TrustLedger.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.engine.internal.Cascade;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String email;
    private String address;
    private LocalDateTime createdAt;

    @OneToMany(
            mappedBy = "customer",cascade = CascadeType.PERSIST
     )
    private List<BankAccount> accounts;

    @OneToOne(mappedBy = "customer")
    private User user;
    @Enumerated(EnumType.STRING)
    private CustomerStatus status;

}
