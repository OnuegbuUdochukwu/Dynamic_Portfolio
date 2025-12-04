package com.yourorg.portfolio.service;

import com.yourorg.portfolio.dto.RecommendationDto.*;
import com.yourorg.portfolio.model.RepositoryEntity;
import com.yourorg.portfolio.model.User;
import com.yourorg.portfolio.repository.RepoRepository;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.ArrayList;

/**
 * Service for generating and managing user recommendations.
 * Acts as the main business logic layer between controller and ML service.
 */
@Service
public class RecommendationService {

    private static final Logger log = LoggerFactory.getLogger(RecommendationService.class);

    private final MLClient mlClient;
    private final RepoRepository repoRepository;

    public RecommendationService(MLClient mlClient, RepoRepository repoRepository) {
        this.mlClient = mlClient;
        this.repoRepository = repoRepository;
    }

    /**
     * Get comprehensive recommendations for a user.
     * 
     * @param user The authenticated user
     * @return Full recommendation response including career paths, skills,
     *         projects, etc.
     */
    public RecommendationResponse getRecommendations(User user) {
        log.info("Generating recommendations for user: {}", user.getUsername());

        // 1. Fetch User Repos
        List<RepositoryEntity> repos = repoRepository.findByUserId(user.getId());
        log.info("Found {} repositories for user", repos.size());

        if (repos.isEmpty()) {
            log.warn("No repositories found for user: {}", user.getUsername());
            return getEmptyRecommendations("No repositories found. Please sync your GitHub data.");
        }

        // 2. Call ML Service
        RecommendationResponse recommendations = mlClient.getRecommendations(user, repos);

        // 3. Validate response
        if (recommendations == null) {
            log.warn("ML service returned null recommendations");
            return getEmptyRecommendations("Unable to generate recommendations. Please try again later.");
        }

        log.info("Generated recommendations: {} career paths, {} skill gaps, {} project ideas",
                recommendations.getCareerPaths() != null ? recommendations.getCareerPaths().size() : 0,
                recommendations.getSkillGaps() != null ? recommendations.getSkillGaps().size() : 0,
                recommendations.getProjectIdeas() != null ? recommendations.getProjectIdeas().size() : 0);

        return recommendations;
    }

    /**
     * Get skill analysis only.
     */
    public SkillAnalysis getSkillAnalysis(User user) {
        RecommendationResponse full = getRecommendations(user);
        return full.getSkillAnalysis();
    }

    /**
     * Get career paths and skill gaps only.
     */
    public CareerAnalysis getCareerAnalysis(User user) {
        RecommendationResponse full = getRecommendations(user);
        CareerAnalysis analysis = new CareerAnalysis();
        analysis.setCareerPaths(full.getCareerPaths());
        analysis.setSkillGaps(full.getSkillGaps());
        return analysis;
    }

    /**
     * Generate empty recommendations with a message.
     */
    private RecommendationResponse getEmptyRecommendations(String message) {
        RecommendationResponse empty = new RecommendationResponse();

        // Add a placeholder career path
        CareerPath placeholder = new CareerPath();
        placeholder.setTitle("Full Stack Developer");
        placeholder.setScore(0.0);
        placeholder.setConfidence(0.0);
        placeholder.setDescription(message);
        placeholder.setMatchedSkills(new ArrayList<>());
        placeholder.setSalaryRange("N/A");
        placeholder.setDemand("High");
        empty.setCareerPaths(List.of(placeholder));

        empty.setSkillGaps(new ArrayList<>());
        empty.setProjectIdeas(new ArrayList<>());
        empty.setTechnologies(new ArrayList<>());
        empty.setLearningResources(new ArrayList<>());

        SkillAnalysis emptySkills = new SkillAnalysis();
        emptySkills.setStrengths(new ArrayList<>());
        emptySkills.setWeaknesses(new ArrayList<>());
        emptySkills.setSkills(new ArrayList<>());
        empty.setSkillAnalysis(emptySkills);

        empty.setRepoImprovements(new ArrayList<>());
        empty.setProfileStats(new ProfileStats());

        return empty;
    }

    /**
     * Inner class for career-focused analysis.
     */
    public static class CareerAnalysis {
        private List<CareerPath> careerPaths;
        private List<SkillGap> skillGaps;

        public List<CareerPath> getCareerPaths() {
            return careerPaths;
        }

        public void setCareerPaths(List<CareerPath> careerPaths) {
            this.careerPaths = careerPaths;
        }

        public List<SkillGap> getSkillGaps() {
            return skillGaps;
        }

        public void setSkillGaps(List<SkillGap> skillGaps) {
            this.skillGaps = skillGaps;
        }
    }
}
