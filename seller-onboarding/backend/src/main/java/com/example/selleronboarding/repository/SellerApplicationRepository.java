package com.example.selleronboarding.repository;

import com.example.selleronboarding.entity.SellerApplication;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SellerApplicationRepository extends JpaRepository<SellerApplication, Long> {
    Optional<SellerApplication> findByUserId(Long userId);
}
