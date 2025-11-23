package com.yourorg.portfolio.repository;

import com.yourorg.portfolio.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByGithubId(Long githubId);

    Optional<User> findByUsername(String username);
}
