package com.TrustLedger.Repository;

import com.TrustLedger.Model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;



public interface CustomerRepository extends JpaRepository <Customer,Long>{
}
