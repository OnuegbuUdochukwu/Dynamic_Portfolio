package com.yourorg.portfolio.service;

import com.yourorg.portfolio.model.RepositoryEntity;
import com.yourorg.portfolio.model.User;
import com.yourorg.portfolio.model.Skill;
import com.yourorg.portfolio.model.UserSkill;
import com.yourorg.portfolio.repository.SkillRepository;
import com.yourorg.portfolio.repository.UserSkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class SkillService {

    private final SkillRepository skillRepository;
    private final UserSkillRepository userSkillRepository;

    public SkillService(SkillRepository skillRepository, UserSkillRepository userSkillRepository) {
        this.skillRepository = skillRepository;
        this.userSkillRepository = userSkillRepository;
    }

    @Transactional
    public void calculateSkills(User user, List<RepositoryEntity> repos) {
        // Simple Heuristic: Count language bytes and star impact
        Map<String, Double> skillScores = new HashMap<>();

        for (RepositoryEntity repo : repos) {
            if (repo.getLanguages() != null) {
                repo.getLanguages().forEach((lang, size) -> {
                    double current = skillScores.getOrDefault(lang, 0.0);
                    // Logarithmic scale for size + star boost
                    double score = Math.log1p(size)
                            * (1 + Math.log1p(repo.getStars() != null ? repo.getStars() : 0) * 0.1);
                    skillScores.put(lang, current + score);
                });
            }
            // Topics
            if (repo.getTopics() != null) {
                for (String topic : repo.getTopics()) {
                    double current = skillScores.getOrDefault(topic, 0.0);
                    skillScores.put(topic, current + 5.0); // Flat bonus for topics
                }
            }
        }

        // Save UserSkills
        skillScores.forEach((name, score) -> {
            Skill skill = skillRepository.findByName(name)
                    .orElseGet(() -> {
                        Skill s = new Skill();
                        s.setName(name);
                        s.setCategory("Uncategorized");
                        return skillRepository.save(s);
                    });

            UserSkill userSkill = userSkillRepository.findByUserIdAndSkillId(user.getId(), skill.getId())
                    .orElseGet(() -> {
                        UserSkill us = new UserSkill();
                        us.setUser(user);
                        us.setSkill(skill);
                        return us;
                    });

            userSkill.setScore(Math.min(100.0, score)); // Cap at 100 for now
            userSkillRepository.save(userSkill);
        });
    }
}
