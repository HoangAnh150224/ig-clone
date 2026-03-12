-- V3__seed_data.sql
-- Seed data for development & testing
-- All users share password: password  (BCrypt strength 10)
-- =====================================================

-- =====================================================
-- USER IDs
-- =====================================================
SET @alice = UUID_TO_BIN('11111111-1111-1111-1111-111111111111');
SET @bob   = UUID_TO_BIN('22222222-2222-2222-2222-222222222222');
SET @carol = UUID_TO_BIN('33333333-3333-3333-3333-333333333333');
SET @dave  = UUID_TO_BIN('44444444-4444-4444-4444-444444444444');
SET @eve   = UUID_TO_BIN('55555555-5555-5555-5555-555555555555');
SET @frank = UUID_TO_BIN('66666666-6666-6666-6666-666666666666');

-- =====================================================
-- POST IDs
-- =====================================================
SET @p1 = UUID_TO_BIN('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1'); -- alice IMAGE
SET @p2 = UUID_TO_BIN('a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a2a2'); -- alice IMAGE carousel
SET @p3 = UUID_TO_BIN('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a3a3'); -- alice REEL
SET @p4 = UUID_TO_BIN('b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1'); -- bob IMAGE
SET @p5 = UUID_TO_BIN('b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2'); -- bob ARCHIVED
SET @p6 = UUID_TO_BIN('c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1'); -- carol IMAGE
SET @p7 = UUID_TO_BIN('e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e1e1'); -- eve IMAGE
SET @p8 = UUID_TO_BIN('e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e2e2'); -- eve REEL
SET @p9 = UUID_TO_BIN('f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f1f1'); -- frank IMAGE

-- =====================================================
-- STORY IDs
-- =====================================================
SET @st1 = UUID_TO_BIN('00000020-0000-0000-0000-000000000001'); -- alice story 1 (active)
SET @st2 = UUID_TO_BIN('00000020-0000-0000-0000-000000000002'); -- alice story 2 (active)
SET @st3 = UUID_TO_BIN('00000020-0000-0000-0000-000000000003'); -- bob story (active)
SET @st4 = UUID_TO_BIN('00000020-0000-0000-0000-000000000004'); -- carol story (expired)

-- =====================================================
-- HIGHLIGHT IDs
-- =====================================================
SET @hl1 = UUID_TO_BIN('00000022-0000-0000-0000-000000000001'); -- alice: Travel
SET @hl2 = UUID_TO_BIN('00000022-0000-0000-0000-000000000002'); -- alice: Food

-- =====================================================
-- HASHTAG IDs
-- =====================================================
SET @h_photo   = UUID_TO_BIN('00000030-0000-0000-0000-000000000001');
SET @h_travel  = UUID_TO_BIN('00000030-0000-0000-0000-000000000002');
SET @h_nature  = UUID_TO_BIN('00000030-0000-0000-0000-000000000003');
SET @h_food    = UUID_TO_BIN('00000030-0000-0000-0000-000000000004');
SET @h_fitness = UUID_TO_BIN('00000030-0000-0000-0000-000000000005');

-- =====================================================
-- CONVERSATION IDs
-- =====================================================
SET @conv1 = UUID_TO_BIN('00000030-0000-0000-0000-000000000010');

-- =====================================================
-- USERS  (password = 'password' for all)
-- =====================================================
INSERT INTO user_profile (id, username, email, full_name, bio, avatar_url, password_hash, role,
                          website, is_verified, is_private, is_active, show_activity_status,
                          tag_permission, notifications_paused, created_at, updated_at)
