-- V2__add_all_entities.sql
-- Adds all missing columns to user_profile and creates all feature tables

-- =====================================================
-- ALTER user_profile: add all missing columns
-- =====================================================
ALTER TABLE `user_profile`
    ADD COLUMN `password_hash`        VARCHAR(255) NOT NULL DEFAULT '',
    ADD COLUMN `role`                 ENUM('USER','ADMIN') NOT NULL DEFAULT 'USER',
    ADD COLUMN `website`              VARCHAR(255),
    ADD COLUMN `pronouns`             VARCHAR(50),
    ADD COLUMN `profile_category`     VARCHAR(100),
    ADD COLUMN `gender`               ENUM('MALE','FEMALE','CUSTOM','PREFER_NOT_TO_SAY'),
    ADD COLUMN `phone_number`         VARCHAR(20),
    ADD COLUMN `is_verified`          TINYINT(1) NOT NULL DEFAULT 0,
    ADD COLUMN `is_private`           TINYINT(1) NOT NULL DEFAULT 0,
    ADD COLUMN `show_activity_status` TINYINT(1) NOT NULL DEFAULT 1,
    ADD COLUMN `tag_permission`       ENUM('EVERYONE','FOLLOWERS') NOT NULL DEFAULT 'EVERYONE',
    ADD COLUMN `notifications_paused` TINYINT(1) NOT NULL DEFAULT 0;

