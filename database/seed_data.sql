-- ==============================================================================
-- SANSKRITVERSE Seed Master Data
-- Lessons, Achievements, Daily Challenges, Default Users, and Leaderboard
-- ==============================================================================

USE `sanskritverse`;

-- 1. Default Demo Users (Password: "Sanskrit@2026!")
-- Pre-hashed with bcrypt (cost 10)
INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `sanskrit_level`, `daily_goal_mins`, `xp`, `current_level`, `streak_days`, `last_active_date`, `avatar`) VALUES
(1, 'vidyarthi', 'student@sanskritverse.io', '$2a$10$wE9sY62fM1c3QZ8WkK7Cee4W3Qf.2H1Vv7TfWzGk/k9e5R6q8S0v2', 'Intermediate', 20, 2450, 3, 12, CURDATE(), 'avatar_student.png'),
(2, 'arya_sharma', 'arya@sanskritverse.io', '$2a$10$wE9sY62fM1c3QZ8WkK7Cee4W3Qf.2H1Vv7TfWzGk/k9e5R6q8S0v2', 'Advanced', 30, 4820, 5, 28, CURDATE(), 'avatar_arya.png'),
(3, 'ananya_roy', 'ananya@sanskritverse.io', '$2a$10$wE9sY62fM1c3QZ8WkK7Cee4W3Qf.2H1Vv7TfWzGk/k9e5R6q8S0v2', 'Beginner', 15, 1150, 2, 5, CURDATE(), 'avatar_ananya.png'),
(4, 'dev_pandit', 'dev@sanskritverse.io', '$2a$10$wE9sY62fM1c3QZ8WkK7Cee4W3Qf.2H1Vv7TfWzGk/k9e5R6q8S0v2', 'Advanced', 45, 6100, 6, 45, CURDATE(), 'avatar_dev.png');

-- 2. Structured Progressive Curriculum (Lessons)
INSERT INTO `lessons` (`id`, `title`, `title_sanskrit`, `level`, `category`, `description`, `order_num`, `xp_reward`, `estimated_minutes`, `content_json`) VALUES
(1, 'Introduction to Sanskrit & Devanagari', 'संस्कृत-प्रवेशः देवनागरी च', 1, 'Alphabet', 
'Explore the sacred phonetic architecture of Devanagari, vocal points of articulation (Sthāna), and foundational vowels.', 
1, 50, 10, 
'{"sections": [{"title": "What makes Sanskrit unique?", "body": "Sanskrit is an acoustic, computational language where pronunciation precisely dictates orthography. Letters are classified based on where sound originates in the vocal tract."}, {"title": "The Swaras (Vowels)", "letters": ["अ", "आ", "इ", "ई", "उ", "ऊ", "ऋ", "ए", "ऐ", "ओ", "औ"]}]}'),

(2, 'Consonants & Articulation Centers', 'व्यञ्जनानि उच्चारणस्थानानि च', 1, 'Alphabet', 
'Learn the 5 consonant groups (Vargas: Ka, Cha, Ta, Tha, Pa) and understand guttural, palatal, retroflex, dental, and labial sounds.', 
2, 60, 12, 
'{"sections": [{"title": "The Five Vargas", "vargas": ["क-वर्ग (Kaṇṭhya - Velar)", "च-वर्ग (Tālavya - Palatal)", "ट-वर्ग (Mūrdhanya - Retroflex)", "त-वर्ग (Dantya - Dental)", "प-वर्ग (Oṣṭhya - Labial)"]}]}'),

(3, 'First Sanskrit Words & Pronouns', 'प्रथमशब्दाः सर्वनामानि च', 1, 'Vocabulary', 
'Learn greetings, everyday objects, and primary pronouns (अहम्, त्वम्, सः, सा, तत्).', 
3, 70, 15, 
'{"sections": [{"title": "Everyday Greetings", "words": ["नमस्ते", "धन्यवादः", "स्वागतम्", "हरिः ॐ"]}, {"title": "Pronouns", "pronouns": [{"word": "अहम्", "meaning": "I"}, {"word": "त्वम्", "meaning": "You"}, {"word": "सः", "meaning": "He"}, {"word": "सा", "meaning": "She"}, {"word": "तत्", "meaning": "That"}]}]}'),

