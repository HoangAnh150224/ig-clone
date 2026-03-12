-- V4__more_seed_data.sql
-- Extra dummy data: more posts, reels, comments, likes
-- Uses existing 6 users from V3 (alice, bob, carol, dave, eve, frank)
-- =====================================================

-- Re-declare user handles
SET @alice = UUID_TO_BIN('11111111-1111-1111-1111-111111111111');
SET @bob   = UUID_TO_BIN('22222222-2222-2222-2222-222222222222');
SET @carol = UUID_TO_BIN('33333333-3333-3333-3333-333333333333');
SET @dave  = UUID_TO_BIN('44444444-4444-4444-4444-444444444444');
SET @eve   = UUID_TO_BIN('55555555-5555-5555-5555-555555555555');
SET @frank = UUID_TO_BIN('66666666-6666-6666-6666-666666666666');

-- =====================================================
-- NEW POST IDs (p10 - p30)
-- =====================================================
SET @p10 = UUID_TO_BIN('aa000010-0000-0000-0000-000000000001');
SET @p11 = UUID_TO_BIN('aa000011-0000-0000-0000-000000000001');
SET @p12 = UUID_TO_BIN('aa000012-0000-0000-0000-000000000001');
SET @p13 = UUID_TO_BIN('aa000013-0000-0000-0000-000000000001');
SET @p14 = UUID_TO_BIN('aa000014-0000-0000-0000-000000000001');
SET @p15 = UUID_TO_BIN('aa000015-0000-0000-0000-000000000001');
SET @p16 = UUID_TO_BIN('aa000016-0000-0000-0000-000000000001');
SET @p17 = UUID_TO_BIN('aa000017-0000-0000-0000-000000000001');
SET @p18 = UUID_TO_BIN('aa000018-0000-0000-0000-000000000001');
SET @p19 = UUID_TO_BIN('aa000019-0000-0000-0000-000000000001');
SET @p20 = UUID_TO_BIN('aa000020-0000-0000-0000-000000000001');
SET @p21 = UUID_TO_BIN('aa000021-0000-0000-0000-000000000001');
SET @p22 = UUID_TO_BIN('aa000022-0000-0000-0000-000000000001');
SET @p23 = UUID_TO_BIN('aa000023-0000-0000-0000-000000000001');
SET @p24 = UUID_TO_BIN('aa000024-0000-0000-0000-000000000001');
SET @p25 = UUID_TO_BIN('aa000025-0000-0000-0000-000000000001');
SET @p26 = UUID_TO_BIN('aa000026-0000-0000-0000-000000000001');
SET @p27 = UUID_TO_BIN('aa000027-0000-0000-0000-000000000001');
SET @p28 = UUID_TO_BIN('aa000028-0000-0000-0000-000000000001');
SET @p29 = UUID_TO_BIN('aa000029-0000-0000-0000-000000000001');
SET @p30 = UUID_TO_BIN('aa000030-0000-0000-0000-000000000001');

-- Hashtag refs from V3
SET @h_photo   = UUID_TO_BIN('00000030-0000-0000-0000-000000000001');
SET @h_travel  = UUID_TO_BIN('00000030-0000-0000-0000-000000000002');
SET @h_nature  = UUID_TO_BIN('00000030-0000-0000-0000-000000000003');
SET @h_food    = UUID_TO_BIN('00000030-0000-0000-0000-000000000004');
SET @h_fitness = UUID_TO_BIN('00000030-0000-0000-0000-000000000005');

-- New hashtags
SET @h_sunset  = UUID_TO_BIN('00000030-0000-0000-0000-000000000006');
SET @h_coffee  = UUID_TO_BIN('00000030-0000-0000-0000-000000000007');
SET @h_art     = UUID_TO_BIN('00000030-0000-0000-0000-000000000008');
SET @h_music   = UUID_TO_BIN('00000030-0000-0000-0000-000000000009');
SET @h_pets    = UUID_TO_BIN('00000030-0000-0000-0000-000000000010');
SET @h_ootd    = UUID_TO_BIN('00000030-0000-0000-0000-000000000011');

INSERT INTO hashtag (id, name, created_at, updated_at) VALUES
    (@h_sunset, 'sunset', NOW(), NOW()),
    (@h_coffee, 'coffee', NOW(), NOW()),
    (@h_art,    'art',    NOW(), NOW()),
    (@h_music,  'music',  NOW(), NOW()),
    (@h_pets,   'pets',   NOW(), NOW()),
    (@h_ootd,   'ootd',   NOW(), NOW());

