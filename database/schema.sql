-- ==============================================================================
-- SANSKRITVERSE Database Schema
-- Target: MySQL 8.0+
-- Encoding: UTF8MB4 with Unicode Collation for accurate Devanagari script support
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `sanskritverse` 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `sanskritverse`;

-- Drop existing tables in reverse dependency order
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `user_settings`;
DROP TABLE IF EXISTS `saved_words`;
DROP TABLE IF EXISTS `leaderboard`;
DROP TABLE IF EXISTS `daily_challenges`;
DROP TABLE IF EXISTS `pronunciation_attempts`;
DROP TABLE IF EXISTS `chatbot_history`;
DROP TABLE IF EXISTS `learning_streaks`;
DROP TABLE IF EXISTS `user_achievements`;
DROP TABLE IF EXISTS `achievements`;
DROP TABLE IF EXISTS `quiz_attempts`;
DROP TABLE IF EXISTS `quiz_questions`;
DROP TABLE IF EXISTS `grammar_topics`;
DROP TABLE IF EXISTS `vocabulary`;
DROP TABLE IF EXISTS `user_progress`;
DROP TABLE IF EXISTS `lessons`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Users Table
CREATE TABLE `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `sanskrit_level` ENUM('Beginner', 'Elementary', 'Intermediate', 'Advanced') DEFAULT 'Beginner',
    `daily_goal_mins` INT DEFAULT 15,
    `xp` INT DEFAULT 0,
    `current_level` INT DEFAULT 1,
    `streak_days` INT DEFAULT 1,
    `last_active_date` DATE,
    `avatar` VARCHAR(255) DEFAULT 'acharya_avatar_1.png',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_users_xp` (`xp`),
    INDEX `idx_users_level` (`current_level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Lessons Table
CREATE TABLE `lessons` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(150) NOT NULL,
    `title_sanskrit` VARCHAR(150) NOT NULL,
    `level` INT DEFAULT 1,
    `category` VARCHAR(50) NOT NULL,
    `description` TEXT,
    `order_num` INT NOT NULL,
    `xp_reward` INT DEFAULT 50,
    `estimated_minutes` INT DEFAULT 10,
    `content_json` JSON,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_lessons_level_order` (`level`, `order_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. User Progress Table
CREATE TABLE `user_progress` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `lesson_id` INT NOT NULL,
    `status` ENUM('not_started', 'in_progress', 'completed') DEFAULT 'not_started',
    `score` INT DEFAULT 0,
    `completed_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_user_lesson` (`user_id`, `lesson_id`),
    CONSTRAINT `fk_user_progress_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_user_progress_lesson` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Vocabulary Table
CREATE TABLE `vocabulary` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `devanagari` VARCHAR(100) NOT NULL,
    `iast` VARCHAR(100) NOT NULL,
    `english` VARCHAR(150) NOT NULL,
    `word_type` ENUM('noun', 'verb', 'adjective', 'indeclinable', 'pronoun') NOT NULL,
    `gender` ENUM('masculine', 'feminine', 'neuter', 'none') DEFAULT 'none',
    `category` VARCHAR(50) NOT NULL,
    `root` VARCHAR(50),
    `audio_url` VARCHAR(255),
    `example_sanskrit` TEXT NOT NULL,
    `example_iast` TEXT,
    `example_english` TEXT NOT NULL,
    `difficulty` ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_vocab_category` (`category`),
    INDEX `idx_vocab_difficulty` (`difficulty`),
    INDEX `idx_vocab_word` (`devanagari`, `iast`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Grammar Topics Table
CREATE TABLE `grammar_topics` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title_sanskrit` VARCHAR(100) NOT NULL,
    `title_english` VARCHAR(100) NOT NULL,
    `category` ENUM('vibhakti', 'dhatu', 'sandhi', 'samasa', 'sentence_structure', 'participle') NOT NULL,
    `summary` TEXT NOT NULL,
    `rules_json` JSON NOT NULL,
    `examples_json` JSON NOT NULL,
    `order_num` INT DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_grammar_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Quiz Questions Table
CREATE TABLE `quiz_questions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `topic_id` INT NULL,
    `category` VARCHAR(50) NOT NULL,
    `difficulty` ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    `question_type` ENUM('mcq', 'fill_blank', 'translation', 'match', 'arrange', 'timed') NOT NULL,
    `question_text` TEXT NOT NULL,
    `prompt_sanskrit` VARCHAR(255),
    `options_json` JSON NOT NULL,
    `correct_answer` TEXT NOT NULL,
    `explanation` TEXT NOT NULL,
    `xp_value` INT DEFAULT 15,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_quiz_topic` FOREIGN KEY (`topic_id`) REFERENCES `grammar_topics` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Quiz Attempts Table
CREATE TABLE `quiz_attempts` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `quiz_type` VARCHAR(50) NOT NULL,
    `score` INT NOT NULL,
    `max_score` INT NOT NULL,
    `xp_earned` INT NOT NULL,
    `answers_json` JSON,
    `completed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_quiz_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Achievements Table
CREATE TABLE `achievements` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `badge_code` VARCHAR(50) NOT NULL UNIQUE,
    `title` VARCHAR(100) NOT NULL,
    `title_sanskrit` VARCHAR(100) NOT NULL,
    `description` TEXT NOT NULL,
    `icon_name` VARCHAR(50) NOT NULL,
    `xp_reward` INT DEFAULT 100,
    `criteria_type` VARCHAR(50) NOT NULL,
    `threshold` INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. User Achievements Table
CREATE TABLE `user_achievements` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `achievement_id` INT NOT NULL,
    `unlocked_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_user_achievement` (`user_id`, `achievement_id`),
    CONSTRAINT `fk_ua_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_ua_achievement` FOREIGN KEY (`achievement_id`) REFERENCES `achievements` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Learning Streaks Table
CREATE TABLE `learning_streaks` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `streak_date` DATE NOT NULL,
    `xp_gained` INT DEFAULT 0,
    `lessons_completed` INT DEFAULT 0,
    `minutes_spent` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_user_date` (`user_id`, `streak_date`),
    CONSTRAINT `fk_streaks_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Chatbot History Table
CREATE TABLE `chatbot_history` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `session_id` VARCHAR(100) NOT NULL,
    `mode` ENUM('tutor', 'conversation', 'grammar', 'translation', 'practice', 'exam', 'mistake_coach') DEFAULT 'tutor',
    `role` ENUM('user', 'assistant', 'system') NOT NULL,
    `message_text` TEXT NOT NULL,
    `sanskrit_gloss_json` JSON NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_chat_session` (`session_id`),
    INDEX `idx_chat_user` (`user_id`),
    CONSTRAINT `fk_chat_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Pronunciation Attempts Table
CREATE TABLE `pronunciation_attempts` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `word_id` INT NULL,
    `target_text` VARCHAR(255) NOT NULL,
    `recognized_text` VARCHAR(255),
    `accuracy_score` DECIMAL(5,2) NOT NULL,
    `feedback` TEXT NOT NULL,
    `pitch_score` DECIMAL(5,2) DEFAULT 0.00,
    `rhythm_score` DECIMAL(5,2) DEFAULT 0.00,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_pron_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_pron_word` FOREIGN KEY (`word_id`) REFERENCES `vocabulary` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Daily Challenges Table
CREATE TABLE `daily_challenges` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `date_for` DATE NOT NULL UNIQUE,
    `title` VARCHAR(150) NOT NULL,
    `title_sanskrit` VARCHAR(150) NOT NULL,
    `challenge_type` ENUM('translation', 'sandhi', 'vocab', 'grammar', 'sentence') NOT NULL,
    `challenge_data_json` JSON NOT NULL,
    `xp_reward` INT DEFAULT 50,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Leaderboard Cache Table
CREATE TABLE `leaderboard` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL UNIQUE,
    `username` VARCHAR(50) NOT NULL,
    `avatar` VARCHAR(255),
    `total_xp` INT DEFAULT 0,
    `current_level` INT DEFAULT 1,
    `weekly_xp` INT DEFAULT 0,
    `rank` INT DEFAULT 0,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_lb_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. Saved Words (Spaced Repetition SM-2 System) Table
CREATE TABLE `saved_words` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `word_id` INT NOT NULL,
    `srs_stage` INT DEFAULT 0,
    `ease_factor` DECIMAL(4,2) DEFAULT 2.50,
    `interval_days` INT DEFAULT 1,
    `correct_count` INT DEFAULT 0,
    `incorrect_count` INT DEFAULT 0,
    `last_reviewed` TIMESTAMP NULL,
    `next_review` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_user_word` (`user_id`, `word_id`),
    CONSTRAINT `fk_sw_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_sw_word` FOREIGN KEY (`word_id`) REFERENCES `vocabulary` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. User Settings Table
CREATE TABLE `user_settings` (
    `user_id` INT PRIMARY KEY,
    `theme` ENUM('dark', 'light') DEFAULT 'dark',
    `graphics_quality` ENUM('high', 'medium', 'low', '2d') DEFAULT 'high',
    `audio_speed` DECIMAL(3,2) DEFAULT 1.00,
    `default_script` ENUM('devanagari', 'iast', 'both') DEFAULT 'both',
    `sound_effects` BOOLEAN DEFAULT TRUE,
    `auto_pronounce` BOOLEAN DEFAULT TRUE,
    `privacy_public_leaderboard` BOOLEAN DEFAULT TRUE,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_settings_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
