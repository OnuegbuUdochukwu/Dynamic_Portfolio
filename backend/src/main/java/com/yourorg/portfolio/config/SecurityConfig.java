package com.yourorg.portfolio.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

        private final OAuth2LoginSuccessHandler successHandler;

        public SecurityConfig(OAuth2LoginSuccessHandler successHandler,
                        @org.springframework.beans.factory.annotation.Value("${spring.security.oauth2.client.registration.github.client-id}") String clientId) {
                this.successHandler = successHandler;
                System.out.println("DEBUG: GitHub Client ID loaded: "
                                + (clientId != null && clientId.length() > 4 ? clientId.substring(0, 4) + "..."
                                                : "null/empty"));
                System.out.println("DEBUG: Success Handler injected: "
                                + (successHandler != null ? successHandler.getClass().getName() : "null"));
        }

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
                http
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .csrf(csrf -> csrf.disable()) // Disable CSRF for simplicity in MVP (enable in prod with
                                                              // Cookie)
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers("/api/v1/auth/**", "/login/**", "/oauth2/**",
                                                                "/api/v1/portfolio/**",
                                                                "/actuator/**")
                                                .permitAll()
                                                .anyRequest().authenticated())
                                .oauth2Login(oauth2 -> oauth2
                                                .successHandler(successHandler))
                                .logout(logout -> logout
                                                .logoutUrl("/api/v1/auth/logout")
                                                .logoutSuccessHandler((request, response, authentication) -> {
                                                        response.setStatus(200);
                                                })
                                                .invalidateHttpSession(true)
                                                .clearAuthentication(true)
                                                .deleteCookies("JSESSIONID"));

                return http.build();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.setAllowedOrigins(List.of("http://localhost:5173", "http://127.0.0.1:5173"));
                configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                configuration.setAllowedHeaders(List.of("*"));
                configuration.setAllowCredentials(true);
                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }

}