VALUES
    (@alice, 'alice', 'alice@example.com', 'Alice Johnson',
     'Photographer & traveler ✈️ | Capturing moments 📷',
     'https://i.pravatar.cc/150?img=1',
     '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG',
     'USER', 'https://alice.photography', 1, 0, 1, 1, 'EVERYONE', 0,
     DATE_SUB(NOW(), INTERVAL 6 MONTH), DATE_SUB(NOW(), INTERVAL 6 MONTH)),

    (@bob, 'bob', 'bob@example.com', 'Bob Smith',
     'Foodie & home chef 🍕 | NYC based',
     'https://i.pravatar.cc/150?img=2',
     '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG',
     'USER', NULL, 1, 0, 1, 1, 'EVERYONE', 0,
     DATE_SUB(NOW(), INTERVAL 5 MONTH), DATE_SUB(NOW(), INTERVAL 5 MONTH)),

    (@carol, 'carol', 'carol@example.com', 'Carol White',
     'Nature lover 🌿 | Hiker | Coffee addict ☕',
     'https://i.pravatar.cc/150?img=5',
     '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG',
     'USER', 'https://carol.hikes.com', 0, 0, 1, 1, 'FOLLOWERS', 0,
     DATE_SUB(NOW(), INTERVAL 4 MONTH), DATE_SUB(NOW(), INTERVAL 4 MONTH)),

    (@dave, 'dave', 'dave@example.com', 'Dave Brown',
     'Private account 🔒',
     'https://i.pravatar.cc/150?img=8',
     '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG',
     'USER', NULL, 0, 1, 1, 0, 'FOLLOWERS', 0,
     DATE_SUB(NOW(), INTERVAL 3 MONTH), DATE_SUB(NOW(), INTERVAL 3 MONTH)),

    (@eve, 'eve', 'eve@example.com', 'Eve Martinez',
     'Fitness coach 💪 | Yoga | Mindfulness',
     'https://i.pravatar.cc/150?img=9',
     '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG',
     'USER', 'https://evefitness.com', 1, 0, 1, 1, 'EVERYONE', 0,
     DATE_SUB(NOW(), INTERVAL 2 MONTH), DATE_SUB(NOW(), INTERVAL 2 MONTH)),

    (@frank, 'frank', 'frank@example.com', 'Frank Lee',
     'Just vibing 🎸',
     'https://i.pravatar.cc/150?img=11',
     '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG',
     'USER', NULL, 0, 0, 1, 1, 'EVERYONE', 0,
     DATE_SUB(NOW(), INTERVAL 1 MONTH), DATE_SUB(NOW(), INTERVAL 1 MONTH));

-- =====================================================
-- FOLLOWS
-- =====================================================
INSERT INTO follow (id, follower_id, following_id, status, created_at, updated_at) VALUES
    (UUID_TO_BIN('f0000001-0000-0000-0000-000000000001'), @alice, @bob,   'ACCEPTED', DATE_SUB(NOW(), INTERVAL 5 MONTH), DATE_SUB(NOW(), INTERVAL 5 MONTH)),
    (UUID_TO_BIN('f0000001-0000-0000-0000-000000000002'), @alice, @carol, 'ACCEPTED', DATE_SUB(NOW(), INTERVAL 4 MONTH), DATE_SUB(NOW(), INTERVAL 4 MONTH)),
    (UUID_TO_BIN('f0000001-0000-0000-0000-000000000003'), @alice, @eve,   'ACCEPTED', DATE_SUB(NOW(), INTERVAL 2 MONTH), DATE_SUB(NOW(), INTERVAL 2 MONTH)),
    (UUID_TO_BIN('f0000001-0000-0000-0000-000000000004'), @bob,   @alice, 'ACCEPTED', DATE_SUB(NOW(), INTERVAL 5 MONTH), DATE_SUB(NOW(), INTERVAL 5 MONTH)),
    (UUID_TO_BIN('f0000001-0000-0000-0000-000000000005'), @bob,   @carol, 'ACCEPTED', DATE_SUB(NOW(), INTERVAL 3 MONTH), DATE_SUB(NOW(), INTERVAL 3 MONTH)),
    (UUID_TO_BIN('f0000001-0000-0000-0000-000000000006'), @carol, @alice, 'ACCEPTED', DATE_SUB(NOW(), INTERVAL 4 MONTH), DATE_SUB(NOW(), INTERVAL 4 MONTH)),
    (UUID_TO_BIN('f0000001-0000-0000-0000-000000000007'), @eve,   @alice, 'ACCEPTED', DATE_SUB(NOW(), INTERVAL 2 MONTH), DATE_SUB(NOW(), INTERVAL 2 MONTH)),
    (UUID_TO_BIN('f0000001-0000-0000-0000-000000000008'), @frank, @alice, 'ACCEPTED', DATE_SUB(NOW(), INTERVAL 3 WEEK),  DATE_SUB(NOW(), INTERVAL 3 WEEK)),
    -- dave has private account; bob's follow request is PENDING
    (UUID_TO_BIN('f0000001-0000-0000-0000-000000000009'), @bob,   @dave,  'PENDING',  DATE_SUB(NOW(), INTERVAL 1 WEEK),  DATE_SUB(NOW(), INTERVAL 1 WEEK));

