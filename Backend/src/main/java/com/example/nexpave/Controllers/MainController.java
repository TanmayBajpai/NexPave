package com.example.nexpave.Controllers;

import com.example.nexpave.Services.CreateUserService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class MainController {

    public final CreateUserService createUserService;

    public MainController(CreateUserService createUserService) {
        this.createUserService = createUserService;
    }

    @GetMapping("/login")
    public String getLogin() {
        return "login";
    }

    @GetMapping("/register")
    public String getRegister() {
        return "register";
    }

    @PostMapping("/register")
    public String registerUser(@RequestParam String username, @RequestParam String password, @RequestParam String upiId) {

        createUserService.createUser(username, password, upiId);

        return "login";
    }
}
