package com.example.nexpave.Repositories;

import com.example.nexpave.Entities.Contractor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<Contractor, UUID> {
    public Contractor findByUsername(String username);
}