-- =====================================================
-- POSTS
-- =====================================================
INSERT INTO post (id, user_id, caption, type, music, location_name,
                  is_archived, comments_disabled, hide_like_count, share_count, created_at, updated_at) VALUES
    (@p1, @alice, 'Golden hour in the mountains 🏔️ #photography #travel #nature',
     'POST', NULL, 'Rocky Mountain National Park', 0, 0, 0, 3,
     DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),

    (@p2, @alice, 'Streets of Tokyo 🗼 Double exposure carousel — swipe ➡️ #travel #photography',
     'POST', NULL, 'Tokyo, Japan', 0, 0, 0, 7,
     DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY)),

    (@p3, @alice, 'Morning yoga flow 🌅 #fitness #nature',
     'REEL', 'Sunrise Melodies - Lo-fi Beats', 'Malibu Beach', 0, 0, 0, 12,
     DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),

    (@p4, @bob, 'Homemade carbonara 🍝 Recipe in bio! #food',
     'POST', NULL, 'Brooklyn, NY', 0, 0, 0, 2,
     DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),

    (@p5, @bob, 'Draft post — not ready yet',
     'POST', NULL, NULL, 1, 0, 0, 0,
     DATE_SUB(NOW(), INTERVAL 14 DAY), DATE_SUB(NOW(), INTERVAL 14 DAY)),

    (@p6, @carol, 'Early morning hike ⛰️ Worth every step #nature #travel',
     'POST', NULL, 'Appalachian Trail', 0, 0, 0, 5,
     DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),

    (@p7, @eve, 'Rest day is important too 🧘‍♀️ Listen to your body #fitness',
     'POST', NULL, NULL, 0, 0, 0, 1,
     DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),

    (@p8, @eve, '30-day plank challenge — Day 15 💪 #fitness',
     'REEL', 'Eye of the Tiger - Survivor', NULL, 0, 0, 1, 20,
     DATE_SUB(NOW(), INTERVAL 6 HOUR), DATE_SUB(NOW(), INTERVAL 6 HOUR)),

    (@p9, @frank, 'Just my cat doing cat things 🐱',
     'POST', NULL, NULL, 0, 1, 0, 0,
     DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY));

