package com.example.nexpave.Services;

import com.example.nexpave.Entities.Contractor;
import com.example.nexpave.Repositories.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CreateUserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public CreateUserService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public void createUser(String username, String password, String upiId) {
        Contractor contractor = new Contractor();

        contractor.setUsername(username);
        contractor.setPassword(bCryptPasswordEncoder.encode(password));
        contractor.setId(UUID.randomUUID());
        contractor.setUpiId(upiId);

        userRepository.save(contractor);
    }
}
