package com.yourorg.portfolio.dto;

import java.util.List;
import java.util.Map;

/**
 * DTOs for ML Recommendation System responses.
 * Maps to the Python ML service response structure.
 */
public class RecommendationDto {

    /**
     * Complete recommendation response from ML service.
     */
    public static class RecommendationResponse {
        private List<CareerPath> careerPaths;
        private List<SkillGap> skillGaps;
        private List<ProjectIdea> projectIdeas;
        private List<Technology> technologies;
        private List<LearningResource> learningResources;
        private SkillAnalysis skillAnalysis;
        private List<RepoImprovement> repoImprovements;
        private ProfileStats profileStats;

        // Getters and Setters
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

        public List<ProjectIdea> getProjectIdeas() {
            return projectIdeas;
        }

        public void setProjectIdeas(List<ProjectIdea> projectIdeas) {
            this.projectIdeas = projectIdeas;
        }

        public List<Technology> getTechnologies() {
            return technologies;
        }

        public void setTechnologies(List<Technology> technologies) {
            this.technologies = technologies;
        }

        public List<LearningResource> getLearningResources() {
            return learningResources;
        }

        public void setLearningResources(List<LearningResource> learningResources) {
            this.learningResources = learningResources;
        }

        public SkillAnalysis getSkillAnalysis() {
            return skillAnalysis;
        }

        public void setSkillAnalysis(SkillAnalysis skillAnalysis) {
            this.skillAnalysis = skillAnalysis;
        }

        public List<RepoImprovement> getRepoImprovements() {
            return repoImprovements;
        }

        public void setRepoImprovements(List<RepoImprovement> repoImprovements) {
            this.repoImprovements = repoImprovements;
        }

        public ProfileStats getProfileStats() {
            return profileStats;
        }

        public void setProfileStats(ProfileStats profileStats) {
            this.profileStats = profileStats;
        }
    }

    /**
     * Career path recommendation with match score and confidence.
     */
    public static class CareerPath {
        private String title;
        private Double score;
        private Double confidence;
        private String description;
        private List<String> matchedSkills;
        private String salaryRange;
        private String demand;

        // Getters and Setters
        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public Double getScore() {
            return score;
        }

        public void setScore(Double score) {
            this.score = score;
        }

        public Double getConfidence() {
            return confidence;
        }

        public void setConfidence(Double confidence) {
            this.confidence = confidence;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public List<String> getMatchedSkills() {
            return matchedSkills;
        }

        public void setMatchedSkills(List<String> matchedSkills) {
            this.matchedSkills = matchedSkills;
        }

        public String getSalaryRange() {
            return salaryRange;
        }

        public void setSalaryRange(String salaryRange) {
            this.salaryRange = salaryRange;
        }

        public String getDemand() {
            return demand;
        }

        public void setDemand(String demand) {
            this.demand = demand;
        }
    }

    /**
     * Skill gap analysis for a career path.
     */
    public static class SkillGap {
        private String career;
        private List<String> missingSkills;
        private List<String> niceToHave;
        private String priority;
        private Integer completionPercentage;

        // Getters and Setters
        public String getCareer() {
            return career;
        }

        public void setCareer(String career) {
            this.career = career;
        }

        public List<String> getMissingSkills() {
            return missingSkills;
        }

        public void setMissingSkills(List<String> missingSkills) {
            this.missingSkills = missingSkills;
        }

        public List<String> getNiceToHave() {
            return niceToHave;
        }

        public void setNiceToHave(List<String> niceToHave) {
            this.niceToHave = niceToHave;
        }

        public String getPriority() {
            return priority;
        }

        public void setPriority(String priority) {
            this.priority = priority;
        }

        public Integer getCompletionPercentage() {
            return completionPercentage;
        }

        public void setCompletionPercentage(Integer completionPercentage) {
            this.completionPercentage = completionPercentage;
        }
    }

    /**
     * Technology recommendation.
     */
    public static class Technology {
        private String technology;
        private String category;
        private String difficulty;
        private String learningTime;
        private String jobRelevance;
        private List<String> prerequisitesMet;
        private String reason;

