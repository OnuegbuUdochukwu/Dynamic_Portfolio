package com.yourorg.portfolio.controller;

import com.yourorg.portfolio.model.User;
import com.yourorg.portfolio.model.UserSkill;
import com.yourorg.portfolio.repository.UserRepository;
import com.yourorg.portfolio.repository.UserSkillRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserRepository userRepository;
    private final UserSkillRepository userSkillRepository;

    public UserController(UserRepository userRepository, UserSkillRepository userSkillRepository) {
        this.userRepository = userRepository;
        this.userSkillRepository = userSkillRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        Long githubId = principal.getAttribute("id");
        User user = userRepository.findByGithubId(githubId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(user);
    }

    @GetMapping("/me/skills")
    public ResponseEntity<?> getUserSkills(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        Long githubId = principal.getAttribute("id");
        User user = userRepository.findByGithubId(githubId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<UserSkill> skills = userSkillRepository.findByUserId(user.getId());

        // Map to DTO
        List<Map<String, Object>> dtos = skills.stream().map(s -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", s.getSkill().getId());
            map.put("name", s.getSkill().getName());
            map.put("score", s.getScore());
            map.put("category", s.getSkill().getCategory());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }
}
