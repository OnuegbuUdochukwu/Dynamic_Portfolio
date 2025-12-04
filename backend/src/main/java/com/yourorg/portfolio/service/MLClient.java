package com.yourorg.portfolio.service;

import com.yourorg.portfolio.dto.RecommendationDto.*;
import com.yourorg.portfolio.model.RepositoryEntity;
import com.yourorg.portfolio.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Client for communicating with the ML recommendation service.
 * Handles request formatting, response parsing, and error handling.
 */
@Service
public class MLClient {

    private static final Logger log = LoggerFactory.getLogger(MLClient.class);

    private final RestTemplate restTemplate;

    @Value("${ml-service.url:http://localhost:8000}")
    private String mlServiceUrl;

    @Value("${ml-service.timeout:30000}")
    private int timeout;

    public MLClient() {
        this.restTemplate = new RestTemplate();
    }

    /**
     * Get comprehensive recommendations from the ML service.
     * 
     * @param user  The user profile
     * @param repos List of user's repositories
     * @return Enhanced recommendation response or fallback if service unavailable
     */
    public RecommendationResponse getRecommendations(User user, List<RepositoryEntity> repos) {
        try {
            Map<String, Object> payload = buildPayload(user, repos);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

            log.info("Calling ML service for user: {}", user.getUsername());

            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(
                    mlServiceUrl + "/recommend",
                    request,
                    Map.class);

            if (response == null) {
                log.warn("ML service returned null response");
                return getFallbackRecommendations();
            }

            return parseResponse(response);

        } catch (RestClientException e) {
            log.error("Failed to connect to ML service: {}", e.getMessage());
            return getFallbackRecommendations();
        } catch (Exception e) {
            log.error("Error getting recommendations: {}", e.getMessage(), e);
            return getFallbackRecommendations();
        }
    }

    /**
     * Build the request payload for the ML service.
     */
    private Map<String, Object> buildPayload(User user, List<RepositoryEntity> repos) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("user_id", user.getId().toString());

        List<Map<String, Object>> repoList = repos.stream().map(repo -> {
            Map<String, Object> r = new HashMap<>();
            r.put("name", repo.getFullName() != null ? repo.getFullName() : "");
            r.put("description", repo.getDescription() != null ? repo.getDescription() : "");
            r.put("languages", repo.getLanguages() != null ? repo.getLanguages() : new HashMap<>());
            r.put("topics", repo.getTopics() != null ? repo.getTopics() : List.of());
            r.put("stars", repo.getStars() != null ? repo.getStars() : 0);
            r.put("forks", repo.getForks() != null ? repo.getForks() : 0);
            return r;
        }).collect(Collectors.toList());

