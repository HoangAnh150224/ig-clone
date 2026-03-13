package com.instagram.be;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.context.TestPropertySource;
import org.springframework.data.redis.connection.RedisConnectionFactory;

@SpringBootTest
@TestPropertySource(properties = {
    "cloudinary.url=cloudinary://test:test@test"
})
class InstagramBeApplicationTests {

    @MockitoBean
    private StringRedisTemplate stringRedisTemplate;

    @MockitoBean
    private JavaMailSender javaMailSender;

    @MockitoBean
    private RedisConnectionFactory redisConnectionFactory;

    @Test
    void contextLoads() {
    }
}
