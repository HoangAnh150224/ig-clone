-- V7__alice_more_data.sql
-- More seed data for Alice: archived stories, blocked users, favourite posts & users
-- =====================================================

SET @alice = UUID_TO_BIN('11111111-1111-1111-1111-111111111111');
SET @bob   = UUID_TO_BIN('22222222-2222-2222-2222-222222222222');
SET @carol = UUID_TO_BIN('33333333-3333-3333-3333-333333333333');
SET @ivan  = UUID_TO_BIN('99999999-9999-9999-9999-999999999999');
SET @kyle  = UUID_TO_BIN('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
SET @heidi = UUID_TO_BIN('88888888-8888-8888-8888-888888888888');

-- Posts from V3 / V4 used as favourites
SET @p4  = UUID_TO_BIN('b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1'); -- bob IMAGE
SET @p6  = UUID_TO_BIN('c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1'); -- carol IMAGE
SET @p7  = UUID_TO_BIN('e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e1e1'); -- eve IMAGE
SET @p13 = UUID_TO_BIN('aa000013-0000-0000-0000-000000000001'); -- bob sushi
SET @p16 = UUID_TO_BIN('aa000016-0000-0000-0000-000000000001'); -- carol lake reflection
SET @p17 = UUID_TO_BIN('aa000017-0000-0000-0000-000000000001'); -- carol trail running reel

-- =====================================================
-- ARCHIVED STORIES (Alice — 2 more on top of V5's st10)
-- =====================================================
INSERT INTO story (id, user_id, media_url, media_type, expires_at, is_archived, created_at, updated_at) VALUES
    (UUID_TO_BIN('00000020-0000-0000-0000-000000000012'), @alice,
     'https://picsum.photos/seed/st_arch3/1080/1920', 'IMAGE',
     DATE_SUB(NOW(), INTERVAL 4 DAY), 1,
     DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),

    (UUID_TO_BIN('00000020-0000-0000-0000-000000000013'), @alice,
     'https://picsum.photos/seed/st_arch4/1080/1920', 'VIDEO',
     DATE_SUB(NOW(), INTERVAL 8 DAY), 1,
     DATE_SUB(NOW(), INTERVAL 9 DAY), DATE_SUB(NOW(), INTERVAL 9 DAY));

-- =====================================================
-- BLOCKED USERS (Alice blocks ivan and kyle)
-- (Alice already blocks troll in V5)
-- =====================================================
INSERT INTO block (id, blocker_id, blocked_id, created_at, updated_at) VALUES
    (UUID_TO_BIN('00000070-0000-0000-0000-000000000010'), @alice, @ivan,  NOW(), NOW()),
    (UUID_TO_BIN('00000070-0000-0000-0000-000000000011'), @alice, @kyle,  NOW(), NOW());

-- =====================================================
-- FAVOURITE POSTS (Alice favourites bob's and carol's posts)
-- =====================================================
INSERT INTO favorite_post (id, user_id, post_id, created_at, updated_at) VALUES
    (UUID_TO_BIN('00000080-0000-0000-0000-000000000001'), @alice, @p4,  NOW(), NOW()),
    (UUID_TO_BIN('00000080-0000-0000-0000-000000000002'), @alice, @p6,  NOW(), NOW()),
    (UUID_TO_BIN('00000080-0000-0000-0000-000000000003'), @alice, @p7,  NOW(), NOW()),
    (UUID_TO_BIN('00000080-0000-0000-0000-000000000004'), @alice, @p13, NOW(), NOW()),
    (UUID_TO_BIN('00000080-0000-0000-0000-000000000005'), @alice, @p16, NOW(), NOW()),
    (UUID_TO_BIN('00000080-0000-0000-0000-000000000006'), @alice, @p17, NOW(), NOW());

-- =====================================================
-- FAVOURITE USERS (Alice adds heidi — bob & carol already added in V3)
-- =====================================================
INSERT INTO favorite_user (id, user_id, favorite_id, created_at, updated_at) VALUES
    (UUID_TO_BIN('00000090-0000-0000-0000-000000000001'), @alice, @heidi, NOW(), NOW());
