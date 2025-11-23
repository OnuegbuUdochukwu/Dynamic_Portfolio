package com.yourorg.portfolio.controller;

import com.yourorg.portfolio.model.User;
import com.yourorg.portfolio.model.UserSkill;
import com.yourorg.portfolio.repository.UserRepository;
import com.yourorg.portfolio.repository.UserSkillRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/portfolio")
public class PublicPortfolioController {

    private final UserRepository userRepository;
    private final UserSkillRepository userSkillRepository;

    public PublicPortfolioController(UserRepository userRepository, UserSkillRepository userSkillRepository) {
        this.userRepository = userRepository;
        this.userSkillRepository = userSkillRepository;
    }

    @GetMapping("/{username}")
    public ResponseEntity<?> getPublicPortfolio(@PathVariable String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<UserSkill> skills = userSkillRepository.findByUserId(user.getId());

        List<Map<String, Object>> skillDtos = skills.stream().map(s -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("name", s.getSkill().getName());
            map.put("score", s.getScore());
            map.put("category", s.getSkill().getCategory());
            return map;
        }).collect(Collectors.toList());

        Map<String, Object> response = new java.util.HashMap<>();
        response.put("username", user.getUsername());
        response.put("avatarUrl", user.getAvatarUrl());
        response.put("skills", skillDtos);

        return ResponseEntity.ok(response);
    }
}
