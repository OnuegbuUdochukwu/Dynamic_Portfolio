package com.yourorg.portfolio.config;

import com.yourorg.portfolio.model.User;
import com.yourorg.portfolio.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.util.Optional;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final OAuth2AuthorizedClientService authorizedClientService;

    public OAuth2LoginSuccessHandler(UserRepository userRepository,
            OAuth2AuthorizedClientService authorizedClientService) {
        this.userRepository = userRepository;
        this.authorizedClientService = authorizedClientService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {
        System.out.println("DEBUG: OAuth2LoginSuccessHandler.onAuthenticationSuccess called!");
        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
        OAuth2User oauthUser = oauthToken.getPrincipal();

        System.out.println("DEBUG: Principal extracted: " + oauthUser.getName());

        // Note: Access token is not directly available in OAuth2AuthenticationToken
        // We'll store user info without the token for now, or implement a custom
        // OAuth2UserService
        // For MVP, we'll skip token storage and just save user profile data

        // Extract User Info
        Object idObj = oauthUser.getAttribute("id");
        Long githubId = idObj instanceof Number ? ((Number) idObj).longValue() : Long.valueOf(idObj.toString());
        String username = oauthUser.getAttribute("login");
        String avatarUrl = oauthUser.getAttribute("avatar_url");
        String email = oauthUser.getAttribute("email");

        System.out.println("DEBUG: User info extracted: " + username + ", " + githubId);

        // Save/Update User
        try {
            Optional<User> existing = userRepository.findByGithubId(githubId);
            User user;
            if (existing.isPresent()) {
                System.out.println("DEBUG: Updating existing user");
                user = existing.get();
                // TODO: Implement token storage via custom OAuth2UserService
                user.setAvatarUrl(avatarUrl);
                user.setUsername(username);
            } else {
                System.out.println("DEBUG: Creating new user");
                user = new User();
                user.setGithubId(githubId);
                user.setUsername(username);
                user.setAvatarUrl(avatarUrl);
                user.setEmail(email);
                // TODO: Implement token storage via custom OAuth2UserService
                user.setRoles(new String[] { "ROLE_USER" });
            }
            userRepository.save(user);
            System.out.println("DEBUG: User saved successfully");
        } catch (Exception e) {
            System.err.println("ERROR: Failed to save user: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }

        // Redirect to Frontend
        System.out.println("DEBUG: Redirecting to frontend...");
        response.sendRedirect("http://localhost:5173"); // Frontend URL
    }
}
