package com.TrustLedger.Security;

import com.TrustLedger.Model.User;
import com.TrustLedger.Model.UserStatus;
import com.TrustLedger.Repository.UserRepository;
import com.TrustLedger.Service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Component;

import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;


@Component
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtService jwtService;

    private final UserRepository userRepository;


    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserRepository userRepository) {

        this.jwtService =
                jwtService;

        this.userRepository =
                userRepository;
    }


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {


        // =================================================
        // 1. READ AUTHORIZATION HEADER
        // =================================================

        String authHeader =
                request.getHeader(
                        "Authorization"
                );


        /*
         * No Authorization header:
         *
         * Continue normally.
         *
         * If this is a protected endpoint,
         * Spring Security will later return 401
         * through JwtAuthenticationEntryPoint.
         *
         * If this is a public endpoint,
         * the request continues normally.
         */
        if (
                authHeader == null ||
                        authHeader.isBlank()
        ) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }


        // =================================================
        // 2. CHECK BEARER FORMAT
        // =================================================

        if (
                !authHeader.startsWith(
                        "Bearer "
                )
        ) {

            writeUnauthorized(
                    response,
                    "Invalid Authorization header."
            );

            return;
        }


        // =================================================
        // 3. EXTRACT TOKEN
        // =================================================

        String token =
                authHeader.substring(7)
                        .trim();


        if (token.isBlank()) {

            writeUnauthorized(
                    response,
                    "JWT token is missing."
            );

            return;
        }


        // =================================================
        // 4. VALIDATE TOKEN
        // =================================================

        try {

            if (
                    !jwtService.isTokenValid(
                            token
                    )
            ) {

                SecurityContextHolder
                        .clearContext();


                writeUnauthorized(
                        response,
                        "Invalid or expired token. Please log in again."
                );

                return;
            }

        } catch (Exception exception) {

            /*
             * Handles:
             *
             * malformed JWT
             * expired JWT
             * invalid signature
             * parsing failures
             */

            SecurityContextHolder
                    .clearContext();


            writeUnauthorized(
                    response,
                    "Invalid or expired token. Please log in again."
            );

            return;
        }


        // =================================================
        // 5. EXTRACT EMAIL
        // =================================================

        String email;


        try {

            email =
                    jwtService.extractEmail(
                            token
                    );

        } catch (Exception exception) {

            SecurityContextHolder
                    .clearContext();


            writeUnauthorized(
                    response,
                    "Unable to read authentication token."
            );

            return;
        }


        if (
                email == null ||
                        email.isBlank()
        ) {

            writeUnauthorized(
                    response,
                    "Invalid authentication token."
            );

            return;
        }


        // =================================================
        // 6. AUTHENTICATE ONLY IF NEEDED
        // =================================================

        if (
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        == null
        ) {


            User user =
                    userRepository
                            .findByEmail(
                                    email
                            )
                            .orElse(null);


            // =============================================
            // USER NO LONGER EXISTS
            // =============================================

            if (
                    user == null
            ) {

                SecurityContextHolder
                        .clearContext();


                writeUnauthorized(
                        response,
                        "User account no longer exists."
                );

                return;
            }


            // =============================================
            // INACTIVE USER
            // =============================================

            /*
             * The token itself may be valid,
             * but this account is no longer
             * permitted to use the application.
             *
             * Therefore we keep this as 403.
             */
            if (
                    user.getStatus()
                            !=
                            UserStatus.ACTIVE
            ) {

                SecurityContextHolder
                        .clearContext();


                writeForbidden(
                        response,
                        "Account is inactive. Please contact an administrator."
                );

                return;
            }


            // =============================================
            // BUILD SPRING AUTHORITY
            // =============================================

            SimpleGrantedAuthority authority =
                    new SimpleGrantedAuthority(
                            "ROLE_"
                                    +
                                    user.getRole()
                                            .name()
                                            .toUpperCase()
                    );


            // =============================================
            // BUILD AUTHENTICATION
            // =============================================

            UsernamePasswordAuthenticationToken
                    authentication =

                    new UsernamePasswordAuthenticationToken(
                            user.getEmail(),
                            null,
                            List.of(
                                    authority
                            )
                    );


            // =============================================
            // STORE IN SECURITY CONTEXT
            // =============================================

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(
                            authentication
                    );
        }


        // =================================================
        // 7. CONTINUE FILTER CHAIN
        // =================================================

        filterChain.doFilter(
                request,
                response
        );
    }


    // =====================================================
    // 401 RESPONSE
    // =====================================================

    private void writeUnauthorized(
            HttpServletResponse response,
            String message)
            throws IOException {


        response.setStatus(
                HttpServletResponse.SC_UNAUTHORIZED
        );


        response.setContentType(
                "application/json"
        );


        response.setCharacterEncoding(
                "UTF-8"
        );


        response.getWriter().write(
                "{\"message\":\""
                        +
                        escapeJson(message)
                        +
                        "\"}"
        );
    }


    // =====================================================
    // 403 RESPONSE
    // =====================================================

    private void writeForbidden(
            HttpServletResponse response,
            String message)
            throws IOException {


        response.setStatus(
                HttpServletResponse.SC_FORBIDDEN
        );


        response.setContentType(
                "application/json"
        );


        response.setCharacterEncoding(
                "UTF-8"
        );


        response.getWriter().write(
                "{\"message\":\""
                        +
                        escapeJson(message)
                        +
                        "\"}"
        );
    }


    // =====================================================
    // SIMPLE JSON ESCAPE
    // =====================================================

    private String escapeJson(
            String value) {

        if (value == null) {

            return "";
        }


        return value
                .replace(
                        "\\",
                        "\\\\"
                )
                .replace(
                        "\"",
                        "\\\""
                );
    }
}