package com.yourorg.portfolio.controller;

import com.yourorg.portfolio.model.User;
import com.yourorg.portfolio.repository.UserRepository;
import com.yourorg.portfolio.service.SyncService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/sync")
public class SyncController {

    private final SyncService syncService;
    private final UserRepository userRepository;

    public SyncController(SyncService syncService, UserRepository userRepository) {
        this.syncService = syncService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<?> triggerSync(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        Long githubId = principal.getAttribute("id");
        User user = userRepository.findByGithubId(githubId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // In a real app, this should be async (Job Queue)
        syncService.syncUser(user);

        return ResponseEntity.ok(Map.of("status", "COMPLETED", "message", "Sync finished successfully"));
    }
}