        payload.put("repos", repoList);
        return payload;
    }

    /**
     * Parse the ML service response into DTOs.
     */
    @SuppressWarnings("unchecked")
    private RecommendationResponse parseResponse(Map<String, Object> response) {
        RecommendationResponse result = new RecommendationResponse();

        // Parse career paths
        List<Map<String, Object>> careerPathsRaw = (List<Map<String, Object>>) response.get("career_paths");
        if (careerPathsRaw != null) {
            result.setCareerPaths(careerPathsRaw.stream().map(this::parseCareerPath).collect(Collectors.toList()));
        } else {
            result.setCareerPaths(new ArrayList<>());
        }

        // Parse skill gaps
        List<Map<String, Object>> skillGapsRaw = (List<Map<String, Object>>) response.get("skill_gaps");
        if (skillGapsRaw != null) {
            result.setSkillGaps(skillGapsRaw.stream().map(this::parseSkillGap).collect(Collectors.toList()));
        } else {
            result.setSkillGaps(new ArrayList<>());
        }

        // Parse project ideas
        List<Map<String, Object>> projectsRaw = (List<Map<String, Object>>) response.get("project_ideas");
        if (projectsRaw != null) {
            result.setProjectIdeas(projectsRaw.stream().map(this::parseProjectIdea).collect(Collectors.toList()));
        } else {
            result.setProjectIdeas(new ArrayList<>());
        }

        // Parse technologies
        List<Map<String, Object>> techRaw = (List<Map<String, Object>>) response.get("technologies");
        if (techRaw != null) {
            result.setTechnologies(techRaw.stream().map(this::parseTechnology).collect(Collectors.toList()));
        } else {
            result.setTechnologies(new ArrayList<>());
        }

        // Parse learning resources
        List<Map<String, Object>> resourcesRaw = (List<Map<String, Object>>) response.get("learning_resources");
        if (resourcesRaw != null) {
            result.setLearningResources(
                    resourcesRaw.stream().map(this::parseLearningResource).collect(Collectors.toList()));
        } else {
            result.setLearningResources(new ArrayList<>());
        }

        // Parse skill analysis
        Map<String, Object> skillAnalysisRaw = (Map<String, Object>) response.get("skill_analysis");
        result.setSkillAnalysis(parseSkillAnalysis(skillAnalysisRaw));

        // Parse repo improvements
        List<Map<String, Object>> repoImprovementsRaw = (List<Map<String, Object>>) response.get("repo_improvements");
        if (repoImprovementsRaw != null) {
            result.setRepoImprovements(
                    repoImprovementsRaw.stream().map(this::parseRepoImprovement).collect(Collectors.toList()));
        } else {
            result.setRepoImprovements(new ArrayList<>());
        }

        // Parse profile stats
        Map<String, Object> statsRaw = (Map<String, Object>) response.get("profile_stats");
        result.setProfileStats(parseProfileStats(statsRaw));

        return result;
    }

    private CareerPath parseCareerPath(Map<String, Object> raw) {
        CareerPath cp = new CareerPath();
        cp.setTitle((String) raw.get("title"));
        cp.setScore(parseDouble(raw.get("score")));
        cp.setConfidence(parseDouble(raw.get("confidence")));
        cp.setDescription((String) raw.get("description"));
        cp.setMatchedSkills(parseStringList(raw.get("matched_skills")));
        cp.setSalaryRange((String) raw.get("salary_range"));
        cp.setDemand((String) raw.get("demand"));
        return cp;
    }

    private SkillGap parseSkillGap(Map<String, Object> raw) {
        SkillGap sg = new SkillGap();
        sg.setCareer((String) raw.get("career"));
        sg.setMissingSkills(parseStringList(raw.get("missing_skills")));
        sg.setNiceToHave(parseStringList(raw.get("nice_to_have")));
        sg.setPriority((String) raw.get("priority"));
        sg.setCompletionPercentage(parseInteger(raw.get("completion_percentage")));
        return sg;
    }

    private ProjectIdea parseProjectIdea(Map<String, Object> raw) {
        ProjectIdea pi = new ProjectIdea();
        pi.setTitle((String) raw.get("title"));
        pi.setSkills(parseStringList(raw.get("skills")));
        pi.setDifficulty((String) raw.get("difficulty"));
        pi.setDescription((String) raw.get("description"));
        pi.setEstimatedTime((String) raw.get("estimated_time"));
        pi.setLearningGoals(parseStringList(raw.get("learning_goals")));
        pi.setSkillsYouHave(parseStringList(raw.get("skills_you_have")));
        pi.setSkillsToLearn(parseStringList(raw.get("skills_to_learn")));
        pi.setMatchPercentage(parseInteger(raw.get("match_percentage")));
        pi.setReason((String) raw.get("reason"));
        return pi;
    }

    private Technology parseTechnology(Map<String, Object> raw) {
        Technology t = new Technology();
        t.setTechnology((String) raw.get("technology"));
        t.setCategory((String) raw.get("category"));
        t.setDifficulty((String) raw.get("difficulty"));
        t.setLearningTime((String) raw.get("learning_time"));
        t.setJobRelevance((String) raw.get("job_relevance"));
        t.setPrerequisitesMet(parseStringList(raw.get("prerequisites_met")));
        t.setReason((String) raw.get("reason"));
        return t;
    }

    private LearningResource parseLearningResource(Map<String, Object> raw) {
        LearningResource lr = new LearningResource();
        lr.setTitle((String) raw.get("title"));
        lr.setProvider((String) raw.get("provider"));
        lr.setSkills(parseStringList(raw.get("skills")));
        lr.setDifficulty((String) raw.get("difficulty"));
        lr.setDuration((String) raw.get("duration"));
        lr.setUrl((String) raw.get("url"));
        lr.setType((String) raw.get("type"));
        lr.setRelevantSkills(parseStringList(raw.get("relevant_skills")));
        lr.setRelevanceScore(parseInteger(raw.get("relevance_score")));
        return lr;
    }

    @SuppressWarnings("unchecked")
    private SkillAnalysis parseSkillAnalysis(Map<String, Object> raw) {
        SkillAnalysis sa = new SkillAnalysis();
        if (raw == null) {
            sa.setStrengths(new ArrayList<>());
            sa.setWeaknesses(new ArrayList<>());
            sa.setSkills(new ArrayList<>());
            return sa;
        }

        // Parse strengths
        List<Map<String, Object>> strengthsRaw = (List<Map<String, Object>>) raw.get("strengths");
        if (strengthsRaw != null) {
            sa.setStrengths(strengthsRaw.stream().map(s -> {
                Strength str = new Strength();
                str.setSkill((String) s.get("skill"));
                str.setScore(parseDouble(s.get("score")));
                str.setReposCount(parseInteger(s.get("repos_count")));
                str.setCategory((String) s.get("category"));
                return str;
            }).collect(Collectors.toList()));
        } else {
            sa.setStrengths(new ArrayList<>());
        }

        // Parse weaknesses
        List<Map<String, Object>> weaknessesRaw = (List<Map<String, Object>>) raw.get("weaknesses");
        if (weaknessesRaw != null) {
            sa.setWeaknesses(weaknessesRaw.stream().map(w -> {
                Weakness wk = new Weakness();
                wk.setSkill((String) w.get("skill"));
                wk.setReason((String) w.get("reason"));
                wk.setSuggestion((String) w.get("suggestion"));
                return wk;
            }).collect(Collectors.toList()));
        } else {
            sa.setWeaknesses(new ArrayList<>());
        }

        // Parse all skills
        List<Map<String, Object>> skillsRaw = (List<Map<String, Object>>) raw.get("skills");
        if (skillsRaw != null) {
            sa.setSkills(skillsRaw.stream().map(s -> {
                SkillInfo si = new SkillInfo();
                si.setSkill((String) s.get("skill"));
                si.setProficiency(parseInteger(s.get("proficiency")));
                si.setReposCount(parseInteger(s.get("repos_count")));
                si.setCategory((String) s.get("category"));
                return si;
            }).collect(Collectors.toList()));
        } else {
            sa.setSkills(new ArrayList<>());
        }

        return sa;
    }

    @SuppressWarnings("unchecked")
    private RepoImprovement parseRepoImprovement(Map<String, Object> raw) {
        RepoImprovement ri = new RepoImprovement();
        ri.setRepo((String) raw.get("repo"));
        ri.setCurrentStars(parseInteger(raw.get("current_stars")));
        ri.setImprovements((List<Map<String, String>>) raw.get("improvements"));
        return ri;
    }

    private ProfileStats parseProfileStats(Map<String, Object> raw) {
        ProfileStats ps = new ProfileStats();
        if (raw == null)
            return ps;

        ps.setLanguageDiversity(parseInteger(raw.get("language_diversity")));
        ps.setTopicDiversity(parseInteger(raw.get("topic_diversity")));
        ps.setTotalRepos(parseInteger(raw.get("total_repos")));
        ps.setTotalStars(parseInteger(raw.get("total_stars")));
        ps.setAvgLanguagesPerRepo(parseDouble(raw.get("avg_languages_per_repo")));
        return ps;
    }

    // Helper methods for safe type conversion
    private Double parseDouble(Object value) {
        if (value == null)
            return 0.0;
        if (value instanceof Number)
            return ((Number) value).doubleValue();
        try {
            return Double.parseDouble(value.toString());
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }

    private Integer parseInteger(Object value) {
        if (value == null)
            return 0;
        if (value instanceof Number)
            return ((Number) value).intValue();
        try {
            return Integer.parseInt(value.toString());
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    @SuppressWarnings("unchecked")
    private List<String> parseStringList(Object value) {
        if (value == null)
            return new ArrayList<>();
        if (value instanceof List) {
            return ((List<?>) value).stream()
                    .map(Object::toString)
                    .collect(Collectors.toList());
        }
        return new ArrayList<>();
    }

    /**
     * Generate fallback recommendations when ML service is unavailable.
     */
    private RecommendationResponse getFallbackRecommendations() {
        RecommendationResponse fallback = new RecommendationResponse();

        // Default career path
        CareerPath defaultCareer = new CareerPath();
        defaultCareer.setTitle("Full Stack Developer");
        defaultCareer.setScore(0.5);
        defaultCareer.setConfidence(0.3);
        defaultCareer.setDescription("Build both client-side and server-side applications.");
        defaultCareer.setMatchedSkills(new ArrayList<>());
        defaultCareer.setSalaryRange("$80k - $150k");
        defaultCareer.setDemand("High");
        fallback.setCareerPaths(List.of(defaultCareer));

        fallback.setSkillGaps(new ArrayList<>());
        fallback.setProjectIdeas(new ArrayList<>());
        fallback.setTechnologies(new ArrayList<>());
        fallback.setLearningResources(new ArrayList<>());

        SkillAnalysis emptyAnalysis = new SkillAnalysis();
        emptyAnalysis.setStrengths(new ArrayList<>());
        emptyAnalysis.setWeaknesses(new ArrayList<>());
        emptyAnalysis.setSkills(new ArrayList<>());
        fallback.setSkillAnalysis(emptyAnalysis);

        fallback.setRepoImprovements(new ArrayList<>());
        fallback.setProfileStats(new ProfileStats());

        return fallback;
    }
}
