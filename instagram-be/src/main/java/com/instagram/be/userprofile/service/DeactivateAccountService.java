package com.instagram.be.userprofile.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.userprofile.UserProfile;
import com.instagram.be.userprofile.repository.UserProfileRepository;
import com.instagram.be.userprofile.request.DeactivateAccountRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeactivateAccountService extends BaseService<DeactivateAccountRequest, Void> {

    private final UserProfileRepository userProfileRepository;

    @Override
    @Transactional
    public Void execute(DeactivateAccountRequest request) {
        return super.execute(request);
    }

    @Override
    protected Void doProcess(DeactivateAccountRequest request) {
        UUID userId = request.getUserContext().getUserId();
        UserProfile user = userProfileRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User", userId));
        user.setActive(false);
        userProfileRepository.save(user);
        return null;
    }
}
