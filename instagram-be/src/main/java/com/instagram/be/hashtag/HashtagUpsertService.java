package com.instagram.be.hashtag;

import com.instagram.be.hashtag.repository.HashtagRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class HashtagUpsertService {

    private final HashtagRepository hashtagRepository;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public Set<Hashtag> upsertAll(Set<String> names) {
        if (names == null || names.isEmpty()) return Set.of();

        Set<String> lowerNames = names.stream().map(String::toLowerCase).collect(Collectors.toSet());
        Set<Hashtag> existing = hashtagRepository.findByNameIn(lowerNames);
        Set<String> existingNames = existing.stream().map(Hashtag::getName).collect(Collectors.toSet());

        Set<String> missing = lowerNames.stream()
                .filter(n -> !existingNames.contains(n))
                .collect(Collectors.toSet());

        for (String name : missing) {
            try {
                Hashtag saved = hashtagRepository.save(Hashtag.builder().name(name).build());
                existing.add(saved);
            } catch (DataIntegrityViolationException e) {
                // Concurrent insert — retry find
                log.debug("Concurrent hashtag insert for '{}', retrying find", name);
                hashtagRepository.findByName(name).ifPresent(existing::add);
            }
        }

        return existing;
    }
}
