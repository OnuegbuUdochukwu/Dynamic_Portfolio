package com.yourorg.portfolio.service;

import com.yourorg.portfolio.model.RepositoryEntity;
import com.yourorg.portfolio.model.User;
import com.yourorg.portfolio.repository.RepoRepository;
import com.yourorg.portfolio.repository.UserRepository;
import com.yourorg.portfolio.service.github.GitHubClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;
import java.time.Instant;

@Service
public class SyncService {

    private final GitHubClient gitHubClient;
    private final RepoRepository repoRepository;
    private final UserRepository userRepository;
    private final SkillService skillService;

    public SyncService(GitHubClient gitHubClient, RepoRepository repoRepository, UserRepository userRepository,
            SkillService skillService) {
        this.gitHubClient = gitHubClient;
        this.repoRepository = repoRepository;
        this.userRepository = userRepository;
        this.skillService = skillService;
    }

    @Transactional
    public void syncUser(User user) {
        if (user.getEncryptedAccessToken() == null) {
            throw new IllegalStateException("User has no access token");
        }

        // 1. Fetch from GitHub
        Map<String, Object> data = gitHubClient.fetchUserRepos(user.getEncryptedAccessToken()); // TODO: Decrypt token

        // 2. Parse and Save Repos
        List<RepositoryEntity> repos = parseRepos(data, user);
        repoRepository.saveAll(repos);

        // 3. Update User Last Sync
        user.setLastSync(Instant.now());
        userRepository.save(user);

        // 4. Calculate Skills
        skillService.calculateSkills(user, repos);
    }

    private List<RepositoryEntity> parseRepos(Map<String, Object> data, User user) {
        List<RepositoryEntity> entities = new ArrayList<>();
        try {
            Map<String, Object> viewer = (Map<String, Object>) ((Map<String, Object>) data.get("data")).get("viewer");
            Map<String, Object> repositories = (Map<String, Object>) viewer.get("repositories");
            List<Map<String, Object>> nodes = (List<Map<String, Object>>) repositories.get("nodes");

            for (Map<String, Object> node : nodes) {
                RepositoryEntity repo = new RepositoryEntity();
                repo.setUser(user);
                repo.setGhRepoId(Long.parseLong(node.get("databaseId").toString()));
                repo.setFullName((String) node.get("nameWithOwner"));
                repo.setDescription((String) node.get("description"));
                repo.setStars((Integer) node.get("stargazerCount"));
                repo.setForks((Integer) node.get("forkCount"));
                repo.setLastPushedAt(Instant.parse((String) node.get("pushedAt")));

                // Primary Language
                Map<String, Object> primary = (Map<String, Object>) node.get("primaryLanguage");
                if (primary != null) {
                    repo.setPrimaryLanguage((String) primary.get("name"));
                }

                // Languages
                Map<String, Double> languages = new HashMap<>();
                Map<String, Object> langs = (Map<String, Object>) node.get("languages");
                List<Map<String, Object>> edges = (List<Map<String, Object>>) langs.get("edges");
                for (Map<String, Object> edge : edges) {
                    Integer size = (Integer) edge.get("size");
                    Map<String, Object> langNode = (Map<String, Object>) edge.get("node");
                    languages.put((String) langNode.get("name"), size.doubleValue());
                }
                repo.setLanguages(languages);

                // Topics
                List<String> topics = new ArrayList<>();
                Map<String, Object> repoTopics = (Map<String, Object>) node.get("repositoryTopics");
                List<Map<String, Object>> topicNodes = (List<Map<String, Object>>) repoTopics.get("nodes");
                for (Map<String, Object> topicNode : topicNodes) {
                    Map<String, Object> topic = (Map<String, Object>) topicNode.get("topic");
                    topics.add((String) topic.get("name"));
                }
                repo.setTopics(topics);

                entities.add(repo);
            }
        } catch (Exception e) {
            e.printStackTrace(); // Log error properly in prod
        }
        return entities;
    }
}