-- =====================================================
-- POST MEDIA
-- =====================================================
INSERT INTO post_media (id, post_id, url, media_type, display_order, created_at, updated_at) VALUES
    -- p1: single landscape photo
    (UUID_TO_BIN('00000001-0000-0000-0000-000000000001'), @p1,
     'https://picsum.photos/seed/mountains1/1080/1080', 'IMAGE', 0, NOW(), NOW()),

    -- p2: carousel (2 images)
    (UUID_TO_BIN('00000001-0000-0000-0000-000000000002'), @p2,
     'https://picsum.photos/seed/tokyo1/1080/1080', 'IMAGE', 0, NOW(), NOW()),
    (UUID_TO_BIN('00000001-0000-0000-0000-000000000003'), @p2,
     'https://picsum.photos/seed/tokyo2/1080/1080', 'IMAGE', 1, NOW(), NOW()),

    -- p3: reel video
    (UUID_TO_BIN('00000001-0000-0000-0000-000000000004'), @p3,
     'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', 'VIDEO', 0, NOW(), NOW()),

    -- p4: food photo
    (UUID_TO_BIN('00000001-0000-0000-0000-000000000005'), @p4,
     'https://picsum.photos/seed/pasta1/1080/1080', 'IMAGE', 0, NOW(), NOW()),

    -- p5: archived draft
    (UUID_TO_BIN('00000001-0000-0000-0000-000000000006'), @p5,
     'https://picsum.photos/seed/draft1/1080/1080', 'IMAGE', 0, NOW(), NOW()),

    -- p6: hike photo
    (UUID_TO_BIN('00000001-0000-0000-0000-000000000007'), @p6,
     'https://picsum.photos/seed/hike1/1080/1080', 'IMAGE', 0, NOW(), NOW()),

    -- p7: yoga photo
    (UUID_TO_BIN('00000001-0000-0000-0000-000000000008'), @p7,
     'https://picsum.photos/seed/yoga1/1080/1080', 'IMAGE', 0, NOW(), NOW()),

    -- p8: reel video (hide_like_count = 1)
    (UUID_TO_BIN('00000001-0000-0000-0000-000000000009'), @p8,
     'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', 'VIDEO', 0, NOW(), NOW()),

    -- p9: cat photo
    (UUID_TO_BIN('00000001-0000-0000-0000-000000000010'), @p9,
     'https://picsum.photos/seed/cat1/1080/1080', 'IMAGE', 0, NOW(), NOW());

-- =====================================================
-- HASHTAGS
-- =====================================================
INSERT INTO hashtag (id, name, created_at, updated_at) VALUES
    (@h_photo,   'photography', NOW(), NOW()),
    (@h_travel,  'travel',      NOW(), NOW()),
    (@h_nature,  'nature',      NOW(), NOW()),
    (@h_food,    'food',        NOW(), NOW()),
    (@h_fitness, 'fitness',     NOW(), NOW());

-- =====================================================
-- POST_HASHTAG
-- =====================================================
INSERT INTO post_hashtag (post_id, hashtag_id) VALUES
    (@p1, @h_photo),
    (@p1, @h_travel),
    (@p1, @h_nature),
    (@p2, @h_travel),
    (@p2, @h_photo),
    (@p3, @h_fitness),
    (@p3, @h_nature),
    (@p4, @h_food),
    (@p6, @h_nature),
    (@p6, @h_travel),
    (@p7, @h_fitness),
    (@p8, @h_fitness);

-- =====================================================
-- POST TAGS (users tagged in posts)
-- =====================================================
INSERT INTO post_tag (id, post_id, tagged_user_id, created_at, updated_at) VALUES
    -- bob is tagged in alice's post p1
    (UUID_TO_BIN('00000060-0000-0000-0000-000000000001'), @p1, @bob, NOW(), NOW()),
    -- carol is tagged in alice's post p2
    (UUID_TO_BIN('00000060-0000-0000-0000-000000000002'), @p2, @carol, NOW(), NOW());

