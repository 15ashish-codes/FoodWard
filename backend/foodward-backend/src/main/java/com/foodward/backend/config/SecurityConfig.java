package com.foodward.backend.config;

import com.foodward.backend.security.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;

    @Value("${app.cors.allowed-origins}")
    private String allowedOrigins;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(allowedOrigins.split(",")));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/h2-console/**").permitAll()
                        .requestMatchers("/actuator/health").permitAll()

                        // Donations
                        .requestMatchers(HttpMethod.POST, "/api/donations").hasRole("HOTEL")
                        .requestMatchers(HttpMethod.DELETE, "/api/donations/*").hasRole("HOTEL")
                        .requestMatchers(HttpMethod.GET, "/api/donations/mine").hasRole("HOTEL")
                        .requestMatchers(HttpMethod.GET, "/api/donations/active").hasRole("HOTEL")
                        .requestMatchers(HttpMethod.GET, "/api/donations/nearby").hasRole("ORPHANAGE")
                        .requestMatchers(HttpMethod.POST, "/api/donations/*/accept").hasRole("ORPHANAGE")
                        .requestMatchers(HttpMethod.GET, "/api/donations/accepted").hasRole("ORPHANAGE")
                        .requestMatchers(HttpMethod.GET, "/api/donations").hasRole("ADMIN")

                        // Pickups
                        .requestMatchers(HttpMethod.GET, "/api/pickups/available").hasRole("VOLUNTEER")
                        .requestMatchers(HttpMethod.POST, "/api/pickups/*/claim").hasRole("VOLUNTEER")
                        .requestMatchers(HttpMethod.PATCH, "/api/pickups/*/status").hasRole("VOLUNTEER")
                        .requestMatchers(HttpMethod.GET, "/api/pickups/mine").hasRole("VOLUNTEER")
                        .requestMatchers(HttpMethod.GET, "/api/pickups/completed").hasRole("VOLUNTEER")

                        // Users / verification — admin only
                        .requestMatchers("/api/users/**").hasRole("ADMIN")

                        // Notifications, profile — any authenticated role
                        .requestMatchers("/api/notifications/**").authenticated()
                        .requestMatchers("/api/profile/**").authenticated()

                        .anyRequest().authenticated()
                )
                .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin())) // allow H2 console frames
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
