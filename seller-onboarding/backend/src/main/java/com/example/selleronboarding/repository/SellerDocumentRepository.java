package com.example.selleronboarding.repository;

import com.example.selleronboarding.entity.SellerDocument;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SellerDocumentRepository extends JpaRepository<SellerDocument, String> {
    boolean existsByIdAndUserId(String id, Long userId);
}
