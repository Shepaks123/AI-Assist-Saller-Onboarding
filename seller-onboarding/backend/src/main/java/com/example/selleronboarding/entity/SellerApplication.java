package com.example.selleronboarding.entity;

import jakarta.persistence.*;
import java.time.Instant;

/**
 * One onboarding application per seller.
 * The wizard answers are stored as a JSON string in draftJson so the form can evolve
 * without database changes. Later you can split it into real columns/tables.
 */
@Entity
@Table(name = "seller_applications")
public class SellerApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status = ApplicationStatus.DRAFT;

    private int currentStep = 0;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String draftJson = "{}";

    /** Reviewer feedback shown to the seller. */
    @Column(length = 2000)
    private String feedback;

    /** JSON array of strings, e.g. ["Upload a clearer ID"]. */
    @Column(columnDefinition = "TEXT", nullable = false)
    private String missingRequirementsJson = "[]";

    private Instant submittedAt;
    private Instant updatedAt;

    @PrePersist
    @PreUpdate
    void touch() { this.updatedAt = Instant.now(); }

    public Long getId() { return id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }
    public int getCurrentStep() { return currentStep; }
    public void setCurrentStep(int currentStep) { this.currentStep = currentStep; }
    public String getDraftJson() { return draftJson; }
    public void setDraftJson(String draftJson) { this.draftJson = draftJson; }
    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
    public String getMissingRequirementsJson() { return missingRequirementsJson; }
    public void setMissingRequirementsJson(String json) { this.missingRequirementsJson = json; }
    public Instant getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(Instant submittedAt) { this.submittedAt = submittedAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
