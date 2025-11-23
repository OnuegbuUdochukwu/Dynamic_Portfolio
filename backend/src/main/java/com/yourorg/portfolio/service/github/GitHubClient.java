package com.yourorg.portfolio.service.github;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.http.MediaType;
import java.util.Map;
import java.util.List;

@Service
public class GitHubClient {

    private final RestClient restClient;

    public GitHubClient(RestClient.Builder builder) {
        this.restClient = builder.baseUrl("https://api.github.com/graphql").build();
    }

    public Map<String, Object> fetchUserRepos(String accessToken) {
        String query = """
                query {
                  viewer {
                    repositories(first: 100, orderBy: {field: PUSHED_AT, direction: DESC}, ownerAffiliations: [OWNER, COLLABORATOR, ORGANIZATION_MEMBER]) {
                      nodes {
                        databaseId
                        name
                        nameWithOwner
                        description
                        stargazerCount
                        forkCount
                        pushedAt
                        primaryLanguage {
                          name
                        }
                        languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                          edges {
                            size
                            node {
                              name
                            }
                          }
                        }
                        repositoryTopics(first: 10) {
                          nodes {
                            topic {
                              name
                            }
                          }
                        }
                      }
                    }
                  }
                }
                """;

        return restClient.post()
                .header("Authorization", "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("query", query))
                .retrieve()
                .body(Map.class);
    }
}
