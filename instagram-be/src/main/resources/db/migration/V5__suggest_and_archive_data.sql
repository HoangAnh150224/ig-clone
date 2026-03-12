-- V5__suggest_and_archive_data.sql
-- Add more users for 'Suggest for You' feature
-- Add archive stories and posts
-- Add blocked users, more comments, and notifications
-- =====================================================

-- Re-declare existing user handles
SET @alice = UUID_TO_BIN('11111111-1111-1111-1111-111111111111');
SET @bob   = UUID_TO_BIN('22222222-2222-2222-2222-222222222222');
SET @carol = UUID_TO_BIN('33333333-3333-3333-3333-333333333333');
SET @dave  = UUID_TO_BIN('44444444-4444-4444-4444-444444444444');
SET @eve   = UUID_TO_BIN('55555555-5555-5555-5555-555555555555');
SET @frank = UUID_TO_BIN('66666666-6666-6666-6666-666666666666');

-- New User IDs
SET @grace = UUID_TO_BIN('77777777-7777-7777-7777-777777777777');
SET @heidi = UUID_TO_BIN('88888888-8888-8888-8888-888888888888');
SET @ivan  = UUID_TO_BIN('99999999-9999-9999-9999-999999999999');
SET @judy  = UUID_TO_BIN('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
SET @kyle  = UUID_TO_BIN('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
SET @troll = UUID_TO_BIN('ffffffff-ffff-ffff-ffff-ffffffffffff');

-- =====================================================
-- NEW USERS (password = 'password')
-- =====================================================
INSERT INTO user_profile (id, username, email, full_name, bio, avatar_url, password_hash, role,
                          is_verified, is_private, is_active, created_at, updated_at)
VALUES
    (@grace, 'grace', 'grace@example.com', 'Grace Hopper', 'Coding the future 💻', 'https://i.pravatar.cc/150?img=20', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'USER', 1, 0, 1, NOW(), NOW()),
    (@heidi, 'heidi', 'heidi@example.com', 'Heidi Klum', 'Fashion & Style ✨', 'https://i.pravatar.cc/150?img=26', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'USER', 0, 0, 1, NOW(), NOW()),
    (@ivan, 'ivan', 'ivan@example.com', 'Ivan Drago', 'I must break you... in the gym 🥊', 'https://i.pravatar.cc/150?img=12', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'USER', 0, 0, 1, NOW(), NOW()),
    (@judy, 'judy', 'judy@example.com', 'Judy Hopps', 'Try everything! 🐰', 'https://i.pravatar.cc/150?img=32', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'USER', 0, 0, 1, NOW(), NOW()),
    (@kyle, 'kyle', 'kyle@example.com', 'Kyle Reese', 'Come with me if you want to live', 'https://i.pravatar.cc/150?img=13', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'USER', 0, 1, 1, NOW(), NOW()),
    (@troll, 'troll_master', 'troll@example.com', 'Troll Account', 'I love spamming', 'https://i.pravatar.cc/150?img=14', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'USER', 0, 0, 1, NOW(), NOW());

-- =====================================================
-- FOLLOWS for Suggestions
-- =====================================================
INSERT INTO follow (id, follower_id, following_id, status, created_at, updated_at) VALUES
    (UUID_TO_BIN('f0000005-0000-0000-0000-000000000001'), @grace, @alice, 'ACCEPTED', NOW(), NOW()),
    (UUID_TO_BIN('f0000005-0000-0000-0000-000000000002'), @grace, @bob,   'ACCEPTED', NOW(), NOW()),
    (UUID_TO_BIN('f0000005-0000-0000-0000-000000000003'), @heidi, @alice, 'ACCEPTED', NOW(), NOW()),
    (UUID_TO_BIN('f0000005-0000-0000-0000-000000000004'), @heidi, @carol, 'ACCEPTED', NOW(), NOW()),
    (UUID_TO_BIN('f0000005-0000-0000-0000-000000000005'), @ivan,  @bob,   'ACCEPTED', NOW(), NOW()),
    (UUID_TO_BIN('f0000005-0000-0000-0000-000000000006'), @ivan,  @carol, 'ACCEPTED', NOW(), NOW()),
    (UUID_TO_BIN('f0000005-0000-0000-0000-000000000007'), @judy,  @grace, 'ACCEPTED', NOW(), NOW()),
    (UUID_TO_BIN('f0000005-0000-0000-0000-000000000008'), @judy,  @heidi, 'ACCEPTED', NOW(), NOW()),
    (UUID_TO_BIN('f0000005-0000-0000-0000-000000000009'), @alice, @grace, 'ACCEPTED', NOW(), NOW()),
    (UUID_TO_BIN('f0000005-0000-0000-0000-000000000010'), @bob,   @grace, 'ACCEPTED', NOW(), NOW());

-- =====================================================
-- ARCHIVED POSTS
-- =====================================================
SET @p40 = UUID_TO_BIN('aa000040-0000-0000-0000-000000000001');
SET @p41 = UUID_TO_BIN('aa000040-0000-0000-0000-000000000002');

INSERT INTO post (id, user_id, caption, type, is_archived, created_at, updated_at) VALUES
    (@p40, @alice, 'This is an old memory from 2022. Archived.', 'POST', 1, DATE_SUB(NOW(), INTERVAL 2 YEAR), DATE_SUB(NOW(), INTERVAL 2 YEAR)),
    (@p41, @bob,   'Archived food experiment 🧪', 'POST', 1, DATE_SUB(NOW(), INTERVAL 1 YEAR), DATE_SUB(NOW(), INTERVAL 1 YEAR));

INSERT INTO post_media (id, post_id, url, media_type, display_order, created_at, updated_at) VALUES
    (UUID_TO_BIN('bb000040-0000-0000-0000-000000000001'), @p40, 'https://picsum.photos/seed/old_mem/1080/1080', 'IMAGE', 0, NOW(), NOW()),
    (UUID_TO_BIN('bb000040-0000-0000-0000-000000000002'), @p41, 'https://picsum.photos/seed/food_exp/1080/1080', 'IMAGE', 0, NOW(), NOW());

-- =====================================================
-- ARCHIVED STORIES
-- =====================================================
SET @st10 = UUID_TO_BIN('00000020-0000-0000-0000-000000000010');
SET @st11 = UUID_TO_BIN('00000020-0000-0000-0000-000000000011');

INSERT INTO story (id, user_id, media_url, media_type, expires_at, is_archived, created_at, updated_at) VALUES
    (@st10, @alice, 'https://picsum.photos/seed/st_arch1/1080/1920', 'IMAGE', DATE_SUB(NOW(), INTERVAL 2 DAY), 1, DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),
    (@st11, @bob,   'https://picsum.photos/seed/st_arch2/1080/1920', 'IMAGE', DATE_SUB(NOW(), INTERVAL 5 DAY), 1, DATE_SUB(NOW(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY));

-- =====================================================
-- BLOCKED USERS
-- =====================================================
INSERT INTO block (id, blocker_id, blocked_id, created_at, updated_at) VALUES
    (UUID_TO_BIN('00000070-0000-0000-0000-000000000002'), @alice, @troll, NOW(), NOW()),
    (UUID_TO_BIN('00000070-0000-0000-0000-000000000003'), @bob,   @troll, NOW(), NOW()),
    (UUID_TO_BIN('00000070-0000-0000-0000-000000000004'), @carol, @troll, NOW(), NOW());

-- =====================================================
-- MORE COMMENTS
-- =====================================================
SET @p10 = UUID_TO_BIN('aa000010-0000-0000-0000-000000000001'); -- Alice sunset post from V4
SET @p13 = UUID_TO_BIN('aa000013-0000-0000-0000-000000000001'); -- Bob sushi post from V4

INSERT INTO comment (id, post_id, user_id, content, created_at, updated_at) VALUES
    (UUID_TO_BIN('dd000002-0000-0000-0000-000000000001'), @p10, @grace, 'Love the colors here! 🌈', NOW(), NOW()),
    (UUID_TO_BIN('dd000002-0000-0000-0000-000000000002'), @p10, @heidi, 'So aesthetic ✨', NOW(), NOW()),
    (UUID_TO_BIN('dd000002-0000-0000-0000-000000000003'), @p13, @ivan,  'Sushi looks fresh! 🍣', NOW(), NOW()),
    (UUID_TO_BIN('dd000002-0000-0000-0000-000000000004'), @p13, @judy,  'Invite me next time! 😋', NOW(), NOW());

-- =====================================================
-- MORE NOTIFICATIONS
-- =====================================================
INSERT INTO notification (id, recipient_id, actor_id, type, post_id, comment_id, is_read, created_at, updated_at) VALUES
    -- grace liked alice's post p10
    (UUID_TO_BIN('00000040-0000-0000-0000-000000000010'), @alice, @grace, 'LIKE', @p10, NULL, 0, NOW(), NOW()),
    -- heidi followed alice
    (UUID_TO_BIN('00000040-0000-0000-0000-000000000011'), @alice, @heidi, 'FOLLOW', NULL, NULL, 0, NOW(), NOW()),
    -- ivan commented on bob's post p13
    (UUID_TO_BIN('00000040-0000-0000-0000-000000000012'), @bob,   @ivan,  'COMMENT', @p13, UUID_TO_BIN('dd000002-0000-0000-0000-000000000003'), 0, NOW(), NOW()),
    -- judy followed bob
    (UUID_TO_BIN('00000040-0000-0000-0000-000000000013'), @bob,   @judy,  'FOLLOW', NULL, NULL, 0, NOW(), NOW());
