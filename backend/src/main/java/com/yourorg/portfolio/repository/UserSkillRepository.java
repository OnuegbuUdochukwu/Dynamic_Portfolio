package com.yourorg.portfolio.repository;

import com.yourorg.portfolio.model.UserSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserSkillRepository extends JpaRepository<UserSkill, UUID> {
    List<UserSkill> findByUserId(UUID userId);

    Optional<UserSkill> findByUserIdAndSkillId(UUID userId, UUID skillId);
}