(4, 'Sanskrit Nouns & The Nominative Case', 'सुबन्त-प्रकरणम् प्रथमा विभक्तिः', 2, 'Grammar', 
'Understand noun declensions (Subanta), grammatical gender, and the agent case (Prathamā Vibhakti / Kartā).', 
4, 80, 15, 
'{"sections": [{"title": "Gender in Sanskrit", "body": "Sanskrit nouns belong to masculine (पुंलिङ्ग), feminine (स्त्रीलिङ्ग), or neuter (नपुंसकलिङ्ग)."}, {"title": "Agent (Kartā)", "body": "The subject of a sentence always takes Prathamā Vibhakti: बालकः पठति (The boy reads)."}]}'),

(5, 'Action & Motion: Accusative Case', 'द्वितीया विभक्तिः कर्मकारकम्', 2, 'Grammar', 
'Learn the goal and destination of motion (Dvitīyā Vibhakti / Karma Kāraka).', 
5, 80, 15, 
'{"sections": [{"title": "Object & Destination", "body": "The target of an action takes the accusative marker -म् or -न्: रामः वनं गच्छति (Rama goes to the forest)."}]}'),

(6, 'Verbal Conjugation in Present Tense (Laṭ Lakāra)', 'वर्तमानकाले लट्लकारः', 3, 'Grammar', 
'Master the 9 forms of present tense verbs across 3 persons and 3 numbers.', 
6, 90, 20, 
'{"sections": [{"title": "Endings for Parasmaipada", "endings": ["ति", "तः", "न्ति", "सि", "थः", "थ", "मि", "वः", "मः"]}]}'),

(7, 'Instrumental & Dative Cases', 'तृतीया चतुर्थी च विभक्तयः', 3, 'Grammar', 
'Express instruments (Karaṇa - By/with what) and recipients (Sampradāna - To/for whom).', 
7, 100, 20, 
'{"sections": [{"title": "Instruments (Tṛtīyā)", "example": "अहं लेखन्या लिखामि।"}, {"title": "Recipients (Caturthī)", "example": "माता बालकाय मोदकं ददाति।"}]}'),

(8, 'The Science of Sandhi: Vowel Blending', 'स्वरसन्धि-विज्ञानम्', 4, 'Sandhi', 
'Master the rules of Dīrgha, Guṇa, and Vṛddhi sandhi for natural, flowing pronunciation.', 
8, 110, 20, 
'{"sections": [{"title": "Dīrgha Sandhi", "formula": "अ + अ = आ"}, {"title": "Guṇa Sandhi", "formula": "अ + इ = ए, अ + उ = ओ"}]}'),

(9, 'Computational Sentence Parsing (Kāraka Theory)', 'कारक-सिद्धान्तः वाक्य-विश्लेषणम्', 5, 'Linguistics', 
'Perform computational tree parsing on complex Sanskrit sentences, linking cases to thematic semantic roles.', 
9, 130, 25, 
'{"sections": [{"title": "Computational Dependencies", "body": "How Pāṇinian kāraka grammar directly maps onto modern dependency syntax graphs."}]}'),

(10, 'Classical Literature: The Gītā & Pañcatantra', 'काव्य-साहित्यम् गीता पञ्चतन्त्रं च', 6, 'Literature', 
'Read authentic classical verses with word-by-word grammatical commentary and computational morphological analysis.', 
10, 150, 30, 
'{"sections": [{"verse": "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।", "transliteration": "karmaṇyevādhikāraste mā phaleṣu kadācana.", "meaning": "Your right is to work only, never to its fruits."}]}');

