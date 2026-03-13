package com.instagram.be.auth.controller;

import com.instagram.be.auth.request.*;
import com.instagram.be.auth.response.AuthResponse;
import com.instagram.be.auth.response.MeResponse;
import com.instagram.be.auth.service.*;
import com.instagram.be.base.SecurityUtils;
import com.instagram.be.base.UserContext;
import com.instagram.be.base.api.ApiResponse;
import com.instagram.be.exception.BusinessException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final RegisterService registerService;
    private final LoginService loginService;
    private final LogoutService logoutService;
    private final GetMeService getMeService;
    private final ChangePasswordService changePasswordService;
    private final ForgotPasswordService forgotPasswordService;
    private final ResetPasswordService resetPasswordService;
    private final RefreshTokenService refreshTokenService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request) {
        AuthResponse response = registerService.execute(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Registration successful", HttpStatus.CREATED.value()));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest) {
        request.setUserContext(UserContext.builder()
                .ipAddress(getClientIp(httpRequest))
                .build());
        AuthResponse response = loginService.execute(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Login successful", HttpStatus.OK.value()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(
            @Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse response = refreshTokenService.execute(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Token refreshed successfully", HttpStatus.OK.value()));
    }

    @PostMapping("/logout")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletRequest httpRequest) {
        String authHeader = httpRequest.getHeader("Authorization");
        String token = authHeader != null && authHeader.startsWith("Bearer ")
                ? authHeader.substring(7)
                : null;
        LogoutRequest request = LogoutRequest.builder().token(token).build();
        logoutService.execute(request);
        return ResponseEntity.ok(ApiResponse.success(null, "Logout successful", HttpStatus.OK.value()));
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<MeResponse>> getMe() {
        UserContext ctx = SecurityUtils.getCurrentUserContext()
                .orElseThrow(() -> new BusinessException("No authenticated user", HttpStatus.UNAUTHORIZED));
        GetMeRequest request = GetMeRequest.builder().userContext(ctx).build();
        MeResponse response = getMeService.execute(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Profile retrieved", HttpStatus.OK.value()));
    }

    @PostMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request) {
        UserContext ctx = SecurityUtils.getCurrentUserContext()
                .orElseThrow(() -> new BusinessException("No authenticated user", HttpStatus.UNAUTHORIZED));
        request.setUserContext(ctx);
        changePasswordService.execute(request);
        return ResponseEntity.ok(ApiResponse.success(null, "Password changed successfully", HttpStatus.OK.value()));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {
        forgotPasswordService.execute(request);
        return ResponseEntity.ok(ApiResponse.success(null,
                "If the email is registered, an OTP has been sent", HttpStatus.OK.value()));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {
        resetPasswordService.execute(request);
        return ResponseEntity.ok(ApiResponse.success(null, "Password reset successfully", HttpStatus.OK.value()));
    }

    private String getClientIp(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isEmpty()) {
            return forwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
