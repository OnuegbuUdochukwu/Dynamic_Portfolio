package com.yourorg.portfolio.model;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.Instant;
import java.util.Map;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "repositories")
public class RepositoryEntity {
    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private Long ghRepoId;
    private String fullName;
    private String description;
    private String primaryLanguage;

    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Double> languages;

    @JdbcTypeCode(SqlTypes.JSON)
    private List<String> topics;

    private Integer stars;
    private Integer forks;
    private Instant lastPushedAt;

    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> rawPayload;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Long getGhRepoId() {
        return ghRepoId;
    }

    public void setGhRepoId(Long ghRepoId) {
        this.ghRepoId = ghRepoId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPrimaryLanguage() {
        return primaryLanguage;
    }

    public void setPrimaryLanguage(String primaryLanguage) {
        this.primaryLanguage = primaryLanguage;
    }

    public Map<String, Double> getLanguages() {
        return languages;
    }

    public void setLanguages(Map<String, Double> languages) {
        this.languages = languages;
    }

    public List<String> getTopics() {
        return topics;
    }

    public void setTopics(List<String> topics) {
        this.topics = topics;
    }

    public Integer getStars() {
        return stars;
    }

    public void setStars(Integer stars) {
        this.stars = stars;
    }

    public Integer getForks() {
        return forks;
    }

    public void setForks(Integer forks) {
        this.forks = forks;
    }

    public Instant getLastPushedAt() {
        return lastPushedAt;
    }

    public void setLastPushedAt(Instant lastPushedAt) {
        this.lastPushedAt = lastPushedAt;
    }

    public Map<String, Object> getRawPayload() {
        return rawPayload;
    }

    public void setRawPayload(Map<String, Object> rawPayload) {
        this.rawPayload = rawPayload;
    }
}
