package com.yourorg.portfolio.repository;

import com.yourorg.portfolio.model.RepositoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RepoRepository extends JpaRepository<RepositoryEntity, UUID> {
    List<RepositoryEntity> findByUserId(UUID userId);

    Optional<RepositoryEntity> findByGhRepoId(Long ghRepoId);
}