-- =====================================================
-- 21 NEW POSTS (mix of POST and REEL)
-- =====================================================
INSERT INTO post (id, user_id, caption, type, music, location_name,
                  is_archived, comments_disabled, hide_like_count, share_count, created_at, updated_at) VALUES
    (@p10, @alice, 'Sunset vibes at the pier 🌅 #sunset #photography', 'POST', NULL, 'Santa Monica Pier', 0,0,0,5, DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY)),
    (@p11, @alice, 'Coffee art latte ☕ #coffee #art', 'POST', NULL, 'Blue Bottle Coffee', 0,0,0,2, DATE_SUB(NOW(), INTERVAL 15 DAY), DATE_SUB(NOW(), INTERVAL 15 DAY)),
    (@p12, @alice, 'Dance tutorial 💃 #fitness', 'REEL', 'Levitating - Dua Lipa', NULL, 0,0,0,18, DATE_SUB(NOW(), INTERVAL 8 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY)),
    (@p13, @bob, 'Sushi platter perfection 🍣 #food', 'POST', NULL, 'Nobu NYC', 0,0,0,4, DATE_SUB(NOW(), INTERVAL 9 DAY), DATE_SUB(NOW(), INTERVAL 9 DAY)),
    (@p14, @bob, 'Cooking reel: 60-sec pasta 🍝 #food', 'REEL', 'Cooking Beats - Chef Mix', 'Home Kitchen', 0,0,0,25, DATE_SUB(NOW(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY)),
    (@p15, @bob, 'Morning bagel run 🥯 #food #coffee', 'POST', NULL, 'Brooklyn Bagel Co', 0,0,0,1, DATE_SUB(NOW(), INTERVAL 12 DAY), DATE_SUB(NOW(), INTERVAL 12 DAY)),
    (@p16, @carol, 'Lake reflection shot 🏞️ #nature #photography', 'POST', NULL, 'Lake Tahoe', 0,0,0,6, DATE_SUB(NOW(), INTERVAL 11 DAY), DATE_SUB(NOW(), INTERVAL 11 DAY)),
    (@p17, @carol, 'Trail running adventures 🏃‍♀️ #fitness #nature', 'REEL', 'Run Boy Run - Woodkid', 'Yosemite', 0,0,0,14, DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),
    (@p18, @carol, 'Wildflowers in bloom 🌸 #nature', 'POST', NULL, 'Wildflower Meadow', 0,0,0,3, DATE_SUB(NOW(), INTERVAL 20 DAY), DATE_SUB(NOW(), INTERVAL 20 DAY)),
    (@p19, @carol, 'Camping under the stars ⛺ #travel #nature', 'POST', NULL, 'Grand Canyon', 0,0,0,8, DATE_SUB(NOW(), INTERVAL 16 DAY), DATE_SUB(NOW(), INTERVAL 16 DAY)),
    (@p20, @eve, 'HIIT workout at home 🔥 #fitness', 'REEL', 'Stronger - Kanye West', NULL, 0,0,0,30, DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),
    (@p21, @eve, 'Healthy meal prep Sunday 🥗 #food #fitness', 'POST', NULL, NULL, 0,0,0,2, DATE_SUB(NOW(), INTERVAL 8 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY)),
    (@p22, @eve, 'Sunset yoga session 🧘‍♀️ #fitness #sunset', 'REEL', 'Breathe - Fleetwood Mac', 'Venice Beach', 0,0,0,22, DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
    (@p23, @eve, 'Post-workout smoothie 🍓 #fitness #food', 'POST', NULL, 'Juice Press', 0,0,0,1, DATE_SUB(NOW(), INTERVAL 13 DAY), DATE_SUB(NOW(), INTERVAL 13 DAY)),
    (@p24, @frank, 'Jam session vibes 🎸 #music', 'REEL', 'Hotel California - Eagles', 'Home Studio', 0,0,0,10, DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
    (@p25, @frank, 'My cat judging me again 😂 #pets', 'POST', NULL, NULL, 0,0,0,0, DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY)),
    (@p26, @frank, 'Street art in Brooklyn 🎨 #art', 'POST', NULL, 'Bushwick, Brooklyn', 0,0,0,3, DATE_SUB(NOW(), INTERVAL 18 DAY), DATE_SUB(NOW(), INTERVAL 18 DAY)),
    (@p27, @frank, 'Guitar riff tutorial 🎶 #music', 'REEL', 'Sweet Child O Mine - GNR', NULL, 0,0,0,15, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
    (@p28, @alice, 'Weekend market finds 🛍️ #ootd', 'POST', NULL, 'Melrose Trading Post', 0,0,0,4, DATE_SUB(NOW(), INTERVAL 22 DAY), DATE_SUB(NOW(), INTERVAL 22 DAY)),
    (@p29, @bob, 'Pizza from scratch 🍕 #food', 'REEL', 'Thats Amore - Dean Martin', 'Brooklyn, NY', 0,0,0,28, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
    (@p30, @carol, 'Mountain summit selfie 🏔️ #travel #fitness', 'POST', NULL, 'Mt. Whitney', 0,0,0,7, DATE_SUB(NOW(), INTERVAL 25 DAY), DATE_SUB(NOW(), INTERVAL 25 DAY));

-- =====================================================
-- POST MEDIA for new posts
-- =====================================================
INSERT INTO post_media (id, post_id, url, media_type, display_order, created_at, updated_at) VALUES
    (UUID_TO_BIN('bb000001-0000-0000-0000-000000000001'), @p10, 'https://picsum.photos/seed/sunset_pier/1080/1080', 'IMAGE', 0, NOW(), NOW()),
    (UUID_TO_BIN('bb000001-0000-0000-0000-000000000002'), @p11, 'https://picsum.photos/seed/coffee_art/1080/1080', 'IMAGE', 0, NOW(), NOW()),
    (UUID_TO_BIN('bb000001-0000-0000-0000-000000000003'), @p12, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 'VIDEO', 0, NOW(), NOW()),
    (UUID_TO_BIN('bb000001-0000-0000-0000-000000000004'), @p13, 'https://picsum.photos/seed/sushi1/1080/1080', 'IMAGE', 0, NOW(), NOW()),
    (UUID_TO_BIN('bb000001-0000-0000-0000-000000000005'), @p14, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', 'VIDEO', 0, NOW(), NOW()),
    (UUID_TO_BIN('bb000001-0000-0000-0000-000000000006'), @p15, 'https://picsum.photos/seed/bagel1/1080/1080', 'IMAGE', 0, NOW(), NOW()),
    (UUID_TO_BIN('bb000001-0000-0000-0000-000000000007'), @p16, 'https://picsum.photos/seed/lake_ref/1080/1080', 'IMAGE', 0, NOW(), NOW()),
    (UUID_TO_BIN('bb000001-0000-0000-0000-000000000008'), @p17, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'VIDEO', 0, NOW(), NOW()),
    (UUID_TO_BIN('bb000001-0000-0000-0000-000000000009'), @p18, 'https://picsum.photos/seed/wildflower/1080/1080', 'IMAGE', 0, NOW(), NOW()),
    (UUID_TO_BIN('bb000001-0000-0000-0000-000000000010'), @p19, 'https://picsum.photos/seed/camping1/1080/1080', 'IMAGE', 0, NOW(), NOW()),
    (UUID_TO_BIN('bb000001-0000-0000-0000-000000000011'), @p19, 'https://picsum.photos/seed/camping2/1080/1080', 'IMAGE', 1, NOW(), NOW()),
    (UUID_TO_BIN('bb000001-0000-0000-0000-000000000012'), @p20, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', 'VIDEO', 0, NOW(), NOW()),
    (UUID_TO_BIN('bb000001-0000-0000-0000-000000000013'), @p21, 'https://picsum.photos/seed/mealprep/1080/1080', 'IMAGE', 0, NOW(), NOW()),
    (UUID_TO_BIN('bb000001-0000-0000-0000-000000000014'), @p22, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', 'VIDEO', 0, NOW(), NOW()),
    (UUID_TO_BIN('bb000001-0000-0000-0000-000000000015'), @p23, 'https://picsum.photos/seed/smoothie1/1080/1080', 'IMAGE', 0, NOW(), NOW()),
    (UUID_TO_BIN('bb000001-0000-0000-0000-000000000016'), @p24, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', 'VIDEO', 0, NOW(), NOW()),
    (UUID_TO_BIN('bb000001-0000-0000-0000-000000000017'), @p25, 'https://picsum.photos/seed/cat_judge/1080/1080', 'IMAGE', 0, NOW(), NOW()),
    (UUID_TO_BIN('bb000001-0000-0000-0000-000000000018'), @p26, 'https://picsum.photos/seed/street_art/1080/1080', 'IMAGE', 0, NOW(), NOW()),
    (UUID_TO_BIN('bb000001-0000-0000-0000-000000000019'), @p26, 'https://picsum.photos/seed/street_art2/1080/1080', 'IMAGE', 1, NOW(), NOW()),
    (UUID_TO_BIN('bb000001-0000-0000-0000-000000000020'), @p27, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4', 'VIDEO', 0, NOW(), NOW()),
    (UUID_TO_BIN('bb000001-0000-0000-0000-000000000021'), @p28, 'https://picsum.photos/seed/market1/1080/1080', 'IMAGE', 0, NOW(), NOW()),
    (UUID_TO_BIN('bb000001-0000-0000-0000-000000000022'), @p28, 'https://picsum.photos/seed/market2/1080/1080', 'IMAGE', 1, NOW(), NOW()),
    (UUID_TO_BIN('bb000001-0000-0000-0000-000000000023'), @p28, 'https://picsum.photos/seed/market3/1080/1080', 'IMAGE', 2, NOW(), NOW()),
    (UUID_TO_BIN('bb000001-0000-0000-0000-000000000024'), @p29, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', 'VIDEO', 0, NOW(), NOW()),
    (UUID_TO_BIN('bb000001-0000-0000-0000-000000000025'), @p30, 'https://picsum.photos/seed/summit1/1080/1080', 'IMAGE', 0, NOW(), NOW());

-- =====================================================
-- POST HASHTAGS for new posts
-- =====================================================
INSERT INTO post_hashtag (post_id, hashtag_id) VALUES
    (@p10, @h_sunset), (@p10, @h_photo),
    (@p11, @h_coffee), (@p11, @h_art),
    (@p12, @h_fitness),
    (@p13, @h_food),
    (@p14, @h_food),
    (@p15, @h_food), (@p15, @h_coffee),
    (@p16, @h_nature), (@p16, @h_photo),
    (@p17, @h_fitness), (@p17, @h_nature),
    (@p18, @h_nature),
    (@p19, @h_travel), (@p19, @h_nature),
    (@p20, @h_fitness),
    (@p21, @h_food), (@p21, @h_fitness),
    (@p22, @h_fitness), (@p22, @h_sunset),
    (@p23, @h_fitness), (@p23, @h_food),
    (@p24, @h_music),
    (@p25, @h_pets),
    (@p26, @h_art),
    (@p27, @h_music),
    (@p28, @h_ootd),
    (@p29, @h_food),
    (@p30, @h_travel), (@p30, @h_fitness);

-- =====================================================
-- POST LIKES (massive - every user likes most posts)
-- =====================================================
INSERT INTO post_like (id, post_id, user_id, created_at, updated_at) VALUES
    -- p10 likes
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000001'), @p10, @bob,   DATE_SUB(NOW(), INTERVAL 9 DAY), DATE_SUB(NOW(), INTERVAL 9 DAY)),
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000002'), @p10, @carol, DATE_SUB(NOW(), INTERVAL 9 DAY), DATE_SUB(NOW(), INTERVAL 9 DAY)),
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000003'), @p10, @eve,   DATE_SUB(NOW(), INTERVAL 8 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY)),
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000004'), @p10, @frank, DATE_SUB(NOW(), INTERVAL 8 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY)),
    -- p11
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000005'), @p11, @bob,   DATE_SUB(NOW(), INTERVAL 14 DAY), DATE_SUB(NOW(), INTERVAL 14 DAY)),
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000006'), @p11, @eve,   DATE_SUB(NOW(), INTERVAL 14 DAY), DATE_SUB(NOW(), INTERVAL 14 DAY)),
    -- p12
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000007'), @p12, @bob,   DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY)),
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000008'), @p12, @carol, DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY)),
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000009'), @p12, @eve,   DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY)),
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000010'), @p12, @frank, DATE_SUB(NOW(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY)),
    -- p13
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000011'), @p13, @alice, DATE_SUB(NOW(), INTERVAL 8 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY)),
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000012'), @p13, @carol, DATE_SUB(NOW(), INTERVAL 8 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY)),
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000013'), @p13, @eve,   DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY)),
    -- p14
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000014'), @p14, @alice, DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000015'), @p14, @carol, DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000016'), @p14, @eve,   DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000017'), @p14, @frank, DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),
    -- p15
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000018'), @p15, @alice, DATE_SUB(NOW(), INTERVAL 11 DAY), DATE_SUB(NOW(), INTERVAL 11 DAY)),
    -- p16
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000019'), @p16, @alice, DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY)),
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000020'), @p16, @bob,   DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY)),
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000021'), @p16, @eve,   DATE_SUB(NOW(), INTERVAL 9 DAY), DATE_SUB(NOW(), INTERVAL 9 DAY)),
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000022'), @p16, @frank, DATE_SUB(NOW(), INTERVAL 9 DAY), DATE_SUB(NOW(), INTERVAL 9 DAY)),
    -- p17
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000023'), @p17, @alice, DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000024'), @p17, @bob,   DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000025'), @p17, @eve,   DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),
    -- p18
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000026'), @p18, @alice, DATE_SUB(NOW(), INTERVAL 19 DAY), DATE_SUB(NOW(), INTERVAL 19 DAY)),
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000027'), @p18, @bob,   DATE_SUB(NOW(), INTERVAL 18 DAY), DATE_SUB(NOW(), INTERVAL 18 DAY)),
    -- p19
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000028'), @p19, @alice, DATE_SUB(NOW(), INTERVAL 15 DAY), DATE_SUB(NOW(), INTERVAL 15 DAY)),
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000029'), @p19, @bob,   DATE_SUB(NOW(), INTERVAL 15 DAY), DATE_SUB(NOW(), INTERVAL 15 DAY)),
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000030'), @p19, @eve,   DATE_SUB(NOW(), INTERVAL 14 DAY), DATE_SUB(NOW(), INTERVAL 14 DAY)),
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000031'), @p19, @frank, DATE_SUB(NOW(), INTERVAL 14 DAY), DATE_SUB(NOW(), INTERVAL 14 DAY)),
    -- p20
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000032'), @p20, @alice, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000033'), @p20, @bob,   DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000034'), @p20, @carol, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000035'), @p20, @frank, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
    -- p21
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000036'), @p21, @alice, DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY)),
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000037'), @p21, @carol, DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY)),
    -- p22
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000038'), @p22, @alice, DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000039'), @p22, @bob,   DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000040'), @p22, @carol, DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000041'), @p22, @frank, DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),
    -- p23
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000042'), @p23, @alice, DATE_SUB(NOW(), INTERVAL 12 DAY), DATE_SUB(NOW(), INTERVAL 12 DAY)),
    -- p24
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000043'), @p24, @alice, DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000044'), @p24, @bob,   DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000045'), @p24, @eve,   DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),
    -- p25
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000046'), @p25, @alice, DATE_SUB(NOW(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY)),
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000047'), @p25, @carol, DATE_SUB(NOW(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY)),
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000048'), @p25, @eve,   DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
    -- p26
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000049'), @p26, @alice, DATE_SUB(NOW(), INTERVAL 17 DAY), DATE_SUB(NOW(), INTERVAL 17 DAY)),
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000050'), @p26, @bob,   DATE_SUB(NOW(), INTERVAL 17 DAY), DATE_SUB(NOW(), INTERVAL 17 DAY)),
    -- p27
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000051'), @p27, @alice, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000052'), @p27, @bob,   DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000053'), @p27, @carol, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000054'), @p27, @eve,   DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
    -- p28
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000055'), @p28, @bob,   DATE_SUB(NOW(), INTERVAL 21 DAY), DATE_SUB(NOW(), INTERVAL 21 DAY)),
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000056'), @p28, @eve,   DATE_SUB(NOW(), INTERVAL 21 DAY), DATE_SUB(NOW(), INTERVAL 21 DAY)),
    -- p29
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000057'), @p29, @alice, DATE_SUB(NOW(), INTERVAL 12 HOUR), DATE_SUB(NOW(), INTERVAL 12 HOUR)),
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000058'), @p29, @carol, DATE_SUB(NOW(), INTERVAL 10 HOUR), DATE_SUB(NOW(), INTERVAL 10 HOUR)),
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000059'), @p29, @eve,   DATE_SUB(NOW(), INTERVAL 8 HOUR), DATE_SUB(NOW(), INTERVAL 8 HOUR)),
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000060'), @p29, @frank, DATE_SUB(NOW(), INTERVAL 6 HOUR), DATE_SUB(NOW(), INTERVAL 6 HOUR)),
    -- p30
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000061'), @p30, @alice, DATE_SUB(NOW(), INTERVAL 24 DAY), DATE_SUB(NOW(), INTERVAL 24 DAY)),
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000062'), @p30, @bob,   DATE_SUB(NOW(), INTERVAL 24 DAY), DATE_SUB(NOW(), INTERVAL 24 DAY)),
    (UUID_TO_BIN('cc000001-0000-0000-0000-000000000063'), @p30, @eve,   DATE_SUB(NOW(), INTERVAL 23 DAY), DATE_SUB(NOW(), INTERVAL 23 DAY));

