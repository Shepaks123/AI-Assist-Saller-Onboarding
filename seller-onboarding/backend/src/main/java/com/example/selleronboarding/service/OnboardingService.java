package com.example.selleronboarding.service;

import com.example.selleronboarding.dto.ApplicationResponse;
import com.example.selleronboarding.dto.DraftRequest;
import com.example.selleronboarding.dto.SubmitRequest;
import com.example.selleronboarding.entity.ApplicationStatus;
import com.example.selleronboarding.entity.SellerApplication;
import com.example.selleronboarding.exception.ApiException;
import com.example.selleronboarding.repository.SellerApplicationRepository;
import com.example.selleronboarding.repository.SellerDocumentRepository;
import com.example.selleronboarding.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OnboardingService {

    private static final int MAX_DRAFT_CHARS = 50_000;

    private final SellerApplicationRepository apps;
    private final SellerDocumentRepository documents;
    private final UserRepository users;
    private final ObjectMapper mapper;

    public OnboardingService(SellerApplicationRepository apps, SellerDocumentRepository documents,
                             UserRepository users, ObjectMapper mapper) {
        this.apps = apps;
        this.documents = documents;
        this.users = users;
        this.mapper = mapper;
    }

    /** GET /api/onboarding/status – creates an empty draft the first time. */
    @Transactional
    public ApplicationResponse getStatus(Long userId) {
        return toResponse(findOrCreate(userId));
    }

    /** PUT /api/onboarding/draft – "save progress". */
    @Transactional
    public ApplicationResponse saveDraft(Long userId, DraftRequest req) {
        SellerApplication app = findOrCreate(userId);
        assertEditable(app);
        if (!req.draft().isObject()) throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid application data.");
        String json = req.draft().toString();
        if (json.length() > MAX_DRAFT_CHARS) throw new ApiException(HttpStatus.PAYLOAD_TOO_LARGE, "Application data is too large.");
        app.setDraftJson(json);
        app.setCurrentStep(Math.max(0, Math.min(5, req.currentStep())));
        return toResponse(apps.save(app));
    }

    /** POST /api/onboarding/submit – re-checks everything on the server (never trust the browser). */
    @Transactional
    public ApplicationResponse submit(Long userId, SubmitRequest req) {
        SellerApplication app = findOrCreate(userId);
        assertEditable(app);
        if (!req.draft().isObject()) throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid application data.");

        List<String> missing = findMissing(req.draft());
        if (!missing.isEmpty()) {
            throw new ApiException(HttpStatus.UNPROCESSABLE_ENTITY, "Some required information is missing: " + String.join("; ", missing));
        }
        // Every referenced document must really have been uploaded by this user.
        Iterator<JsonNode> docs = req.draft().path("documents").elements();
        while (docs.hasNext()) {
            String docId = docs.next().path("id").asText("");
            if (docId.isEmpty() || !documents.existsByIdAndUserId(docId, userId)) {
                throw new ApiException(HttpStatus.UNPROCESSABLE_ENTITY, "One of the uploaded documents could not be found. Please upload it again.");
            }
        }
        app.setDraftJson(req.draft().toString());
        app.setCurrentStep(5);
        app.setStatus(ApplicationStatus.PENDING);
        app.setFeedback(null);
        app.setMissingRequirementsJson("[]");
        app.setSubmittedAt(Instant.now());
        return toResponse(apps.save(app));
    }

    /** Used by the AI assistant to see the seller's current answers. */
    @Transactional(readOnly = true)
    public ApplicationResponse peek(Long userId) {
        return apps.findByUserId(userId).map(this::toResponse).orElseGet(() ->
                new ApplicationResponse("draft", 0, mapper.createObjectNode(), null, List.of(), null, null));
    }

    // ───────── helpers ─────────

    private SellerApplication findOrCreate(Long userId) {
        return apps.findByUserId(userId).orElseGet(() -> {
            SellerApplication a = new SellerApplication();
            a.setUser(users.getReferenceById(userId));
            return apps.save(a);
        });
    }

    private void assertEditable(SellerApplication app) {
        if (app.getStatus() == ApplicationStatus.PENDING)
            throw new ApiException(HttpStatus.CONFLICT, "Your application is under review and cannot be edited right now.");
        if (app.getStatus() == ApplicationStatus.APPROVED)
            throw new ApiException(HttpStatus.CONFLICT, "Approved applications cannot be edited here.");
    }

    private ApplicationResponse toResponse(SellerApplication a) {
        try {
            JsonNode draft = mapper.readTree(a.getDraftJson());
            List<String> missing = mapper.readValue(a.getMissingRequirementsJson(), new TypeReference<List<String>>() {});
            return new ApplicationResponse(a.getStatus().name().toLowerCase(), a.getCurrentStep(), draft,
                    a.getFeedback(), missing, a.getSubmittedAt(), a.getUpdatedAt());
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Stored application data is corrupted", e);
        }
    }

    /** Server-side version of the frontend validation rules (src/utils/onboarding.js). Keep them in sync. */
    public List<String> findMissing(JsonNode d) {
        List<String> out = new ArrayList<>();
        JsonNode p = d.path("personal"), b = d.path("business"), s = d.path("store");

        for (String f : List.of("firstName", "lastName", "phone", "city")) require(out, p, f, "Personal information");
        for (String f : List.of("businessName", "businessType", "businessAddress", "taxId")) require(out, b, f, "Business information");
        boolean individual = "individual".equals(b.path("businessType").asText(""));
        if (!individual) require(out, b, "registrationNumber", "Business information");

        require(out, s, "storeName", "Store information");
        if (s.path("storeDescription").asText("").trim().length() < 30) out.add("Store information: description must be at least 30 characters");
        if (!s.path("supportEmail").asText("").matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$")) out.add("Store information: valid support email");

        int cats = d.path("categories").size();
        if (cats < 1 || cats > 3) out.add("Product categories: choose 1 to 3");

        JsonNode docs = d.path("documents");
        if (!docs.has("governmentId")) out.add("Documents: government-issued ID");
        if (!docs.has("taxCertificate")) out.add("Documents: tax registration certificate");
        if (!individual && !docs.has("businessRegistration")) out.add("Documents: business registration certificate");
        return out;
    }

    private void require(List<String> out, JsonNode node, String field, String section) {
        if (node.path(field).asText("").trim().isEmpty()) out.add(section + ": " + field);
    }
}
