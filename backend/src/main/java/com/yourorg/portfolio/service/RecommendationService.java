package com.yourorg.portfolio.service;

import com.yourorg.portfolio.model.User;
import com.yourorg.portfolio.model.UserSkill;
import com.yourorg.portfolio.repository.UserSkillRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private final UserSkillRepository userSkillRepository;

    public RecommendationService(UserSkillRepository userSkillRepository) {
        this.userSkillRepository = userSkillRepository;
    }

    public List<Map<String, Object>> getRecommendations(User user) {
        // 1. Get User's Current Skills
        List<UserSkill> userSkills = userSkillRepository.findByUserId(user.getId());
        Set<String> existingSkillNames = userSkills.stream()
                .map(us -> us.getSkill().getName())
                .collect(Collectors.toSet());

        // 2. Define Popular Skills (Heuristic / Hardcoded for MVP)
        // In a real app, this would come from an ML model or aggregate stats
        List<Map<String, String>> popularSkills = List.of(
                Map.of("name", "Docker", "reason", "Essential for modern DevOps"),
                Map.of("name", "Kubernetes", "reason", "High demand for orchestration"),
                Map.of("name", "React", "reason", "Most popular frontend library"),
                Map.of("name", "TypeScript", "reason", "Standard for large JS projects"),
                Map.of("name", "Go", "reason", "Great for cloud-native services"),
                Map.of("name", "Rust", "reason", "High performance and safety"),
                Map.of("name", "GraphQL", "reason", "Flexible API querying"),
                Map.of("name", "PostgreSQL", "reason", "Robust relational database"));

        // 3. Filter out skills user already has
        return popularSkills.stream()
                .filter(s -> !existingSkillNames.contains(s.get("name")))
                .limit(5)
                .map(s -> {
                    Map<String, Object> map = new java.util.HashMap<>();
                    map.put("skill", s.get("name"));
                    map.put("reason", s.get("reason"));
                    map.put("confidence", 0.85);
                    return map;
                })
                .collect(Collectors.toList());
    }
}
