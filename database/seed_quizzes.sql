-- ==============================================================================
-- SANSKRITVERSE Seed Quizzes
-- Multi-format interactive quiz questions across grammar, vocabulary, and syntax
-- ==============================================================================

USE `sanskritverse`;

INSERT INTO `quiz_questions` (`topic_id`, `category`, `difficulty`, `question_type`, `question_text`, `prompt_sanskrit`, `options_json`, `correct_answer`, `explanation`, `xp_value`) VALUES
-- 1. MCQ Grammar - Cases
(1, 'Grammar', 'beginner', 'mcq', 
'What is the grammatical case (Vibhakti) of the word "रामेण" in the sentence "रामेण बाणः हतः"?', 
'रामेण बाणः हतः।', 
'["प्रथमा (Nominative)", "द्वितीया (Accusative)", "तृतीया (Instrumental)", "पञ्चमी (Ablative)"]', 
'तृतीया (Instrumental)', 
'"रामेण" ends in "ेण", which is the singular instrumental (तृतीया) ending signifying the agent or instrument (By Rama).', 
20),

(1, 'Grammar', 'beginner', 'mcq',
'Which case is used to denote the destination/object in "बालकः वनं गच्छति"?',
'बालकः वनं गच्छति।',
'["प्रथमा (Nominative)", "द्वितीया (Accusative)", "सप्तमी (Locative)", "षष्ठी (Genitive)"]',
'द्वितीया (Accusative)',
'The object or destination of motion takes the accusative case (द्वितीया विभक्तिः), marked by the anusvara/m ending in "वनम्".',
20),

-- 2. Fill in the Blank - Verbs
(2, 'Grammar', 'beginner', 'fill_blank',
'Choose the correct verb form to complete the sentence: "अहं प्रतिदिनं विद्यालयम् ______।"',
'अहं प्रतिदिनं विद्यालयम् ______।',
'["गच्छति", "गच्छसि", "गच्छामि", "गच्छन्ति"]',
'गच्छामि',
'The subject "अहम्" is 1st person singular (उत्तमपुरुषः एकवचनम्), so the verb requires the "-आमि" ending: "गच्छामि".',
25),

(2, 'Grammar', 'intermediate', 'fill_blank',
'Complete the sentence with the correct dual verb: "बालकौ उद्याने ______।"',
'बालकौ उद्याने ______।',
'["क्रीडति", "क्रीडतः", "क्रीडन्ति", "क्रीडामः"]',
'क्रीडतः',
'"बालकौ" is in the dual number (द्विवचनम्, 3rd person). Therefore the verb must take the "-तः" ending: "क्रीडतः".',
25),

-- 3. Translation
(NULL, 'Translation', 'beginner', 'translation',
'Translate the English sentence to Sanskrit: "Knowledge is the supreme strength."',
'Knowledge is the supreme strength.',
'["ज्ञानं परमं बलम्।", "विद्या ददाति विनयम्।", "सूर्यः प्रकाशं ददाति।", "सत्यम् एव जयते।"]',
'ज्ञानं परमं बलम्।',
'"ज्ञानम्" means knowledge, "परमम्" means supreme, and "बलम्" means strength.',
30),

(NULL, 'Translation', 'intermediate', 'translation',
'What is the English translation of "वृक्षात् फलानि पतन्ति"?',
'वृक्षात् फलानि पतन्ति।',
'["Fruits are growing on the tree.", "Fruits fall from the tree.", "The tree yields sweet fruits.", "Leaves are falling from branches."]',
'Fruits fall from the tree.',
'"वृक्षात्" is ablative singular (from the tree), "फलानि" is plural nominative (fruits), and "पतन्ति" means fall.',
30),

-- 4. Sandhi Challenge
(3, 'Sandhi', 'intermediate', 'mcq',
'According to Guṇa Sandhi rules, what is the joined result of: "राम + इति"?',
'राम + इति = ?',
'["रामेति", "रामाइति", "रामोइति", "रामैति"]',
'रामेति',
'The ending vowel "अ" of राम followed by initial vowel "इ" of इति merges into "ए" by Pāṇini sūtra "आद्गुणः", producing "रामेति".',
25),

(3, 'Sandhi', 'intermediate', 'mcq',
'What is the combined form of "विद्या + आलयः"?',
'विद्या + आलयः = ?',
'["विद्यलयः", "विद्यालयः", "विद्यौलयः", "विद्येति"]',
'विद्यालयः',
'Savarna Dīrgha Sandhi: "आ" + "आ" merges into the long vowel "आ", forming "विद्यालयः".',
20),

-- 5. Sentence Arrangement
(NULL, 'Syntax', 'intermediate', 'arrange',
'Arrange the words to form a grammatically correct Sanskrit sentence: [गच्छति, वनम्, रामः]',
'गच्छति | वनम् | रामः',
'["रामः वनं गच्छति।", "वनं गच्छति रामः।", "गच्छति रामः वनम्।", "रामः गच्छति वनम्।"]',
'रामः वनं गच्छति।',
'Standard Sanskrit word order is Subject (रामः) - Object/Goal (वनम्) - Verb (गच्छति), although Sanskrit inflections permit poetic freedom.',
35),

-- 6. Vocabulary Match
(NULL, 'Vocabulary', 'beginner', 'match',
'Match the Sanskrit animal name "गजः" with its English counterpart:',
'गजः = ?',
'["Elephant", "Horse", "Lion", "Peacock"]',
'Elephant',
'"गजः" means Elephant. (अश्वः = Horse, सिंहः = Lion, मयूरः = Peacock).',
15),

-- 7. Timed Lightning Challenge
(1, 'Grammar', 'advanced', 'timed',
'Rapid identification: What case is "पुस्तकेन"? (Answer in under 10 seconds)',
'पुस्तकेन',
'["तृतीया (Instrumental)", "षष्ठी (Genitive)", "पञ्चमी (Ablative)", "सप्तमी (Locative)"]',
'तृतीया (Instrumental)',
'"पुस्तकेन" has the "-एन" instrumental singular ending (With/by means of a book).',
40);
