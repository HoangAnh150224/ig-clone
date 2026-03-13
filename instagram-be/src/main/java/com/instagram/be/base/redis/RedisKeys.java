package com.instagram.be.base.redis;

import java.util.UUID;

public final class RedisKeys {

    private RedisKeys() {}

    public static String blacklist(String jti) { return "blacklist:" + jti; }
    public static String rateLogin(String ip) { return "rate:login:" + ip; }
    public static String rateRegister(String ip) { return "rate:register:" + ip; }
    public static String rateUpload(UUID userId) { return "rate:upload:" + userId; }
    public static String rateCreatePost(UUID userId) { return "rate:create_post:" + userId; }
    public static String rateGlobal(String ip) { return "rate:global:" + ip; }
    public static String online(UUID userId) { return "online:" + userId; }
    public static String refresh(UUID userId) { return "refresh:" + userId; }
    public static String exploreCache(int page, int size) { return "cache:explore:" + page + ":" + size; }
    public static String hashtagCache(String name, String cursor, int size) { return "cache:hashtag:" + name + ":" + cursor + ":" + size; }
}