-- =====================================================
-- POST LIKES
-- =====================================================
INSERT INTO post_like (id, post_id, user_id, created_at, updated_at) VALUES
    (UUID_TO_BIN('00000010-0000-0000-0000-000000000001'), @p1, @bob,   DATE_SUB(NOW(), INTERVAL 2 DAY),  DATE_SUB(NOW(), INTERVAL 2 DAY)),
    (UUID_TO_BIN('00000010-0000-0000-0000-000000000002'), @p1, @carol, DATE_SUB(NOW(), INTERVAL 1 DAY),  DATE_SUB(NOW(), INTERVAL 1 DAY)),
    (UUID_TO_BIN('00000010-0000-0000-0000-000000000003'), @p1, @eve,   DATE_SUB(NOW(), INTERVAL 12 HOUR),DATE_SUB(NOW(), INTERVAL 12 HOUR)),
    (UUID_TO_BIN('00000010-0000-0000-0000-000000000004'), @p1, @frank, DATE_SUB(NOW(), INTERVAL 6 HOUR), DATE_SUB(NOW(), INTERVAL 6 HOUR)),
    (UUID_TO_BIN('00000010-0000-0000-0000-000000000005'), @p4, @alice, DATE_SUB(NOW(), INTERVAL 3 DAY),  DATE_SUB(NOW(), INTERVAL 3 DAY)),
    (UUID_TO_BIN('00000010-0000-0000-0000-000000000006'), @p4, @carol, DATE_SUB(NOW(), INTERVAL 3 DAY),  DATE_SUB(NOW(), INTERVAL 3 DAY)),
    (UUID_TO_BIN('00000010-0000-0000-0000-000000000007'), @p6, @alice, DATE_SUB(NOW(), INTERVAL 4 DAY),  DATE_SUB(NOW(), INTERVAL 4 DAY)),
    (UUID_TO_BIN('00000010-0000-0000-0000-000000000008'), @p6, @bob,   DATE_SUB(NOW(), INTERVAL 4 DAY),  DATE_SUB(NOW(), INTERVAL 4 DAY)),
    (UUID_TO_BIN('00000010-0000-0000-0000-000000000009'), @p7, @bob,   DATE_SUB(NOW(), INTERVAL 20 HOUR),DATE_SUB(NOW(), INTERVAL 20 HOUR)),
    (UUID_TO_BIN('00000010-0000-0000-0000-000000000010'), @p8, @alice, DATE_SUB(NOW(), INTERVAL 5 HOUR), DATE_SUB(NOW(), INTERVAL 5 HOUR)),
    (UUID_TO_BIN('00000010-0000-0000-0000-000000000011'), @p8, @bob,   DATE_SUB(NOW(), INTERVAL 4 HOUR), DATE_SUB(NOW(), INTERVAL 4 HOUR));

