package com.example.nexpave.Repositories;

import com.example.nexpave.Entities.PaymentOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PaymentOrderRepository extends JpaRepository<PaymentOrder, UUID> {
    List<PaymentOrder> findAllByStatus(String status);
}