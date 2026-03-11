package com.instagram.be;

import com.instagram.be.config.JwtProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(JwtProperties.class)
public class InstagramBeApplication {

    public static void main(String[] args) {
        SpringApplication.run(InstagramBeApplication.class, args);
    }
}
