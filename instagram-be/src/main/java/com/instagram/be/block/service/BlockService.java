package com.instagram.be.block.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.block.Block;
import com.instagram.be.block.repository.BlockRepository;
import com.instagram.be.block.request.BlockRequest;
import com.instagram.be.block.response.BlockResponse;
import com.instagram.be.exception.BusinessException;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.follow.repository.FollowRepository;
import com.instagram.be.userprofile.UserProfile;
import com.instagram.be.userprofile.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BlockService extends BaseService<BlockRequest, BlockResponse> {

    private final BlockRepository blockRepository;
    private final FollowRepository followRepository;
    private final UserProfileRepository userProfileRepository;

    @Override
    @Transactional
    public BlockResponse execute(BlockRequest request) {
        return super.execute(request);
    }

    @Override
    protected BlockResponse doProcess(BlockRequest request) {
        UUID blockerId = request.getUserContext().getUserId();
        UUID blockedId = request.getTargetUserId();

        if (blockerId.equals(blockedId)) {
            throw new BusinessException("Cannot block yourself");
        }

        // Toggle: if already blocked, unblock
        if (blockRepository.existsByBlockerIdAndBlockedId(blockerId, blockedId)) {
            blockRepository.findByBlockerIdAndBlockedId(blockerId, blockedId)
                    .ifPresent(blockRepository::delete);
            return new BlockResponse(false);
        }

        // Block: remove follow relationships in both directions first
        followRepository.deleteAllBetween(blockerId, blockedId);

        UserProfile blocker = userProfileRepository.getReferenceById(blockerId);
        UserProfile blocked = userProfileRepository.findById(blockedId)
                .orElseThrow(() -> new NotFoundException("User", blockedId));

        blockRepository.save(Block.builder()
                .blocker(blocker)
                .blocked(blocked)
                .build());

        return new BlockResponse(true);
    }
}
