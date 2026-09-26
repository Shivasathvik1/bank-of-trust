package com.TrustLedger.Repository;

import com.TrustLedger.Model.BankAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BankAccountRepository extends JpaRepository<BankAccount,Long> {
    List<BankAccount> findByCustomer_Id(Long customerId);;
    Optional<BankAccount> findByAccountNumber(Long accountNumber);
    boolean existsByAccountNumber(Long accountNumber);

}
