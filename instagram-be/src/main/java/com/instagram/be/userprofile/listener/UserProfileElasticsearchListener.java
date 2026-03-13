package com.instagram.be.userprofile.listener;

import com.instagram.be.config.SpringContext;
import com.instagram.be.userprofile.UserProfile;
import jakarta.persistence.PostPersist;
import jakarta.persistence.PostRemove;
import jakarta.persistence.PostUpdate;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;

public class UserProfileElasticsearchListener {

    @PostPersist
    @PostUpdate
    public void onPostPersistOrUpdate(UserProfile userProfile) {
        if (getElasticsearchOperations() != null) {
            getElasticsearchOperations().save(userProfile);
        }
    }

    @PostRemove
    public void onPostRemove(UserProfile userProfile) {
        if (getElasticsearchOperations() != null) {
            getElasticsearchOperations().delete(userProfile);
        }
    }

    private ElasticsearchOperations getElasticsearchOperations() {
        try {
            return SpringContext.getBean(ElasticsearchOperations.class);
        } catch (Exception e) {
            // Context might not be fully initialized during some tests, safe fallback
            return null;
        }
    }
}
