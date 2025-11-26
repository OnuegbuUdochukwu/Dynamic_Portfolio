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

        // Get Access Token
        OAuth2AuthorizedClient client = authorizedClientService.loadAuthorizedClient(
                oauthToken.getAuthorizedClientRegistrationId(),
                oauthToken.getName());

        String accessToken = client.getAccessToken().getTokenValue();

        // Extract User Info
        Long githubId = oauthUser.getAttribute("id");
        String username = oauthUser.getAttribute("login");
        String avatarUrl = oauthUser.getAttribute("avatar_url");
        String email = oauthUser.getAttribute("email");

        // Save/Update User
        Optional<User> existing = userRepository.findByGithubId(githubId);
        User user;
        if (existing.isPresent()) {
            user = existing.get();
            user.setEncryptedAccessToken(accessToken); // TODO: Encrypt!
            user.setAvatarUrl(avatarUrl);
            user.setUsername(username);
        } else {
            user = new User();
            user.setGithubId(githubId);
            user.setUsername(username);
            user.setAvatarUrl(avatarUrl);
            user.setEmail(email);
            user.setEncryptedAccessToken(accessToken);
            user.setRoles(new String[] { "ROLE_USER" });
        }
        userRepository.save(user);

        // Redirect to Frontend
        response.sendRedirect("http://localhost:5173"); // Frontend URL
    }
}