-- 3. Achievements / Badges
INSERT INTO `achievements` (`id`, `badge_code`, `title`, `title_sanskrit`, `description`, `icon_name`, `xp_reward`, `criteria_type`, `threshold`) VALUES
(1, 'FIRST_WORD', 'First Sanskrit Word', 'प्रथम-शब्दः', 'Learned and practiced your first authentic Sanskrit word.', 'Sparkles', 50, 'words_learned', 1),
(2, 'SEVEN_DAY_STREAK', '7 Day Fire Streak', 'सप्त-दिन-दीक्षा', 'Kept your Sanskrit learning flame alive for 7 continuous days.', 'Flame', 150, 'streak_days', 7),
(3, 'CENTURY_WORDS', '100 Words Mastered', 'शत-शब्द-विशारदः', 'Committed 100 Sanskrit words to your active vocabulary bank.', 'BookOpen', 250, 'words_learned', 100),
(4, 'GRAMMAR_MASTER', 'Grammar Master', 'वैयाकरण-शिरोमणिः', 'Successfully cleared all 8 Vibhakti visualizer challenges.', 'Brain', 300, 'grammar_topics', 8),
(5, 'PRONUNCIATION_PRO', 'Pronunciation Explorer', 'स्पष्ट-वाक्', 'Achieved an 85%+ pronunciation score on 10 audio phrases.', 'Mic', 200, 'pronunciation_score', 10),
(6, 'QUIZ_CHAMPION', 'Quiz Champion', 'प्रश्नोत्तर-विजेता', 'Achieved a perfect 100% score on any advanced linguistics quiz.', 'Trophy', 250, 'quiz_accuracy', 100);

-- 4. Initial User Achievements for Demo User
INSERT INTO `user_achievements` (`user_id`, `achievement_id`, `unlocked_at`) VALUES
(1, 1, '2026-09-10 10:00:00'),
(1, 2, '2026-09-17 14:30:00'),
(1, 5, '2026-09-20 18:20:00');

-- 5. Daily Challenge
INSERT INTO `daily_challenges` (`id`, `date_for`, `title`, `title_sanskrit`, `challenge_type`, `challenge_data_json`, `xp_reward`) VALUES
(1, CURDATE(), 'Translate: Knowledge is Power', 'ज्ञानं शक्तिः अस्ति', 'translation', 
'{"english": "Knowledge is power.", "target_sanskrit": "ज्ञानं शक्तिः अस्ति।", "hints": ["ज्ञानम् = Knowledge", "शक्तिः = Power", "अस्ति = Is"]}', 50);

-- 6. User Settings for Demo User
INSERT INTO `user_settings` (`user_id`, `theme`, `graphics_quality`, `audio_speed`, `default_script`, `sound_effects`, `auto_pronounce`, `privacy_public_leaderboard`) VALUES
(1, 'dark', 'high', 1.00, 'both', 1, 1, 1),
(2, 'dark', 'high', 1.00, 'both', 1, 1, 1),
(3, 'light', 'medium', 1.00, 'devanagari', 1, 1, 1),
(4, 'dark', 'high', 1.10, 'iast', 1, 1, 1);

-- 7. Initial Leaderboard
INSERT INTO `leaderboard` (`user_id`, `username`, `avatar`, `total_xp`, `current_level`, `weekly_xp`, `rank`) VALUES
(4, 'dev_pandit', 'avatar_dev.png', 6100, 6, 850, 1),
(2, 'arya_sharma', 'avatar_arya.png', 4820, 5, 720, 2),
(1, 'vidyarthi', 'avatar_student.png', 2450, 3, 490, 3),
(3, 'ananya_roy', 'avatar_ananya.png', 1150, 2, 230, 4);

-- 8. Seed Spaced Repetition (Saved Words) for Demo User
INSERT INTO `saved_words` (`user_id`, `word_id`, `srs_stage`, `ease_factor`, `interval_days`, `correct_count`, `incorrect_count`, `last_reviewed`, `next_review`) VALUES
(1, 1, 3, 2.60, 4, 3, 0, NOW(), DATE_ADD(NOW(), INTERVAL 4 DAY)),
(1, 2, 2, 2.50, 2, 2, 0, NOW(), DATE_ADD(NOW(), INTERVAL 2 DAY)),
(1, 3, 4, 2.70, 7, 4, 0, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY)),
(1, 11, 5, 2.80, 14, 5, 0, NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY)),
(1, 18, 1, 2.40, 1, 1, 1, NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY));
