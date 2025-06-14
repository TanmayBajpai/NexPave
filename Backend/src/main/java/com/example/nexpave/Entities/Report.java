package com.example.nexpave.Entities;

import com.example.nexpave.enums.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="reports")
public class Report {

    @Id
    UUID id;
    String severity;
    String location;
    String latitude;
    String longitude;
    String description;
    String size;
    int bounty;
    int potholes;
    String trafficFlow;

    @Enumerated(EnumType.STRING)
    Status status;

    @ManyToOne
    @JoinColumn(name="contractor_id")
    private Contractor contractor;

    @Column(name = "image_url")
    private String imageUrl;
}