        // Getters and Setters
        public String getTechnology() {
            return technology;
        }

        public void setTechnology(String technology) {
            this.technology = technology;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        public String getDifficulty() {
            return difficulty;
        }

        public void setDifficulty(String difficulty) {
            this.difficulty = difficulty;
        }

        public String getLearningTime() {
            return learningTime;
        }

        public void setLearningTime(String learningTime) {
            this.learningTime = learningTime;
        }

        public String getJobRelevance() {
            return jobRelevance;
        }

        public void setJobRelevance(String jobRelevance) {
            this.jobRelevance = jobRelevance;
        }

        public List<String> getPrerequisitesMet() {
            return prerequisitesMet;
        }

        public void setPrerequisitesMet(List<String> prerequisitesMet) {
            this.prerequisitesMet = prerequisitesMet;
        }

        public String getReason() {
            return reason;
        }

        public void setReason(String reason) {
            this.reason = reason;
        }
    }

    /**
     * Project idea recommendation.
     */
    public static class ProjectIdea {
        private String title;
        private List<String> skills;
        private String difficulty;
        private String description;
        private String estimatedTime;
        private List<String> learningGoals;
        private List<String> skillsYouHave;
        private List<String> skillsToLearn;
        private Integer matchPercentage;
        private String reason;

        // Getters and Setters
        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public List<String> getSkills() {
            return skills;
        }

        public void setSkills(List<String> skills) {
            this.skills = skills;
        }

        public String getDifficulty() {
            return difficulty;
        }

        public void setDifficulty(String difficulty) {
            this.difficulty = difficulty;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getEstimatedTime() {
            return estimatedTime;
        }

        public void setEstimatedTime(String estimatedTime) {
            this.estimatedTime = estimatedTime;
        }

        public List<String> getLearningGoals() {
            return learningGoals;
        }

        public void setLearningGoals(List<String> learningGoals) {
            this.learningGoals = learningGoals;
        }

        public List<String> getSkillsYouHave() {
            return skillsYouHave;
        }

        public void setSkillsYouHave(List<String> skillsYouHave) {
            this.skillsYouHave = skillsYouHave;
        }

        public List<String> getSkillsToLearn() {
            return skillsToLearn;
        }

        public void setSkillsToLearn(List<String> skillsToLearn) {
            this.skillsToLearn = skillsToLearn;
        }

        public Integer getMatchPercentage() {
            return matchPercentage;
        }

        public void setMatchPercentage(Integer matchPercentage) {
            this.matchPercentage = matchPercentage;
        }

        public String getReason() {
            return reason;
        }

        public void setReason(String reason) {
            this.reason = reason;
        }
    }

    /**
     * Learning resource recommendation.
     */
    public static class LearningResource {
        private String title;
        private String provider;
        private List<String> skills;
        private String difficulty;
        private String duration;
        private String url;
        private String type;
        private List<String> relevantSkills;
        private Integer relevanceScore;

        // Getters and Setters
        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getProvider() {
            return provider;
        }

        public void setProvider(String provider) {
            this.provider = provider;
        }

        public List<String> getSkills() {
            return skills;
        }

        public void setSkills(List<String> skills) {
            this.skills = skills;
        }

        public String getDifficulty() {
            return difficulty;
        }

        public void setDifficulty(String difficulty) {
            this.difficulty = difficulty;
        }

        public String getDuration() {
            return duration;
        }

        public void setDuration(String duration) {
            this.duration = duration;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public List<String> getRelevantSkills() {
            return relevantSkills;
        }

        public void setRelevantSkills(List<String> relevantSkills) {
            this.relevantSkills = relevantSkills;
        }

        public Integer getRelevanceScore() {
            return relevanceScore;
        }

        public void setRelevanceScore(Integer relevanceScore) {
            this.relevanceScore = relevanceScore;
        }
    }

    /**
     * Skill analysis with strengths and weaknesses.
     */
    public static class SkillAnalysis {
        private List<Strength> strengths;
        private List<Weakness> weaknesses;
        private List<SkillInfo> skills;

        // Getters and Setters
        public List<Strength> getStrengths() {
            return strengths;
        }

