package com.TrustLedger.Config;

import com.TrustLedger.Security.JwtAuthenticationEntryPoint;
import com.TrustLedger.Security.JwtAuthenticationFilter;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;

import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;


@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter
            jwtAuthenticationFilter;

    private final JwtAuthenticationEntryPoint
            jwtAuthenticationEntryPoint;


    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint) {

        this.jwtAuthenticationFilter =
                jwtAuthenticationFilter;

        this.jwtAuthenticationEntryPoint =
                jwtAuthenticationEntryPoint;
    }


    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http)
            throws Exception {


        http

                // =========================================
                // CORS
                // =========================================

                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource()
                        )
                )


                // =========================================
                // CSRF
                // =========================================

                .csrf(csrf ->
                        csrf.disable()
                )


                // =========================================
                // STATELESS JWT SESSION
                // =========================================

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )


                // =========================================
                // 401 / 403 HANDLING
                // =========================================

                .exceptionHandling(exception ->

                        exception

                                /*
                                 * No authentication
                                 * or invalid authentication.
                                 *
                                 * -> 401
                                 */
                                .authenticationEntryPoint(
                                        jwtAuthenticationEntryPoint
                                )


                                /*
                                 * User IS authenticated,
                                 * but does not have permission.
                                 *
                                 * -> 403
                                 */
                                .accessDeniedHandler(
                                        (
                                                request,
                                                response,
                                                accessDeniedException
                                        ) -> {

                                            response.setStatus(
                                                    HttpServletResponse
                                                            .SC_FORBIDDEN
                                            );


                                            response.setContentType(
                                                    "application/json"
                                            );


                                            response.setCharacterEncoding(
                                                    "UTF-8"
                                            );


                                            response.getWriter().write(
                                                    """
                                                    {
                                                      "message": "You do not have permission to access this resource."
                                                    }
                                                    """
                                            );
                                        }
                                )
                )


                // =========================================
                // AUTHORIZATION
                // =========================================

                .authorizeHttpRequests(auth -> auth


                        // ---------------------------------
                        // CORS PREFLIGHT
                        // ---------------------------------

                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        )
                        .permitAll()


                        // ---------------------------------
                        // PUBLIC AUTH
                        // ---------------------------------

                        .requestMatchers(
                                "/api/auth/register",
                                "/api/auth/login"
                        )
                        .permitAll()


                        // ---------------------------------
                        // SWAGGER
                        // ---------------------------------

                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**"
                        )
                        .permitAll()


                        // ---------------------------------
                        // ADMIN
                        // ---------------------------------

                        .requestMatchers(
                                "/api/admin/**"
                        )
                        .hasRole(
                                "ADMIN"
                        )


                        // ---------------------------------
                        // CUSTOMERS
                        // ---------------------------------

                        .requestMatchers(
                                "/api/customers/**"
                        )
                        .hasAnyRole(
                                "CUSTOMER",
                                "ADMIN"
                        )


                        // ---------------------------------
                        // TRANSACTIONS
                        // ---------------------------------

                        .requestMatchers(
                                "/api/transactions/**"
                        )
                        .hasAnyRole(
                                "CUSTOMER",
                                "ADMIN"
                        )


                        // ---------------------------------
                        // EVERYTHING ELSE
                        // ---------------------------------

                        .anyRequest()
                        .authenticated()
                )


                // =========================================
                // JWT FILTER
                // =========================================

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );


        return http.build();
    }


    // =====================================================
    // CORS CONFIG
    // =====================================================

    @Bean
    public CorsConfigurationSource
    corsConfigurationSource() {


        CorsConfiguration configuration =
                new CorsConfiguration();


        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost:5173",
                        "http://localhost:5174",
                        "https://bank-of-trust.pages.dev"
                )
        );


        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "PATCH",
                        "OPTIONS"
                )
        );


        configuration.setAllowedHeaders(
                List.of("*")
        );


        configuration.setExposedHeaders(
                List.of(
                        "Authorization"
                )
        );


        configuration.setAllowCredentials(
                true
        );


        configuration.setMaxAge(
                3600L
        );


        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();


        source.registerCorsConfiguration(
                "/**",
                configuration
        );


        return source;
    }


    // =====================================================
    // PASSWORD ENCODER
    // =====================================================

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }
}