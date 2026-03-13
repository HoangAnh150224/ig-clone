package com.instagram.be.story.scheduler;

import com.instagram.be.story.Story;
import com.instagram.be.story.repository.StoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class StoryArchiveScheduler {

    private final StoryRepository storyRepository;

    /**
     * Every hour, archive expired stories.
     * Story is active for 24 hours (based on expiresAt).
     */
    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void archiveExpiredStories() {
        LocalDateTime now = LocalDateTime.now();
        List<Story> expired = storyRepository.findExpiredStories(now);

        if (!expired.isEmpty()) {
            log.info("Archiving {} expired stories", expired.size());
            expired.forEach(s -> s.setArchived(true));
            storyRepository.saveAll(expired);
        }
    }
}