        public void setStrengths(List<Strength> strengths) {
            this.strengths = strengths;
        }

        public List<Weakness> getWeaknesses() {
            return weaknesses;
        }

        public void setWeaknesses(List<Weakness> weaknesses) {
            this.weaknesses = weaknesses;
        }

        public List<SkillInfo> getSkills() {
            return skills;
        }

        public void setSkills(List<SkillInfo> skills) {
            this.skills = skills;
        }
    }

    /**
     * Strength detail.
     */
    public static class Strength {
        private String skill;
        private Double score;
        private Integer reposCount;
        private String category;

        // Getters and Setters
        public String getSkill() {
            return skill;
        }

        public void setSkill(String skill) {
            this.skill = skill;
        }

        public Double getScore() {
            return score;
        }

        public void setScore(Double score) {
            this.score = score;
        }

        public Integer getReposCount() {
            return reposCount;
        }

        public void setReposCount(Integer reposCount) {
            this.reposCount = reposCount;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }
    }

    /**
     * Weakness/improvement area.
     */
    public static class Weakness {
        private String skill;
        private String reason;
        private String suggestion;

        // Getters and Setters
        public String getSkill() {
            return skill;
        }

        public void setSkill(String skill) {
            this.skill = skill;
        }

        public String getReason() {
            return reason;
        }

        public void setReason(String reason) {
            this.reason = reason;
        }

        public String getSuggestion() {
            return suggestion;
        }

        public void setSuggestion(String suggestion) {
            this.suggestion = suggestion;
        }
    }

    /**
     * Individual skill information.
     */
    public static class SkillInfo {
        private String skill;
        private Integer proficiency;
        private Integer reposCount;
        private String category;

        // Getters and Setters
        public String getSkill() {
            return skill;
        }

        public void setSkill(String skill) {
            this.skill = skill;
        }

        public Integer getProficiency() {
            return proficiency;
        }

        public void setProficiency(Integer proficiency) {
            this.proficiency = proficiency;
        }

        public Integer getReposCount() {
            return reposCount;
        }

        public void setReposCount(Integer reposCount) {
            this.reposCount = reposCount;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }
    }

    /**
     * Repository improvement suggestion.
     */
    public static class RepoImprovement {
        private String repo;
        private Integer currentStars;
        private List<Map<String, String>> improvements;

        // Getters and Setters
        public String getRepo() {
            return repo;
        }

        public void setRepo(String repo) {
            this.repo = repo;
        }

        public Integer getCurrentStars() {
            return currentStars;
        }

        public void setCurrentStars(Integer currentStars) {
            this.currentStars = currentStars;
        }

        public List<Map<String, String>> getImprovements() {
            return improvements;
        }

        public void setImprovements(List<Map<String, String>> improvements) {
            this.improvements = improvements;
        }
    }

    /**
     * Profile statistics.
     */
    public static class ProfileStats {
        private Integer languageDiversity;
        private Integer topicDiversity;
        private Integer totalRepos;
        private Integer totalStars;
        private Double avgLanguagesPerRepo;

        // Getters and Setters
        public Integer getLanguageDiversity() {
            return languageDiversity;
        }

        public void setLanguageDiversity(Integer languageDiversity) {
            this.languageDiversity = languageDiversity;
        }

        public Integer getTopicDiversity() {
            return topicDiversity;
        }

        public void setTopicDiversity(Integer topicDiversity) {
            this.topicDiversity = topicDiversity;
        }

        public Integer getTotalRepos() {
            return totalRepos;
        }

        public void setTotalRepos(Integer totalRepos) {
            this.totalRepos = totalRepos;
        }

        public Integer getTotalStars() {
            return totalStars;
        }

        public void setTotalStars(Integer totalStars) {
            this.totalStars = totalStars;
        }

        public Double getAvgLanguagesPerRepo() {
            return avgLanguagesPerRepo;
        }

        public void setAvgLanguagesPerRepo(Double avgLanguagesPerRepo) {
            this.avgLanguagesPerRepo = avgLanguagesPerRepo;
        }
    }
}
