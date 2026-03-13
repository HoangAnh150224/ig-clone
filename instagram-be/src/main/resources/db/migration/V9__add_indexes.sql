-- V9__add_indexes.sql
-- Composite indexes targeting the hot query paths identified in application code.
-- MySQL 8 supports DESC index columns — used on (created_at, id) to match
-- ORDER BY ... DESC, id DESC without a filesort.

-- =====================================================
-- POST
-- =====================================================

-- User profile page + countByUserIdAndArchivedFalse + archived posts list
-- Covers: WHERE user_id = ? AND is_archived = ?  ORDER BY created_at DESC, id DESC
CREATE INDEX idx_post_user_archived_time
    ON post (user_id, is_archived, created_at DESC, id DESC);

-- Explore feed + cursor keyset filter
-- Covers: WHERE is_archived = false ORDER BY created_at DESC, id DESC
CREATE INDEX idx_post_archived_time
    ON post (is_archived, created_at DESC, id DESC);

-- Tagged posts lookup: covering index avoids clustered-index back-lookup
-- Covers: WHERE tagged_user_id = ? (joins to post for is_archived filter)
CREATE INDEX idx_post_tag_user_post
    ON post_tag (tagged_user_id, post_id);

-- =====================================================
-- FOLLOW
-- =====================================================

-- countByFollowingIdAndStatus + findFollowersByUserId (ACCEPTED)
-- Also covers the batch findFollowedIds(followerId, targetIds) check
CREATE INDEX idx_follow_following_status
    ON follow (following_id, status);

-- countByFollowerIdAndStatus + findFollowingByUserId (ACCEPTED)
-- The UNIQUE KEY (follower_id, following_id) exists but doesn't cover status.
CREATE INDEX idx_follow_follower_status
    ON follow (follower_id, status);

-- =====================================================
-- NOTIFICATION
-- =====================================================

-- Cursor pagination: findFirstByRecipientId + findWithCursorByRecipientId
-- Covers: WHERE recipient_id = ? [AND cursor cond] ORDER BY created_at DESC, id DESC
CREATE INDEX idx_notification_recipient_time
    ON notification (recipient_id, created_at DESC, id DESC);

-- Unread badge: countByRecipientIdAndReadFalse
-- Covers: WHERE recipient_id = ? AND is_read = ?
CREATE INDEX idx_notification_recipient_read
    ON notification (recipient_id, is_read);

-- =====================================================
-- MESSAGE
-- =====================================================

-- Cursor pagination: findFirstByConversationId + findWithCursorByConversationId
-- Covers: WHERE conversation_id = ? AND is_deleted = false [AND cursor cond]
--         ORDER BY created_at DESC, id DESC
CREATE INDEX idx_message_conv_deleted_time
    ON message (conversation_id, is_deleted, created_at DESC, id DESC);

-- =====================================================
-- CONVERSATION_PARTICIPANT
-- =====================================================

-- getConversations (is_accepted = true) + getMessageRequests (is_accepted = false)
-- UNIQUE KEY (conversation_id, user_id) exists; this covers the reverse lookup.
-- Covers: WHERE user_id = ? AND is_accepted = ?
CREATE INDEX idx_cp_user_accepted
    ON conversation_participant (user_id, is_accepted);

-- =====================================================
-- COMMENT
-- =====================================================

-- Root comment listing per post
-- Covers: WHERE post_id = ? AND parent_comment_id IS NULL ORDER BY created_at DESC
CREATE INDEX idx_comment_post_parent_time
    ON comment (post_id, parent_comment_id, created_at DESC);

-- Batch reply count: countRepliesByParentIds
-- WHERE parent_comment_id IN (...)
-- MySQL auto-creates single-col idx from FK, but an explicit one documents intent
-- and ensures it exists even if FK index is ever dropped.
CREATE INDEX idx_comment_parent
    ON comment (parent_comment_id);

-- =====================================================
-- POST_LIKE
-- =====================================================

-- findLikedPostIds: WHERE user_id = ? AND post_id IN (...)
-- The UNIQUE KEY is (post_id, user_id) — wrong order for user_id-first lookups.
CREATE INDEX idx_post_like_user_post
    ON post_like (user_id, post_id);

-- =====================================================
-- STORY
-- =====================================================

-- Story feed: WHERE user_id IN (...) AND is_archived = false AND expires_at > NOW()
-- Covers: user_id + is_archived filter; expires_at used as range condition
CREATE INDEX idx_story_user_archived_expires
    ON story (user_id, is_archived, expires_at);

-- =====================================================
-- BLOCK
-- =====================================================

-- existsBlockBetween checks BOTH directions:
--   (blocker_id = :a AND blocked_id = :b) OR (blocker_id = :b AND blocked_id = :a)
-- UNIQUE KEY covers (blocker_id, blocked_id); this covers the reverse direction.
CREATE INDEX idx_block_blocked_blocker
    ON block (blocked_id, blocker_id);

-- =====================================================
-- SEARCH_HISTORY
-- =====================================================

-- GetSearchHistoryService: WHERE user_id = ? ORDER BY created_at DESC
-- FK auto-index covers user_id only; adding created_at avoids filesort.
CREATE INDEX idx_search_history_user_time
    ON search_history (user_id, created_at DESC);

-- =====================================================
-- SAVED_POST
-- =====================================================

-- GetSavedPostsService: WHERE user_id = ? ORDER BY created_at DESC
-- UNIQUE KEY (user_id, post_id) covers the equality lookup but not ordered scan.
CREATE INDEX idx_saved_post_user_time
    ON saved_post (user_id, created_at DESC);
