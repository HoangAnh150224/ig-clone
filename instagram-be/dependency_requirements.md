# FTS (Full-Text Search) Dependency and Configuration Requirements

This document outlines the necessary dependencies and configuration to replace the temporary `LIKE`-based search with a robust Full-Text Search engine like Elasticsearch.

The current implementation uses a temporary `DatabaseSearchRepositoryImpl` which is not suitable for production. To enable a proper search experience, the following steps are required.

## 1. Add Elasticsearch Dependency

Add the following dependency to the `pom.xml` file in the `instagram-be` module:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-elasticsearch</artifactId>
</dependency>
```

## 2. Configure Elasticsearch Connection

Add the following configuration to your `application.yml` to connect to your Elasticsearch instance.

```yaml
spring:
  elasticsearch:
    uris: http://localhost:9200
    # username: your-username
    # password: your-password
```

## 3. Create an Elasticsearch-backed Search Repository

Create a new implementation of the `SearchRepository` interface that uses Elasticsearch.

**File:** `instagram-be/src/main/java/com/instagram/be/search/repository/impl/ElasticsearchSearchRepositoryImpl.java`

```java
package com.instagram.be.search.repository.impl;

import com.instagram.be.search.repository.SearchRepository;
import com.instagram.be.userprofile.UserProfile;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.data.elasticsearch.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

import static org.elasticsearch.index.query.QueryBuilders.multiMatchQuery;

/**
 * Elasticsearch-backed search implementation.
 * This should be the primary search repository in production.
 */
@Repository("elasticsearchSearchRepository")
@RequiredArgsConstructor
public class ElasticsearchSearchRepositoryImpl implements SearchRepository {

    private final ElasticsearchOperations elasticsearchOperations;

    @Override
    public List<UserProfile> searchUsers(String query, Pageable pageable) {
        Query searchQuery = new NativeSearchQueryBuilder()
                .withQuery(multiMatchQuery(query)
                        .field("username")
                        .field("fullName")
                        .fuzziness("AUTO"))
                .withPageable(pageable)
                .build();

        return elasticsearchOperations.search(searchQuery, UserProfile.class)
                .stream()
                .map(SearchHit::getContent)
                .collect(Collectors.toList());
    }
}
```

## 4. Annotate UserProfile Entity

To make `UserProfile` indexable by Elasticsearch, you need to add the `@Document` annotation to the entity.

**File:** `instagram-be/src/main/java/com/instagram/be/userprofile/UserProfile.java`

```java
// ... other imports
import org.springframework.data.elasticsearch.annotations.Document;

@Entity
@Table(name = "user_profile")
@Document(indexName = "users") // Add this annotation
// ... rest of the class
public class UserProfile extends BaseEntity {
    // ...
}
```

## 5. Switch the Active Implementation

In `SearchService`, change the `@Qualifier` to use the new Elasticsearch implementation.

**File:** `instagram-be/src/main/java/com/instagram/be/search/service/SearchService.java`

```java
// ...
@Service
@RequiredArgsConstructor
public class SearchService extends BaseService<SearchRequest, SearchResultResponse> {

    @Qualifier("elasticsearchSearchRepository") // Change this from "databaseSearchRepository"
    private final SearchRepository searchRepository;
    private final HashtagRepository hashtagRepository;

    // ... rest of the class
}
```

## 6. Data Synchronization

You will need a strategy to keep the PostgreSQL database and Elasticsearch index in sync. This can be done through:
- **Dual writes**: Modify services to write to both PostgreSQL and Elasticsearch.
- **Change Data Capture (CDC)**: Use a tool like Debezium to stream changes from PostgreSQL to Elasticsearch.

---
**Note:** A similar approach should be taken for Post searching by caption, which involves creating a `PostDocument` in Elasticsearch and implementing `searchPosts` in the `SearchRepository`.

- # Dependency & Configuration Requirements                                                                                                                             │
│   -                                                                                                                                                                       │
│   - This document outlines the necessary dependency and configuration changes required for the new features.                                                              │
│   -                                                                                                                                                                       │
│   - ## 1. JWT Secret Rotation                                                                                                                                             │
│   -                                                                                                                                                                       │
│   - The application now supports JWT secret rotation. To configure this, you need to update your `application.yml` or environment variables.                              │
│   -                                                                                                                                                                       │
│   - ### Configuration (`application.yml`)                                                                                                                                 │
│   -                                                                                                                                                                       │
│   - The `app.jwt.secret` property has been replaced with `app.jwt.secrets`, which is a list of strings.                                                                   │
│   -                                                                                                                                                                       │
│   - -   The **first** key in the list is the **new, active key** used for signing new tokens.                                                                             │
│   - -   Any **subsequent** keys are considered **old keys**. They are used to verify existing tokens but not for signing new ones.                                        │
│   -                                                                                                                                                                       │
│   - This allows for a graceful rotation period where old tokens have not yet expired.                                                                                     │
│   -                                                                                                                                                                       │
│   - **Example `application.yml`:**                                                                                                                                        │
│   -                                                                                                                                                                       │
│   - ```yaml                                                                                                                                                               │
│   - app:                                                                                                                                                                  │
│   -   jwt:                                                                                                                                                                │
│   -     secrets:                                                                                                                                                          │
│   -       - "G-KaPdSgVkYp3s6v9y/B?E(H+MbQeThWmZq4t7w!z$C&F)J@NcRfUjXn2r5u8x/A" # <-- Newest key for signing                                                               │
│   -       - "C&F)J@NcRfUjXn2r5u8x/A?D(G-KaPdSgVkYp3s6v9y$B&E)H+MbQeThWmZq4t7w" # <-- Old key for verification                                                             │
│   -     expirationMs: 86400000 # 24 hours                                                                                                                                 │
│   -     refreshExpirationMs: 604800000 # 7 days                                                                                                                           │
│   - ```                                                                                                                                                                   │
│   -                                                                                                                                                                       │
│   - ### Environment Variables                                                                                                                                             │
│   -                                                                                                                                                                       │
│   - You can also configure this using environment variables.                                                                                                              │
│   -                                                                                                                                                                       │
│   - **Example:**                                                                                                                                                          │
│   -                                                                                                                                                                       │
│   - ```bash                                                                                                                                                               │
│   - export APP_JWT_SECRETS="G-KaPdSgVkYp3s6v9y/B?E(H+MbQeThWmZq4t7w!z$C&F)J@NcRfUjXn2r5u8x/A,C&F)J@NcRfUjXn2r5u8x/A?D(G-KaPdSgVkYp3s6v9y$B&E)H+MbQeThWmZq4t7w"            │
│   - export APP_JWT_EXPIRATION_MS=86400000                                                                                                                                 │
│   - export APP_JWT_REFRESH_EXPIRATION_MS=604800000                                                                                                                        │
│   - ```                                                                                                                                                                   │
│   -                                                                                                                                                                       │
│   - ## 2. Media Processing Validation                                                                                                                                     │
│   -                                                                                                                                                                       │
│   - No new libraries or environment variables are required for this feature. The validation rules (file size, MIME types) are configured within the                       │
│     `FileValidationService`.
