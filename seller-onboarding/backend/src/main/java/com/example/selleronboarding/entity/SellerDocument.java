package com.example.selleronboarding.entity;

import jakarta.persistence.*;
import java.time.Instant;

/** Metadata about an uploaded file. The file itself lives in the storage folder / bucket. */
@Entity
@Table(name = "seller_documents")
public class SellerDocument {

    @Id
    private String id; // random UUID

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String docType; // governmentId, businessRegistration, taxCertificate, proofOfAddress

    @Column(nullable = false)
    private String originalName;

    /** Name on disk (random). Never use the user's file name as a path. */
    @Column(nullable = false)
    private String storedPath;

    @Column(nullable = false)
    private String contentType;

    private long sizeBytes;
    private Instant uploadedAt = Instant.now();

    public SellerDocument() {}

    public SellerDocument(String id, Long userId, String docType, String originalName,
                          String storedPath, String contentType, long sizeBytes) {
        this.id = id; this.userId = userId; this.docType = docType; this.originalName = originalName;
        this.storedPath = storedPath; this.contentType = contentType; this.sizeBytes = sizeBytes;
    }

    public String getId() { return id; }
    public Long getUserId() { return userId; }
    public String getDocType() { return docType; }
    public String getOriginalName() { return originalName; }
    public String getStoredPath() { return storedPath; }
    public String getContentType() { return contentType; }
    public long getSizeBytes() { return sizeBytes; }
    public Instant getUploadedAt() { return uploadedAt; }
}
