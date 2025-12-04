package com.yourorg.portfolio.controller;

import com.yourorg.portfolio.dto.RecommendationDto.*;
import com.yourorg.portfolio.model.User;
import com.yourorg.portfolio.repository.UserRepository;
import com.yourorg.portfolio.service.RecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * REST controller for ML-powered recommendations.
 * Provides endpoints for career guidance, skill analysis, and learning
 * resources.
 */
@RestController
@RequestMapping("/api/v1/recommendations")
public class RecommendationController {

    private static final Logger log = LoggerFactory.getLogger(RecommendationController.class);

    private final RecommendationService recommendationService;
    private final UserRepository userRepository;

    public RecommendationController(RecommendationService recommendationService, UserRepository userRepository) {
        this.recommendationService = recommendationService;
        this.userRepository = userRepository;
    }

    /**
     * Get comprehensive recommendations for the authenticated user.
     * 
     * Returns career paths, skill gaps, project ideas, technologies to learn,
     * learning resources, skill analysis, and repository improvements.
     */
    @GetMapping
    public ResponseEntity<RecommendationResponse> getRecommendations(@AuthenticationPrincipal OAuth2User principal) {
        User user = getAuthenticatedUser(principal);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        log.info("Fetching recommendations for user: {}", user.getUsername());
        RecommendationResponse recommendations = recommendationService.getRecommendations(user);
        return ResponseEntity.ok(recommendations);
    }

    /**
     * Get skill analysis only.
     * Returns strengths, weaknesses, and all skills with proficiency levels.
     */
    @GetMapping("/skills")
    public ResponseEntity<SkillAnalysis> getSkillAnalysis(@AuthenticationPrincipal OAuth2User principal) {
        User user = getAuthenticatedUser(principal);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        log.info("Fetching skill analysis for user: {}", user.getUsername());
        SkillAnalysis analysis = recommendationService.getSkillAnalysis(user);
        return ResponseEntity.ok(analysis);
    }

    /**
     * Get career analysis only.
     * Returns career paths and skill gaps.
     */
    @GetMapping("/careers")
    public ResponseEntity<RecommendationService.CareerAnalysis> getCareerAnalysis(
            @AuthenticationPrincipal OAuth2User principal) {
        User user = getAuthenticatedUser(principal);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        log.info("Fetching career analysis for user: {}", user.getUsername());
        RecommendationService.CareerAnalysis analysis = recommendationService.getCareerAnalysis(user);
        return ResponseEntity.ok(analysis);
    }

    /**
     * Force refresh recommendations.
     * Triggers a fresh analysis ignoring any cached data.
     */
    @PostMapping("/refresh")
    public ResponseEntity<RecommendationResponse> refreshRecommendations(
            @AuthenticationPrincipal OAuth2User principal) {
        User user = getAuthenticatedUser(principal);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        log.info("Refreshing recommendations for user: {}", user.getUsername());
        // Future: Add cache invalidation here
        RecommendationResponse recommendations = recommendationService.getRecommendations(user);
        return ResponseEntity.ok(recommendations);
    }

    /**
     * Helper method to get authenticated user from OAuth principal.
     */
    private User getAuthenticatedUser(OAuth2User principal) {
        if (principal == null) {
            return null;
        }

        Object idObj = principal.getAttribute("id");
        if (idObj == null) {
            log.warn("OAuth principal has no 'id' attribute");
            return null;
        }

        Long githubId = idObj instanceof Number
                ? ((Number) idObj).longValue()
                : Long.valueOf(idObj.toString());

        return userRepository.findByGithubId(githubId)
                .orElse(null);
    }
}