-- =====================================================
-- COMMENTS on new posts (30+ comments)
-- =====================================================
SET @nc1  = UUID_TO_BIN('dd000001-0000-0000-0000-000000000001');
SET @nc2  = UUID_TO_BIN('dd000001-0000-0000-0000-000000000002');
SET @nc3  = UUID_TO_BIN('dd000001-0000-0000-0000-000000000003');
SET @nc4  = UUID_TO_BIN('dd000001-0000-0000-0000-000000000004');
SET @nc5  = UUID_TO_BIN('dd000001-0000-0000-0000-000000000005');

INSERT INTO comment (id, post_id, user_id, content, parent_comment_id, is_pinned, created_at, updated_at) VALUES
    -- p10 comments
    (@nc1, @p10, @bob,   'This light is insane! 😍', NULL, 0, DATE_SUB(NOW(), INTERVAL 9 DAY), DATE_SUB(NOW(), INTERVAL 9 DAY)),
    (@nc2, @p10, @carol, 'Santa Monica is the best!', NULL, 0, DATE_SUB(NOW(), INTERVAL 9 DAY), DATE_SUB(NOW(), INTERVAL 9 DAY)),
    (@nc3, @p10, @alice, 'Thanks guys! Golden hour never disappoints', @nc1, 0, DATE_SUB(NOW(), INTERVAL 8 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY)),
    (@nc4, @p10, @eve,   'Need to visit this spot', NULL, 0, DATE_SUB(NOW(), INTERVAL 8 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY)),
    -- p12 comments
    (@nc5, @p12, @eve,   'Love the choreography! 🔥', NULL, 1, DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY)),
    (UUID_TO_BIN('dd000001-0000-0000-0000-000000000006'), @p12, @bob, 'Tutorial please!!', NULL, 0, DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY)),
    (UUID_TO_BIN('dd000001-0000-0000-0000-000000000007'), @p12, @alice, 'Coming soon! 💃', UUID_TO_BIN('dd000001-0000-0000-0000-000000000006'), 0, DATE_SUB(NOW(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY)),
    -- p13 comments
    (UUID_TO_BIN('dd000001-0000-0000-0000-000000000008'), @p13, @alice, 'Omg that looks delicious 🤤', NULL, 0, DATE_SUB(NOW(), INTERVAL 8 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY)),
    (UUID_TO_BIN('dd000001-0000-0000-0000-000000000009'), @p13, @eve,   'Recipe please!!', NULL, 0, DATE_SUB(NOW(), INTERVAL 8 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY)),
    -- p14 comments
    (UUID_TO_BIN('dd000001-0000-0000-0000-000000000010'), @p14, @alice, 'Making this tonight! 🍝', NULL, 0, DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
    (UUID_TO_BIN('dd000001-0000-0000-0000-000000000011'), @p14, @carol, 'So easy and looks amazing', NULL, 0, DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
    (UUID_TO_BIN('dd000001-0000-0000-0000-000000000012'), @p14, @eve,   'Saved! 🔖', NULL, 0, DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),
    -- p16 comments
    (UUID_TO_BIN('dd000001-0000-0000-0000-000000000013'), @p16, @alice, 'Wow the reflection is perfect 📸', NULL, 1, DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY)),
    (UUID_TO_BIN('dd000001-0000-0000-0000-000000000014'), @p16, @bob,   'Lake Tahoe is magical', NULL, 0, DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY)),
    (UUID_TO_BIN('dd000001-0000-0000-0000-000000000015'), @p16, @frank, 'So peaceful 🏞️', NULL, 0, DATE_SUB(NOW(), INTERVAL 9 DAY), DATE_SUB(NOW(), INTERVAL 9 DAY)),
    -- p17 comments
    (UUID_TO_BIN('dd000001-0000-0000-0000-000000000016'), @p17, @alice, 'You make running look so fun!', NULL, 0, DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),
    (UUID_TO_BIN('dd000001-0000-0000-0000-000000000017'), @p17, @eve,   'Trail running goals 🏃‍♀️💨', NULL, 0, DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),
    -- p19 comments
    (UUID_TO_BIN('dd000001-0000-0000-0000-000000000018'), @p19, @alice, 'Grand Canyon is on my bucket list!', NULL, 0, DATE_SUB(NOW(), INTERVAL 15 DAY), DATE_SUB(NOW(), INTERVAL 15 DAY)),
    (UUID_TO_BIN('dd000001-0000-0000-0000-000000000019'), @p19, @bob,   'Amazing view 🏜️', NULL, 0, DATE_SUB(NOW(), INTERVAL 15 DAY), DATE_SUB(NOW(), INTERVAL 15 DAY)),
    (UUID_TO_BIN('dd000001-0000-0000-0000-000000000020'), @p19, @eve,   'Camping + stars = perfection ⭐', NULL, 0, DATE_SUB(NOW(), INTERVAL 14 DAY), DATE_SUB(NOW(), INTERVAL 14 DAY)),
    -- p20 comments
    (UUID_TO_BIN('dd000001-0000-0000-0000-000000000021'), @p20, @alice, 'This workout destroyed me 😂💪', NULL, 0, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
    (UUID_TO_BIN('dd000001-0000-0000-0000-000000000022'), @p20, @bob,   'How do you make it look so easy??', NULL, 0, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
    (UUID_TO_BIN('dd000001-0000-0000-0000-000000000023'), @p20, @carol, 'Doing this tomorrow morning!', NULL, 0, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
    (UUID_TO_BIN('dd000001-0000-0000-0000-000000000024'), @p20, @frank, 'Beast mode activated 🔥', NULL, 0, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
    -- p22 comments
    (UUID_TO_BIN('dd000001-0000-0000-0000-000000000025'), @p22, @alice, 'So calming to watch 🧘‍♀️', NULL, 0, DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),
    (UUID_TO_BIN('dd000001-0000-0000-0000-000000000026'), @p22, @carol, 'Venice Beach sunsets hit different', NULL, 0, DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),
    -- p24 comments
    (UUID_TO_BIN('dd000001-0000-0000-0000-000000000027'), @p24, @bob,   'Dude you shred! 🎸🔥', NULL, 0, DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),
    (UUID_TO_BIN('dd000001-0000-0000-0000-000000000028'), @p24, @alice, 'Play at my next party please!', NULL, 0, DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),
    -- p25 comments
    (UUID_TO_BIN('dd000001-0000-0000-0000-000000000029'), @p25, @alice, 'Your cat is iconic 😂', NULL, 0, DATE_SUB(NOW(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY)),
    (UUID_TO_BIN('dd000001-0000-0000-0000-000000000030'), @p25, @eve,   'Same energy as my cat honestly', NULL, 0, DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
    (UUID_TO_BIN('dd000001-0000-0000-0000-000000000031'), @p25, @carol, 'Cats are the best judges of character 🐱', NULL, 0, DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
    -- p27 comments
    (UUID_TO_BIN('dd000001-0000-0000-0000-000000000032'), @p27, @alice, 'Tab link please! 🎵', NULL, 0, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
    (UUID_TO_BIN('dd000001-0000-0000-0000-000000000033'), @p27, @bob,   'That tone is amazing what gear are you using?', NULL, 0, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
    (UUID_TO_BIN('dd000001-0000-0000-0000-000000000034'), @p27, @eve,   'Fire 🔥🔥🔥', NULL, 0, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
    -- p29 comments
    (UUID_TO_BIN('dd000001-0000-0000-0000-000000000035'), @p29, @alice, 'I can smell this through the screen 🍕', NULL, 0, DATE_SUB(NOW(), INTERVAL 10 HOUR), DATE_SUB(NOW(), INTERVAL 10 HOUR)),
    (UUID_TO_BIN('dd000001-0000-0000-0000-000000000036'), @p29, @carol, 'Bob your food content is always top tier', NULL, 0, DATE_SUB(NOW(), INTERVAL 8 HOUR), DATE_SUB(NOW(), INTERVAL 8 HOUR)),
    (UUID_TO_BIN('dd000001-0000-0000-0000-000000000037'), @p29, @eve,   'Cheat day approved 😂', NULL, 0, DATE_SUB(NOW(), INTERVAL 6 HOUR), DATE_SUB(NOW(), INTERVAL 6 HOUR)),
    (UUID_TO_BIN('dd000001-0000-0000-0000-000000000038'), @p29, @frank, 'Bro invite me next time', NULL, 0, DATE_SUB(NOW(), INTERVAL 4 HOUR), DATE_SUB(NOW(), INTERVAL 4 HOUR)),
    -- p30 comments
    (UUID_TO_BIN('dd000001-0000-0000-0000-000000000039'), @p30, @alice, 'You summited Whitney?! Legend! 🏔️', NULL, 0, DATE_SUB(NOW(), INTERVAL 24 DAY), DATE_SUB(NOW(), INTERVAL 24 DAY)),
    (UUID_TO_BIN('dd000001-0000-0000-0000-000000000040'), @p30, @bob,   'How long was the hike?', NULL, 0, DATE_SUB(NOW(), INTERVAL 24 DAY), DATE_SUB(NOW(), INTERVAL 24 DAY));

-- =====================================================
-- COMMENT LIKES on new comments
-- =====================================================
INSERT INTO comment_like (id, comment_id, user_id, created_at, updated_at) VALUES
    (UUID_TO_BIN('ee000001-0000-0000-0000-000000000001'), @nc1, @alice, DATE_SUB(NOW(), INTERVAL 9 DAY), DATE_SUB(NOW(), INTERVAL 9 DAY)),
    (UUID_TO_BIN('ee000001-0000-0000-0000-000000000002'), @nc1, @eve,   DATE_SUB(NOW(), INTERVAL 8 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY)),
    (UUID_TO_BIN('ee000001-0000-0000-0000-000000000003'), @nc2, @alice, DATE_SUB(NOW(), INTERVAL 9 DAY), DATE_SUB(NOW(), INTERVAL 9 DAY)),
    (UUID_TO_BIN('ee000001-0000-0000-0000-000000000004'), @nc4, @alice, DATE_SUB(NOW(), INTERVAL 8 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY)),
    (UUID_TO_BIN('ee000001-0000-0000-0000-000000000005'), @nc5, @alice, DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY)),
    (UUID_TO_BIN('ee000001-0000-0000-0000-000000000006'), @nc5, @bob,   DATE_SUB(NOW(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY)),
    (UUID_TO_BIN('ee000001-0000-0000-0000-000000000007'), @nc5, @carol, DATE_SUB(NOW(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY)),
    (UUID_TO_BIN('ee000001-0000-0000-0000-000000000008'), UUID_TO_BIN('dd000001-0000-0000-0000-000000000021'), @eve, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
    (UUID_TO_BIN('ee000001-0000-0000-0000-000000000009'), UUID_TO_BIN('dd000001-0000-0000-0000-000000000027'), @alice, DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),
    (UUID_TO_BIN('ee000001-0000-0000-0000-000000000010'), UUID_TO_BIN('dd000001-0000-0000-0000-000000000035'), @bob, DATE_SUB(NOW(), INTERVAL 9 HOUR), DATE_SUB(NOW(), INTERVAL 9 HOUR));

-- =====================================================
-- POST VIEWS for new posts
-- =====================================================
INSERT INTO post_view (id, post_id, viewer_id, created_at, updated_at) VALUES
    (UUID_TO_BIN('ff000001-0000-0000-0000-000000000001'), @p12, @bob,   DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY)),
    (UUID_TO_BIN('ff000001-0000-0000-0000-000000000002'), @p12, @carol, DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY)),
    (UUID_TO_BIN('ff000001-0000-0000-0000-000000000003'), @p12, @eve,   DATE_SUB(NOW(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY)),
    (UUID_TO_BIN('ff000001-0000-0000-0000-000000000004'), @p14, @alice, DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
    (UUID_TO_BIN('ff000001-0000-0000-0000-000000000005'), @p14, @carol, DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
    (UUID_TO_BIN('ff000001-0000-0000-0000-000000000006'), @p17, @alice, DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),
    (UUID_TO_BIN('ff000001-0000-0000-0000-000000000007'), @p17, @bob,   DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),
    (UUID_TO_BIN('ff000001-0000-0000-0000-000000000008'), @p20, @alice, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
    (UUID_TO_BIN('ff000001-0000-0000-0000-000000000009'), @p20, @bob,   DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
    (UUID_TO_BIN('ff000001-0000-0000-0000-000000000010'), @p20, @carol, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
    (UUID_TO_BIN('ff000001-0000-0000-0000-000000000011'), @p22, @alice, DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),
    (UUID_TO_BIN('ff000001-0000-0000-0000-000000000012'), @p22, @bob,   DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),
    (UUID_TO_BIN('ff000001-0000-0000-0000-000000000013'), @p24, @alice, DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),
    (UUID_TO_BIN('ff000001-0000-0000-0000-000000000014'), @p24, @bob,   DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),
    (UUID_TO_BIN('ff000001-0000-0000-0000-000000000015'), @p27, @alice, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
    (UUID_TO_BIN('ff000001-0000-0000-0000-000000000016'), @p27, @bob,   DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
    (UUID_TO_BIN('ff000001-0000-0000-0000-000000000017'), @p29, @alice, DATE_SUB(NOW(), INTERVAL 12 HOUR), DATE_SUB(NOW(), INTERVAL 12 HOUR)),
    (UUID_TO_BIN('ff000001-0000-0000-0000-000000000018'), @p29, @carol, DATE_SUB(NOW(), INTERVAL 10 HOUR), DATE_SUB(NOW(), INTERVAL 10 HOUR));

-- =====================================================
-- SAVED POSTS (more saves)
-- =====================================================
INSERT INTO saved_post (id, user_id, post_id, created_at, updated_at) VALUES
    (UUID_TO_BIN('00000012-0000-0000-0000-000000000010'), @alice, @p14, DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
    (UUID_TO_BIN('00000012-0000-0000-0000-000000000011'), @alice, @p20, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
    (UUID_TO_BIN('00000012-0000-0000-0000-000000000012'), @bob,   @p12, DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY)),
    (UUID_TO_BIN('00000012-0000-0000-0000-000000000013'), @carol, @p22, DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY)),
    (UUID_TO_BIN('00000012-0000-0000-0000-000000000014'), @eve,   @p29, DATE_SUB(NOW(), INTERVAL 8 HOUR), DATE_SUB(NOW(), INTERVAL 8 HOUR));
