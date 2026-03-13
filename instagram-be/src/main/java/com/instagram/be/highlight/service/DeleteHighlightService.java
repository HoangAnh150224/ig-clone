package com.instagram.be.highlight.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.BusinessException;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.highlight.Highlight;
import com.instagram.be.highlight.repository.HighlightRepository;
import com.instagram.be.highlight.request.HighlightActionRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeleteHighlightService extends BaseService<HighlightActionRequest, Void> {

    private final HighlightRepository highlightRepository;

    @Override
    @Transactional
    public Void execute(HighlightActionRequest request) {
        return super.execute(request);
    }

    @Override
    protected Void doProcess(HighlightActionRequest request) {
        UUID userId = request.getUserContext().getUserId();
        Highlight highlight = highlightRepository.findById(request.getHighlightId())
                .orElseThrow(() -> new NotFoundException("Highlight", request.getHighlightId()));

        if (!highlight.getUser().getId().equals(userId)) {
            throw new BusinessException("You do not have permission to delete this highlight");
        }

        highlightRepository.delete(highlight);
        return null;
    }
}
