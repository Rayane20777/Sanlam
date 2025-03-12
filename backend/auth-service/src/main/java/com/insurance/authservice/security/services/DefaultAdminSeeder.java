package com.insurance.authservice.security.services;

import com.insurance.authservice.model.ERole;
import com.insurance.authservice.model.Role;
import com.insurance.authservice.model.User;
import com.insurance.authservice.repository.RoleRepository;
import com.insurance.authservice.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DefaultAdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public DefaultAdminSeeder(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Check if admin user already exists
        if (!userRepository.existsByUsername("admin")) {
            User adminUser = new User();
            adminUser.setUsername("admin");
            adminUser.setEmail("admin@insurance.com");
            adminUser.setPassword(passwordEncoder.encode("admin123")); // Default password: admin123

            Set<Role> roles = new HashSet<>();
            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("Error: Admin Role not found."));
            roles.add(adminRole);
            adminUser.setRoles(roles);

            userRepository.save(adminUser);
            System.out.println("✅ Default admin user created with username: admin and password: admin123");
        }
    }
} 