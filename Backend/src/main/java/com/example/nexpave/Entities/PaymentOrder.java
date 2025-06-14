package com.example.nexpave.Entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "payment_orders")
public class PaymentOrder {
    @Id
    private UUID id;

    private UUID contractorId;
    private UUID reportId;
    private int bounty;
    private String location;
    private LocalDateTime createdAt;
    private String status; // PENDING, PAID
}
