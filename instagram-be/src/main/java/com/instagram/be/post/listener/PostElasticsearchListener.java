package com.instagram.be.post.listener;

import com.instagram.be.config.SpringContext;
import com.instagram.be.post.Post;
import com.instagram.be.post.document.PostDocument;
import jakarta.persistence.PostPersist;
import jakarta.persistence.PostRemove;
import jakarta.persistence.PostUpdate;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;

public class PostElasticsearchListener {

    @PostPersist
    @PostUpdate
    public void onPostPersistOrUpdate(Post post) {
        if (getElasticsearchOperations() != null) {
            PostDocument document = PostDocument.builder()
                    .id(post.getId())
                    .caption(post.getCaption())
                    .build();
            getElasticsearchOperations().save(document);
        }
    }

    @PostRemove
    public void onPostRemove(Post post) {
        if (getElasticsearchOperations() != null) {
            PostDocument document = PostDocument.builder()
                    .id(post.getId())
                    .build();
            getElasticsearchOperations().delete(document);
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
