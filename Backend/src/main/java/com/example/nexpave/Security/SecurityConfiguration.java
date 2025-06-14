package com.example.nexpave.Security;

import com.example.nexpave.Handlers.AuthSuccessHandler;
import com.example.nexpave.Services.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfiguration{

    private final CustomUserDetailsService customUserDetailsService;
    private final AuthSuccessHandler authSuccessHandler;

    public SecurityConfiguration(CustomUserDetailsService customUserDetailsService, AuthSuccessHandler authSuccessHandler) {
        this.customUserDetailsService = customUserDetailsService;
        this.authSuccessHandler = authSuccessHandler;
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain (HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authorize -> {
                    authorize
                            .requestMatchers("/login",
                                    "/register",
                                    "/register/**",
                                    "/css/**",
                                    "/images/**",
                                    "/js/**",
                                    "/webjars/**",
                                    "/forgot-password",
                                    "/api/**",
                                    "/uploads/**").permitAll()
                            .anyRequest().authenticated();
                })
                .authenticationManager(authenticationManager(httpSecurity))
                .formLogin(form -> form
                        .loginPage("/login")
                        .loginProcessingUrl("/login")
                        .successHandler(authSuccessHandler)
                        .failureUrl("/login?error=true")
                        .permitAll())
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/login?logout=true")
                        .permitAll())
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager (HttpSecurity httpSecurity) throws Exception {

        AuthenticationManagerBuilder authenticationManagerBuilder = httpSecurity.getSharedObject(AuthenticationManagerBuilder.class);

        authenticationManagerBuilder
                .userDetailsService(customUserDetailsService)
                .passwordEncoder(passwordEncoder());

        return authenticationManagerBuilder.build();
    }
}
