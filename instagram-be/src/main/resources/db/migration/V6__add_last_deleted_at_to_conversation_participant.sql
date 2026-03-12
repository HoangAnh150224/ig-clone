-- V6__add_last_deleted_at_to_conversation_participant.sql
-- Add last_deleted_at column to conversation_participant table

ALTER TABLE `conversation_participant`
ADD COLUMN `last_deleted_at` DATETIME(6);