-- =====================================================
-- POST
-- =====================================================
CREATE TABLE `post`
(
    `id`                BINARY(16)          NOT NULL,
    `user_id`           BINARY(16)          NOT NULL,
    `caption`           TEXT,
    `type`              ENUM('POST','REEL') NOT NULL DEFAULT 'POST',
    `music`             VARCHAR(255),
    `location_name`     VARCHAR(255),
    `is_archived`       TINYINT(1)          NOT NULL DEFAULT 0,
    `comments_disabled` TINYINT(1)          NOT NULL DEFAULT 0,
    `hide_like_count`   TINYINT(1)          NOT NULL DEFAULT 0,
    `share_count`       INT                 NOT NULL DEFAULT 0,
    `created_at`        DATETIME(6),
    `updated_at`        DATETIME(6),
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_post_user` FOREIGN KEY (`user_id`) REFERENCES `user_profile` (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE `post_media`
(
    `id`            BINARY(16)            NOT NULL,
    `post_id`       BINARY(16)            NOT NULL,
    `url`           VARCHAR(500)          NOT NULL,
    `media_type`    ENUM('IMAGE','VIDEO') NOT NULL,
    `display_order` INT                   NOT NULL DEFAULT 0,
    `created_at`    DATETIME(6),
    `updated_at`    DATETIME(6),
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_post_media_post` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE `post_like`
(
    `id`         BINARY(16) NOT NULL,
    `post_id`    BINARY(16) NOT NULL,
    `user_id`    BINARY(16) NOT NULL,
    `created_at` DATETIME(6),
    `updated_at` DATETIME(6),
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_post_like` (`post_id`, `user_id`),
    CONSTRAINT `fk_post_like_post` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`),
    CONSTRAINT `fk_post_like_user` FOREIGN KEY (`user_id`) REFERENCES `user_profile` (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE `post_view`
(
    `id`         BINARY(16) NOT NULL,
    `post_id`    BINARY(16) NOT NULL,
    `viewer_id`  BINARY(16) NOT NULL,
    `created_at` DATETIME(6),
    `updated_at` DATETIME(6),
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_post_view` (`post_id`, `viewer_id`),
    CONSTRAINT `fk_post_view_post`   FOREIGN KEY (`post_id`)  REFERENCES `post` (`id`),
    CONSTRAINT `fk_post_view_viewer` FOREIGN KEY (`viewer_id`) REFERENCES `user_profile` (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE `post_tag`
(
    `id`             BINARY(16) NOT NULL,
    `post_id`        BINARY(16) NOT NULL,
    `tagged_user_id` BINARY(16) NOT NULL,
    `created_at`     DATETIME(6),
    `updated_at`     DATETIME(6),
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_post_tag` (`post_id`, `tagged_user_id`),
    CONSTRAINT `fk_post_tag_post` FOREIGN KEY (`post_id`)        REFERENCES `post` (`id`),
    CONSTRAINT `fk_post_tag_user` FOREIGN KEY (`tagged_user_id`) REFERENCES `user_profile` (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- =====================================================
-- HASHTAG
-- =====================================================
CREATE TABLE `hashtag`
(
    `id`         BINARY(16)   NOT NULL,
    `name`       VARCHAR(100) NOT NULL,
    `created_at` DATETIME(6),
    `updated_at` DATETIME(6),
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_hashtag_name` (`name`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE `post_hashtag`
(
    `post_id`    BINARY(16) NOT NULL,
    `hashtag_id` BINARY(16) NOT NULL,
    PRIMARY KEY (`post_id`, `hashtag_id`),
    CONSTRAINT `fk_ph_post`    FOREIGN KEY (`post_id`)    REFERENCES `post` (`id`),
    CONSTRAINT `fk_ph_hashtag` FOREIGN KEY (`hashtag_id`) REFERENCES `hashtag` (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- =====================================================
-- COMMENT
-- =====================================================
CREATE TABLE `comment`
(
    `id`                BINARY(16) NOT NULL,
    `post_id`           BINARY(16) NOT NULL,
    `user_id`           BINARY(16) NOT NULL,
    `content`           TEXT       NOT NULL,
    `parent_comment_id` BINARY(16),
    `is_pinned`         TINYINT(1) NOT NULL DEFAULT 0,
    `created_at`        DATETIME(6),
    `updated_at`        DATETIME(6),
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_comment_post`   FOREIGN KEY (`post_id`)           REFERENCES `post` (`id`),
    CONSTRAINT `fk_comment_user`   FOREIGN KEY (`user_id`)           REFERENCES `user_profile` (`id`),
    CONSTRAINT `fk_comment_parent` FOREIGN KEY (`parent_comment_id`) REFERENCES `comment` (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE `comment_like`
(
    `id`         BINARY(16) NOT NULL,
    `comment_id` BINARY(16) NOT NULL,
    `user_id`    BINARY(16) NOT NULL,
    `created_at` DATETIME(6),
    `updated_at` DATETIME(6),
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_comment_like` (`comment_id`, `user_id`),
    CONSTRAINT `fk_comment_like_comment` FOREIGN KEY (`comment_id`) REFERENCES `comment` (`id`),
    CONSTRAINT `fk_comment_like_user`    FOREIGN KEY (`user_id`)    REFERENCES `user_profile` (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- =====================================================
-- FOLLOW
-- =====================================================
CREATE TABLE `follow`
(
    `id`           BINARY(16)                 NOT NULL,
    `follower_id`  BINARY(16)                 NOT NULL,
    `following_id` BINARY(16)                 NOT NULL,
    `status`       ENUM('PENDING','ACCEPTED') NOT NULL DEFAULT 'ACCEPTED',
    `created_at`   DATETIME(6),
    `updated_at`   DATETIME(6),
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_follow` (`follower_id`, `following_id`),
    CONSTRAINT `fk_follow_follower`  FOREIGN KEY (`follower_id`)  REFERENCES `user_profile` (`id`),
    CONSTRAINT `fk_follow_following` FOREIGN KEY (`following_id`) REFERENCES `user_profile` (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- =====================================================
-- STORY
-- =====================================================
CREATE TABLE `story`
(
    `id`               BINARY(16)            NOT NULL,
    `user_id`          BINARY(16)            NOT NULL,
    `media_url`        VARCHAR(500)          NOT NULL,
    `media_type`       ENUM('IMAGE','VIDEO') NOT NULL DEFAULT 'IMAGE',
    `expires_at`       DATETIME(6)           NOT NULL,
    `link_url`         VARCHAR(500),
    `source_post_id`   BINARY(16),
    `is_close_friends` TINYINT(1)            NOT NULL DEFAULT 0,
    `is_archived`      TINYINT(1)            NOT NULL DEFAULT 0,
    `created_at`       DATETIME(6),
    `updated_at`       DATETIME(6),
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_story_user`        FOREIGN KEY (`user_id`)       REFERENCES `user_profile` (`id`),
    CONSTRAINT `fk_story_source_post` FOREIGN KEY (`source_post_id`) REFERENCES `post` (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE `story_view`
(
    `id`         BINARY(16) NOT NULL,
    `story_id`   BINARY(16) NOT NULL,
    `viewer_id`  BINARY(16) NOT NULL,
    `liked`      TINYINT(1) NOT NULL DEFAULT 0,
    `created_at` DATETIME(6),
    `updated_at` DATETIME(6),
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_story_view` (`story_id`, `viewer_id`),
    CONSTRAINT `fk_story_view_story`  FOREIGN KEY (`story_id`)  REFERENCES `story` (`id`),
    CONSTRAINT `fk_story_view_viewer` FOREIGN KEY (`viewer_id`) REFERENCES `user_profile` (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE `story_reply`
(
    `id`         BINARY(16) NOT NULL,
    `story_id`   BINARY(16) NOT NULL,
    `user_id`    BINARY(16) NOT NULL,
    `text`       TEXT       NOT NULL,
    `created_at` DATETIME(6),
    `updated_at` DATETIME(6),
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_story_reply_story` FOREIGN KEY (`story_id`) REFERENCES `story` (`id`),
    CONSTRAINT `fk_story_reply_user`  FOREIGN KEY (`user_id`)  REFERENCES `user_profile` (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE `story_mention`
(
    `id`                BINARY(16) NOT NULL,
    `story_id`          BINARY(16) NOT NULL,
    `mentioned_user_id` BINARY(16) NOT NULL,
    `created_at`        DATETIME(6),
    `updated_at`        DATETIME(6),
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_story_mention` (`story_id`, `mentioned_user_id`),
    CONSTRAINT `fk_sm_story` FOREIGN KEY (`story_id`)          REFERENCES `story` (`id`),
    CONSTRAINT `fk_sm_user`  FOREIGN KEY (`mentioned_user_id`) REFERENCES `user_profile` (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- =====================================================
-- HIGHLIGHT
-- =====================================================
CREATE TABLE `highlight`
(
    `id`         BINARY(16)   NOT NULL,
    `user_id`    BINARY(16)   NOT NULL,
    `title`      VARCHAR(100) NOT NULL,
    `cover_url`  VARCHAR(500),
    `created_at` DATETIME(6),
    `updated_at` DATETIME(6),
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_highlight_user` FOREIGN KEY (`user_id`) REFERENCES `user_profile` (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE `highlight_story`
(
    `highlight_id` BINARY(16) NOT NULL,
    `story_id`     BINARY(16) NOT NULL,
    PRIMARY KEY (`highlight_id`, `story_id`),
    CONSTRAINT `fk_hs_highlight` FOREIGN KEY (`highlight_id`) REFERENCES `highlight` (`id`),
    CONSTRAINT `fk_hs_story`     FOREIGN KEY (`story_id`)     REFERENCES `story` (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- =====================================================
-- SAVED / FAVORITE / BLOCK
-- =====================================================
CREATE TABLE `saved_post`
(
    `id`         BINARY(16) NOT NULL,
    `user_id`    BINARY(16) NOT NULL,
    `post_id`    BINARY(16) NOT NULL,
    `created_at` DATETIME(6),
    `updated_at` DATETIME(6),
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_saved_post` (`user_id`, `post_id`),
    CONSTRAINT `fk_saved_user` FOREIGN KEY (`user_id`) REFERENCES `user_profile` (`id`),
    CONSTRAINT `fk_saved_post` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE `favorite_post`
(
    `id`         BINARY(16) NOT NULL,
    `user_id`    BINARY(16) NOT NULL,
    `post_id`    BINARY(16) NOT NULL,
    `created_at` DATETIME(6),
    `updated_at` DATETIME(6),
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_favorite_post` (`user_id`, `post_id`),
    CONSTRAINT `fk_fav_post_user` FOREIGN KEY (`user_id`) REFERENCES `user_profile` (`id`),
    CONSTRAINT `fk_fav_post_post` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- favorite_user: used for (1) feed priority and (2) close friends story visibility
CREATE TABLE `favorite_user`
(
    `id`          BINARY(16) NOT NULL,
    `user_id`     BINARY(16) NOT NULL,
    `favorite_id` BINARY(16) NOT NULL,
    `created_at`  DATETIME(6),
    `updated_at`  DATETIME(6),
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_favorite_user` (`user_id`, `favorite_id`),
    CONSTRAINT `fk_fav_user_owner` FOREIGN KEY (`user_id`)     REFERENCES `user_profile` (`id`),
    CONSTRAINT `fk_fav_user_fav`   FOREIGN KEY (`favorite_id`) REFERENCES `user_profile` (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE `block`
(
    `id`         BINARY(16) NOT NULL,
    `blocker_id` BINARY(16) NOT NULL,
    `blocked_id` BINARY(16) NOT NULL,
    `created_at` DATETIME(6),
    `updated_at` DATETIME(6),
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_block` (`blocker_id`, `blocked_id`),
    CONSTRAINT `fk_block_blocker` FOREIGN KEY (`blocker_id`) REFERENCES `user_profile` (`id`),
    CONSTRAINT `fk_block_blocked` FOREIGN KEY (`blocked_id`) REFERENCES `user_profile` (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- =====================================================
-- MESSAGE
-- =====================================================
CREATE TABLE `conversation`
(
    `id`         BINARY(16) NOT NULL,
    `created_at` DATETIME(6),
    `updated_at` DATETIME(6),
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE `conversation_participant`
(
    `id`              BINARY(16) NOT NULL,
    `conversation_id` BINARY(16) NOT NULL,
    `user_id`         BINARY(16) NOT NULL,
    `is_accepted`     TINYINT(1) NOT NULL DEFAULT 1,
    `last_read_at`    DATETIME(6),
    `created_at`      DATETIME(6),
    `updated_at`      DATETIME(6),
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_conv_participant` (`conversation_id`, `user_id`),
    CONSTRAINT `fk_cp_conv` FOREIGN KEY (`conversation_id`) REFERENCES `conversation` (`id`),
    CONSTRAINT `fk_cp_user` FOREIGN KEY (`user_id`)         REFERENCES `user_profile` (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE `message`
(
    `id`              BINARY(16) NOT NULL,
    `conversation_id` BINARY(16) NOT NULL,
    `sender_id`       BINARY(16) NOT NULL,
    `content`         TEXT,
    `media_url`       VARCHAR(500),
    `media_type`      ENUM('IMAGE','VIDEO'),
    `shared_post_id`  BINARY(16),
    `is_deleted`      TINYINT(1) NOT NULL DEFAULT 0,
    `created_at`      DATETIME(6),
    `updated_at`      DATETIME(6),
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_msg_conv`        FOREIGN KEY (`conversation_id`) REFERENCES `conversation` (`id`),
    CONSTRAINT `fk_msg_sender`      FOREIGN KEY (`sender_id`)       REFERENCES `user_profile` (`id`),
    CONSTRAINT `fk_msg_shared_post` FOREIGN KEY (`shared_post_id`)  REFERENCES `post` (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- =====================================================
-- NOTIFICATION
-- =====================================================
CREATE TABLE `notification`
(
    `id`           BINARY(16)                                                                NOT NULL,
    `recipient_id` BINARY(16)                                                                NOT NULL,
    `actor_id`     BINARY(16)                                                                NOT NULL,
    `type`         ENUM('LIKE','FOLLOW','COMMENT','MENTION','FOLLOW_REQUEST','TAG','STORY_REPLY') NOT NULL,
    `post_id`      BINARY(16),
    `comment_id`   BINARY(16),
    `is_read`      TINYINT(1)                                                                NOT NULL DEFAULT 0,
    `created_at`   DATETIME(6),
    `updated_at`   DATETIME(6),
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_notif_recipient` FOREIGN KEY (`recipient_id`) REFERENCES `user_profile` (`id`),
    CONSTRAINT `fk_notif_actor`     FOREIGN KEY (`actor_id`)     REFERENCES `user_profile` (`id`),
    CONSTRAINT `fk_notif_post`      FOREIGN KEY (`post_id`)      REFERENCES `post` (`id`),
    CONSTRAINT `fk_notif_comment`   FOREIGN KEY (`comment_id`)   REFERENCES `comment` (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- =====================================================
-- REPORT
-- =====================================================
CREATE TABLE `report`
(
    `id`          BINARY(16)   NOT NULL,
    `reporter_id` BINARY(16)   NOT NULL,
    `post_id`     BINARY(16)   NOT NULL,
    `reason`      VARCHAR(255),
    `created_at`  DATETIME(6),
    `updated_at`  DATETIME(6),
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_report_reporter` FOREIGN KEY (`reporter_id`) REFERENCES `user_profile` (`id`),
    CONSTRAINT `fk_report_post`     FOREIGN KEY (`post_id`)     REFERENCES `post` (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- =====================================================
-- SEARCH HISTORY
-- =====================================================
CREATE TABLE `search_history`
(
    `id`               BINARY(16) NOT NULL,
    `user_id`          BINARY(16) NOT NULL,
    `searched_user_id` BINARY(16),
    `hashtag_id`       BINARY(16),
    `created_at`       DATETIME(6),
    `updated_at`       DATETIME(6),
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_sh_user`          FOREIGN KEY (`user_id`)          REFERENCES `user_profile` (`id`),
    CONSTRAINT `fk_sh_searched_user` FOREIGN KEY (`searched_user_id`) REFERENCES `user_profile` (`id`),
    CONSTRAINT `fk_sh_hashtag`       FOREIGN KEY (`hashtag_id`)       REFERENCES `hashtag` (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;
