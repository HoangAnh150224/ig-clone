package com.instagram.be;

import com.instagram.be.config.JwtProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableScheduling;

import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableScheduling
@EnableAsync
@EnableConfigurationProperties(JwtProperties.class)
public class InstagramBeApplication {

    public static void main(String[] args) {
        SpringApplication.run(InstagramBeApplication.class, args);
    }
}
