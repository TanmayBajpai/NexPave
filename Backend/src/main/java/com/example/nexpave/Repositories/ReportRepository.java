package com.example.nexpave.Repositories;

import com.example.nexpave.Entities.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReportRepository extends JpaRepository<Report, UUID> {
    public Optional<Report> findById(UUID id);
    List<Report> findByContractor_Id(UUID contractorId);
}
