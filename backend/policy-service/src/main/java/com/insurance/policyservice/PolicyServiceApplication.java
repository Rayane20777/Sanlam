package com.insurance.policyservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.web.bind.annotation.CrossOrigin;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
@CrossOrigin(origins = "http://localhost:3000")
public class PolicyServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(PolicyServiceApplication.class, args);
    }
}