-- =====================================================
-- POST VIEWS
-- =====================================================
INSERT INTO post_view (id, post_id, viewer_id, created_at, updated_at) VALUES
    (UUID_TO_BIN('00000011-0000-0000-0000-000000000001'), @p1, @bob,   DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),
    (UUID_TO_BIN('00000011-0000-0000-0000-000000000002'), @p1, @carol, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
    (UUID_TO_BIN('00000011-0000-0000-0000-000000000003'), @p1, @eve,   DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
    (UUID_TO_BIN('00000011-0000-0000-0000-000000000004'), @p3, @bob,   DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
    (UUID_TO_BIN('00000011-0000-0000-0000-000000000005'), @p3, @carol, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
    (UUID_TO_BIN('00000011-0000-0000-0000-000000000006'), @p4, @alice, DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),
    (UUID_TO_BIN('00000011-0000-0000-0000-000000000007'), @p8, @alice, DATE_SUB(NOW(), INTERVAL 5 HOUR),DATE_SUB(NOW(), INTERVAL 5 HOUR)),
    (UUID_TO_BIN('00000011-0000-0000-0000-000000000008'), @p8, @bob,   DATE_SUB(NOW(), INTERVAL 4 HOUR),DATE_SUB(NOW(), INTERVAL 4 HOUR));

-- =====================================================
-- SAVED POSTS
-- =====================================================
INSERT INTO saved_post (id, user_id, post_id, created_at, updated_at) VALUES
    (UUID_TO_BIN('00000012-0000-0000-0000-000000000001'), @bob,   @p1, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
    (UUID_TO_BIN('00000012-0000-0000-0000-000000000002'), @alice, @p7, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
    (UUID_TO_BIN('00000012-0000-0000-0000-000000000003'), @alice, @p4, DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY));

-- =====================================================
-- COMMENTS
-- =====================================================
SET @cm1 = UUID_TO_BIN('00000013-0000-0000-0000-000000000001');
SET @cm2 = UUID_TO_BIN('00000013-0000-0000-0000-000000000002');
SET @cm3 = UUID_TO_BIN('00000013-0000-0000-0000-000000000003');
SET @cm4 = UUID_TO_BIN('00000013-0000-0000-0000-000000000004');
SET @cm5 = UUID_TO_BIN('00000013-0000-0000-0000-000000000005');

INSERT INTO comment (id, post_id, user_id, content, parent_comment_id, is_pinned, created_at, updated_at) VALUES
    -- top-level comments on p1
    (@cm1, @p1, @bob,   'Absolutely stunning shot! 😍 What camera do you use?', NULL, 1, DATE_SUB(NOW(), INTERVAL 2 DAY),  DATE_SUB(NOW(), INTERVAL 2 DAY)),
    (@cm2, @p1, @carol, 'I hiked there last summer! Amazing place 🏔️',           NULL, 0, DATE_SUB(NOW(), INTERVAL 1 DAY),  DATE_SUB(NOW(), INTERVAL 1 DAY)),
    (@cm3, @p1, @eve,   'The lighting is perfect ✨',                             NULL, 0, DATE_SUB(NOW(), INTERVAL 12 HOUR),DATE_SUB(NOW(), INTERVAL 12 HOUR)),
    -- replies to cm1
    (@cm4, @p1, @alice, 'Thanks Bob! 📷 I use a Sony A7IV', @cm1, 0, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
    (@cm5, @p1, @frank, 'Great camera choice!', @cm1, 0, DATE_SUB(NOW(), INTERVAL 20 HOUR), DATE_SUB(NOW(), INTERVAL 20 HOUR)),
    -- comment on p4
    (UUID_TO_BIN('00000013-0000-0000-0000-000000000006'), @p4, @alice, 'That looks SO good 🤤 Saving this recipe!', NULL, 0, DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),
    -- comment on p7
    (UUID_TO_BIN('00000013-0000-0000-0000-000000000007'), @p7, @alice, 'So true! Recovery is everything 🙏',         NULL, 0, DATE_SUB(NOW(), INTERVAL 22 HOUR),DATE_SUB(NOW(), INTERVAL 22 HOUR));

-- =====================================================
-- COMMENT LIKES
-- =====================================================
INSERT INTO comment_like (id, comment_id, user_id, created_at, updated_at) VALUES
    (UUID_TO_BIN('00000014-0000-0000-0000-000000000001'), @cm1, @alice, DATE_SUB(NOW(), INTERVAL 1 DAY),  DATE_SUB(NOW(), INTERVAL 1 DAY)),
    (UUID_TO_BIN('00000014-0000-0000-0000-000000000002'), @cm1, @carol, DATE_SUB(NOW(), INTERVAL 1 DAY),  DATE_SUB(NOW(), INTERVAL 1 DAY)),
    (UUID_TO_BIN('00000014-0000-0000-0000-000000000003'), @cm2, @alice, DATE_SUB(NOW(), INTERVAL 12 HOUR),DATE_SUB(NOW(), INTERVAL 12 HOUR)),
    (UUID_TO_BIN('00000014-0000-0000-0000-000000000004'), @cm3, @bob,   DATE_SUB(NOW(), INTERVAL 10 HOUR),DATE_SUB(NOW(), INTERVAL 10 HOUR));

-- =====================================================
-- STORIES
-- =====================================================
INSERT INTO story (id, user_id, media_url, media_type, expires_at,
                   is_close_friends, is_archived, created_at, updated_at) VALUES
    -- alice: 2 active stories
    (@st1, @alice, 'https://picsum.photos/seed/st_alice1/1080/1920', 'IMAGE',
     DATE_ADD(NOW(), INTERVAL 20 HOUR), 0, 0, DATE_SUB(NOW(), INTERVAL 4 HOUR), DATE_SUB(NOW(), INTERVAL 4 HOUR)),
    (@st2, @alice, 'https://picsum.photos/seed/st_alice2/1080/1920', 'IMAGE',
     DATE_ADD(NOW(), INTERVAL 22 HOUR), 0, 0, DATE_SUB(NOW(), INTERVAL 2 HOUR), DATE_SUB(NOW(), INTERVAL 2 HOUR)),
    -- bob: 1 active story
    (@st3, @bob, 'https://picsum.photos/seed/st_bob1/1080/1920', 'IMAGE',
     DATE_ADD(NOW(), INTERVAL 23 HOUR), 0, 0, DATE_SUB(NOW(), INTERVAL 1 HOUR), DATE_SUB(NOW(), INTERVAL 1 HOUR)),
    -- carol: 1 expired story (for testing edge cases — must NOT appear in feed)
    (@st4, @carol, 'https://picsum.photos/seed/st_carol1/1080/1920', 'IMAGE',
     DATE_SUB(NOW(), INTERVAL 1 HOUR), 0, 0, DATE_SUB(NOW(), INTERVAL 25 HOUR), DATE_SUB(NOW(), INTERVAL 25 HOUR));

-- =====================================================
-- STORY VIEWS
-- =====================================================
INSERT INTO story_view (id, story_id, viewer_id, liked, created_at, updated_at) VALUES
    -- bob has seen alice's first story (st1) but NOT st2
    (UUID_TO_BIN('00000021-0000-0000-0000-000000000001'), @st1, @bob,   1, DATE_SUB(NOW(), INTERVAL 3 HOUR), DATE_SUB(NOW(), INTERVAL 3 HOUR)),
    -- carol has seen both of alice's stories
    (UUID_TO_BIN('00000021-0000-0000-0000-000000000002'), @st1, @carol, 0, DATE_SUB(NOW(), INTERVAL 3 HOUR), DATE_SUB(NOW(), INTERVAL 3 HOUR)),
    (UUID_TO_BIN('00000021-0000-0000-0000-000000000003'), @st2, @carol, 0, DATE_SUB(NOW(), INTERVAL 1 HOUR), DATE_SUB(NOW(), INTERVAL 1 HOUR));
-- Result: when alice logs in → bob hasUnseenStory=true (hasn't seen st2), carol hasUnseenStory=false

-- =====================================================
-- HIGHLIGHTS
-- =====================================================
INSERT INTO highlight (id, user_id, title, cover_url, created_at, updated_at) VALUES
    (@hl1, @alice, 'Travel', 'https://picsum.photos/seed/hl_travel/400/400', DATE_SUB(NOW(), INTERVAL 3 MONTH), DATE_SUB(NOW(), INTERVAL 3 MONTH)),
    (@hl2, @alice, 'Nature', 'https://picsum.photos/seed/hl_nature/400/400', DATE_SUB(NOW(), INTERVAL 2 MONTH), DATE_SUB(NOW(), INTERVAL 2 MONTH));

-- Archived stories can be added to highlights (st1/st2 are still active but usable)
INSERT INTO highlight_story (highlight_id, story_id) VALUES
    (@hl1, @st1),
    (@hl2, @st2);

-- =====================================================
-- BLOCK  (alice blocks frank — so frank can't see alice's posts)
-- =====================================================
INSERT INTO block (id, blocker_id, blocked_id, created_at, updated_at) VALUES
    (UUID_TO_BIN('00000070-0000-0000-0000-000000000001'), @alice, @frank,
     DATE_SUB(NOW(), INTERVAL 1 WEEK), DATE_SUB(NOW(), INTERVAL 1 WEEK));

-- =====================================================
-- CONVERSATION + MESSAGES  (alice ↔ bob)
-- =====================================================
INSERT INTO conversation (id, created_at, updated_at) VALUES
    (@conv1, DATE_SUB(NOW(), INTERVAL 2 DAY), NOW());

INSERT INTO conversation_participant (id, conversation_id, user_id, is_accepted, last_read_at, created_at, updated_at) VALUES
    (UUID_TO_BIN('00000031-0000-0000-0000-000000000001'), @conv1, @alice, 1, NOW(),                            NOW(), NOW()),
    (UUID_TO_BIN('00000031-0000-0000-0000-000000000002'), @conv1, @bob,   1, DATE_SUB(NOW(), INTERVAL 1 HOUR), NOW(), NOW());

INSERT INTO message (id, conversation_id, sender_id, content, is_deleted, created_at, updated_at) VALUES
    (UUID_TO_BIN('00000032-0000-0000-0000-000000000001'), @conv1, @alice, 'Hey Bob! Love your carbonara post 🍝', 0, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
    (UUID_TO_BIN('00000032-0000-0000-0000-000000000002'), @conv1, @bob,   'Thanks Alice! Ill share the full recipe soon 😄',   0, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
    (UUID_TO_BIN('00000032-0000-0000-0000-000000000003'), @conv1, @alice, 'Please do! Also loved your story today',             0, DATE_SUB(NOW(), INTERVAL 1 HOUR),DATE_SUB(NOW(), INTERVAL 1 HOUR));

-- =====================================================
-- NOTIFICATIONS
-- =====================================================
INSERT INTO notification (id, recipient_id, actor_id, type, post_id, comment_id, is_read, created_at, updated_at) VALUES
    -- bob liked alice's post
    (UUID_TO_BIN('00000040-0000-0000-0000-000000000001'), @alice, @bob,   'LIKE',    @p1,   NULL, 0, DATE_SUB(NOW(), INTERVAL 2 DAY),  DATE_SUB(NOW(), INTERVAL 2 DAY)),
    -- carol liked alice's post
    (UUID_TO_BIN('00000040-0000-0000-0000-000000000002'), @alice, @carol, 'LIKE',    @p1,   NULL, 0, DATE_SUB(NOW(), INTERVAL 1 DAY),  DATE_SUB(NOW(), INTERVAL 1 DAY)),
    -- frank followed alice
    (UUID_TO_BIN('00000040-0000-0000-0000-000000000003'), @alice, @frank, 'FOLLOW',  NULL,  NULL, 1, DATE_SUB(NOW(), INTERVAL 3 WEEK), DATE_SUB(NOW(), INTERVAL 3 WEEK)),
    -- bob commented on alice's post
    (UUID_TO_BIN('00000040-0000-0000-0000-000000000004'), @alice, @bob,   'COMMENT', @p1,   @cm1, 0, DATE_SUB(NOW(), INTERVAL 2 DAY),  DATE_SUB(NOW(), INTERVAL 2 DAY)),
    -- alice liked bob's post
    (UUID_TO_BIN('00000040-0000-0000-0000-000000000005'), @bob,   @alice, 'LIKE',    @p4,   NULL, 0, DATE_SUB(NOW(), INTERVAL 3 DAY),  DATE_SUB(NOW(), INTERVAL 3 DAY));

-- =====================================================
-- SEARCH HISTORY
-- =====================================================
INSERT INTO search_history (id, user_id, searched_user_id, hashtag_id, created_at, updated_at) VALUES
    (UUID_TO_BIN('00000050-0000-0000-0000-000000000001'), @alice, @bob,   NULL,     DATE_SUB(NOW(), INTERVAL 1 DAY),  DATE_SUB(NOW(), INTERVAL 1 DAY)),
    (UUID_TO_BIN('00000050-0000-0000-0000-000000000002'), @alice, @carol, NULL,     DATE_SUB(NOW(), INTERVAL 5 DAY),  DATE_SUB(NOW(), INTERVAL 5 DAY)),
    (UUID_TO_BIN('00000050-0000-0000-0000-000000000003'), @alice, NULL,   @h_photo, DATE_SUB(NOW(), INTERVAL 3 DAY),  DATE_SUB(NOW(), INTERVAL 3 DAY)),
    (UUID_TO_BIN('00000050-0000-0000-0000-000000000004'), @bob,   @alice, NULL,     DATE_SUB(NOW(), INTERVAL 2 DAY),  DATE_SUB(NOW(), INTERVAL 2 DAY));

-- =====================================================
-- FAVORITE USERS  (alice's close friends list)
-- =====================================================
INSERT INTO favorite_user (id, user_id, favorite_id, created_at, updated_at) VALUES
    (UUID_TO_BIN('00000080-0000-0000-0000-000000000001'), @alice, @bob,   NOW(), NOW()),
    (UUID_TO_BIN('00000080-0000-0000-0000-000000000002'), @alice, @carol, NOW(), NOW());
