-- V1__init.sql
-- Initial schema for Instagram Clone

CREATE TABLE IF NOT EXISTS `user_profile`
(
    `id`         BINARY(16)   NOT NULL,
    `username`   VARCHAR(50)  NOT NULL UNIQUE,
    `email`      VARCHAR(100) NOT NULL UNIQUE,
    `full_name`  VARCHAR(100),
    `bio`        TEXT,
    `avatar_url` VARCHAR(500),
    `is_active`  TINYINT(1)   NOT NULL DEFAULT 1,
    `created_at` DATETIME(6),
    `updated_at` DATETIME(6),
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;
