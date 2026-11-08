package com.example.selleronboarding.controller;

import com.example.selleronboarding.dto.DocumentResponse;
import com.example.selleronboarding.service.DocumentService;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documents;

    public DocumentController(DocumentService documents) { this.documents = documents; }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public DocumentResponse upload(@AuthenticationPrincipal Long userId,
                                   @RequestParam("type") String type,
                                   @RequestParam("file") MultipartFile file) {
        return documents.store(userId, type, file);
    }
}
