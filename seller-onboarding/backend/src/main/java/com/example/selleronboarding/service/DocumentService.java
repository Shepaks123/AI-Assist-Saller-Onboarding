package com.example.selleronboarding.service;

import com.example.selleronboarding.dto.DocumentResponse;
import com.example.selleronboarding.entity.SellerDocument;
import com.example.selleronboarding.exception.ApiException;
import com.example.selleronboarding.repository.SellerDocumentRepository;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * Stores uploaded files on local disk (folder = UPLOAD_DIR).
 * To move to cloud storage (S3, Supabase Storage…), replace only the "write the file" part
 * of store(); credentials for that service belong in backend/.env.
 */
@Service
public class DocumentService {

    private static final long MAX_BYTES = 5L * 1024 * 1024;
    private static final Set<String> TYPES = Set.of("governmentId", "businessRegistration", "taxCertificate", "proofOfAddress");
    private static final Map<String, String> EXTENSIONS = Map.of(
            "application/pdf", "pdf", "image/jpeg", "jpg", "image/png", "png");

    private final SellerDocumentRepository repo;
    private final Path root;

    public DocumentService(SellerDocumentRepository repo, @Value("${app.storage.upload-dir}") String dir) {
        this.repo = repo;
        this.root = Paths.get(dir).toAbsolutePath().normalize();
    }

    public DocumentResponse store(Long userId, String type, MultipartFile file) {
        if (!TYPES.contains(type)) throw new ApiException(HttpStatus.BAD_REQUEST, "Unknown document type.");
        if (file == null || file.isEmpty()) throw new ApiException(HttpStatus.BAD_REQUEST, "Please choose a file.");
        if (file.getSize() > MAX_BYTES) throw new ApiException(HttpStatus.PAYLOAD_TOO_LARGE, "That file is larger than 5 MB.");

        String ext = EXTENSIONS.get(file.getContentType());
        if (ext == null) throw new ApiException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "Use a PDF, JPG or PNG file.");

        try {
            // Check the real file contents, not just what the browser claims.
            if (!matchesMagicBytes(file, ext)) throw new ApiException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "The file content does not match its type.");

            String id = UUID.randomUUID().toString();
            Path dir = root.resolve(String.valueOf(userId)).normalize();
            Files.createDirectories(dir);
            Path target = dir.resolve(id + "." + ext).normalize();
            if (!target.startsWith(root)) throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid file path.");

            try (InputStream in = file.getInputStream()) {
                Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
            }
            String original = Paths.get(file.getOriginalFilename() == null ? "document" : file.getOriginalFilename()).getFileName().toString();
            repo.save(new SellerDocument(id, userId, type, original, root.relativize(target).toString(), file.getContentType(), file.getSize()));
            return new DocumentResponse(id, original, file.getSize(), type);
        } catch (IOException e) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not save the file. Please try again.");
        }
    }

    private boolean matchesMagicBytes(MultipartFile file, String ext) throws IOException {
        byte[] h = new byte[8];
        try (InputStream in = file.getInputStream()) {
            if (in.readNBytes(h, 0, 8) < 4) return false;
        }
        return switch (ext) {
            case "pdf" -> h[0] == '%' && h[1] == 'P' && h[2] == 'D' && h[3] == 'F';
            case "jpg" -> (h[0] & 0xFF) == 0xFF && (h[1] & 0xFF) == 0xD8 && (h[2] & 0xFF) == 0xFF;
            case "png" -> (h[0] & 0xFF) == 0x89 && h[1] == 'P' && h[2] == 'N' && h[3] == 'G';
            default -> false;
        };
    }
}
