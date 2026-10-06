-- ==============================================================================
-- SANSKRITVERSE Seed Vocabulary
-- Authentic Sanskrit words across categories with IAST, roots, and examples
-- ==============================================================================

USE `sanskritverse`;

INSERT INTO `vocabulary` (`devanagari`, `iast`, `english`, `word_type`, `gender`, `category`, `root`, `audio_url`, `example_sanskrit`, `example_iast`, `example_english`, `difficulty`) VALUES
-- 1. Nature & Elements
('सूर्यः', 'sūryaḥ', 'Sun', 'noun', 'masculine', 'Nature', 'सू (sū)', '/audio/surya.mp3', 'सूर्यः पूर्वे उदेति।', 'sūryaḥ pūrve udeti.', 'The sun rises in the east.', 'beginner'),
('चन्द्रः', 'candraḥ', 'Moon', 'noun', 'masculine', 'Nature', 'चन्द् (cand)', '/audio/candra.mp3', 'रात्रौ चन्द्रः प्रकाशते।', 'rātrau candraḥ prakāśate.', 'The moon shines at night.', 'beginner'),
('जलम्', 'jalam', 'Water', 'noun', 'neuter', 'Nature', 'जल् (jal)', '/audio/jalam.mp3', 'जलम् एव जीवनम्।', 'jalam eva jīvanam.', 'Water alone is life.', 'beginner'),
('अग्निः', 'agniḥ', 'Fire', 'noun', 'masculine', 'Nature', 'अग् (ag)', '/audio/agni.mp3', 'अग्निः सर्वं दहति।', 'agniḥ sarvaṃ dahati.', 'Fire burns everything.', 'beginner'),
('वायुः', 'vāyuḥ', 'Wind / Air', 'noun', 'masculine', 'Nature', 'वा (vā)', '/audio/vayu.mp3', 'शीतलः वायुः वहति।', 'śītalaḥ vāyuḥ vahati.', 'Cool breeze is blowing.', 'beginner'),
('भूमिः', 'bhūmiḥ', 'Earth / Soil', 'noun', 'feminine', 'Nature', 'भू (bhū)', '/audio/bhumi.mp3', 'माता भूमिः पुत्रोऽहं पृथिव्याः।', 'mātā bhūmiḥ putro''haṃ pṛthivyāḥ.', 'The Earth is my mother, I am the son of Earth.', 'intermediate'),
('वृक्षः', 'vṛkṣaḥ', 'Tree', 'noun', 'masculine', 'Nature', 'व्रश्च् (vraśc)', '/audio/vriksha.mp3', 'वृक्षाः फलानि यच्छन्ति।', 'vṛkṣāḥ phalāni yacchanti.', 'Trees give fruits.', 'beginner'),
('पर्वतः', 'parvataḥ', 'Mountain', 'noun', 'masculine', 'Nature', 'पर्व् (parv)', '/audio/parvata.mp3', 'हिमालयः उच्चः पर्वतः अस्ति।', 'himālayaḥ uccaḥ parvataḥ asti.', 'Himalaya is a tall mountain.', 'beginner'),
('नदी', 'nadī', 'River', 'noun', 'feminine', 'Nature', 'नद् (nad)', '/audio/nadi.mp3', 'गङ्गा पवित्रा नदी अस्ति।', 'gaṅgā pavitrā nadī asti.', 'Ganga is a holy river.', 'beginner'),
('मेघः', 'meghaḥ', 'Cloud', 'noun', 'masculine', 'Nature', 'मिह् (mih)', '/audio/megha.mp3', 'मेघः जलं वर्षति।', 'meghaḥ jalaṃ varṣati.', 'The cloud rains water.', 'intermediate'),

-- 2. Daily Life & Greetings
('नमस्ते', 'namaste', 'Greetings / Salutations to you', 'indeclinable', 'none', 'Daily Life', 'नम् (nam)', '/audio/namaste.mp3', 'नमस्ते, कथम् अस्ति भवान्?', 'namaste, katham asti bhavān?', 'Greetings, how are you (sir)?', 'beginner'),
('धन्यवादः', 'dhanyavādaḥ', 'Thank you', 'noun', 'masculine', 'Daily Life', 'धन् (dhan)', '/audio/dhanyavadah.mp3', 'भवते हार्दिकः धन्यवादः।', 'bhavate hārdikaḥ dhanyavādaḥ.', 'Heartfelt thanks to you.', 'beginner'),
('कृपया', 'kṛpayā', 'Please', 'indeclinable', 'none', 'Daily Life', 'कृप् (kṛp)', '/audio/kripaya.mp3', 'कृपया अत्र आगच्छतु।', 'kṛpayā atra āgacchatu.', 'Please come here.', 'beginner'),
('स्वागतम्', 'svāgatam', 'Welcome', 'noun', 'neuter', 'Daily Life', 'गम् (gam)', '/audio/svagatam.mp3', 'अस्माकं गृहे भवतां स्वागतम्।', 'asmākaṃ gṛhe bhavatāṃ svāgatam.', 'Welcome to our home.', 'beginner'),
('आम्', 'ām', 'Yes', 'indeclinable', 'none', 'Daily Life', NULL, '/audio/am.mp3', 'आम्, अहं संस्कृतं जानामि।', 'ām, ahaṃ saṃskṛtaṃ jānāmi.', 'Yes, I know Sanskrit.', 'beginner'),
('न', 'na', 'No / Not', 'indeclinable', 'none', 'Daily Life', NULL, '/audio/na.mp3', 'न, अहं न गच्छामि।', 'na, ahaṃ na gacchāmi.', 'No, I am not going.', 'beginner'),
('पुनर्मिलामः', 'punarmilāmaḥ', 'See you again / Until next time', 'verb', 'none', 'Daily Life', 'मिल (mil)', '/audio/punarmilamah.mp3', 'अद्य विरामः, श्वः पुनर्मिलामः।', 'adya virāmaḥ, śvaḥ punarmilāmaḥ.', 'Break today, see you again tomorrow.', 'beginner'),

-- 3. School & Education
('ज्ञानम्', 'jñānam', 'Knowledge', 'noun', 'neuter', 'School', 'ज्ञा (jñā)', '/audio/jnanam.mp3', 'ज्ञानं परमं बलम्।', 'jñānaṃ paramaṃ balam.', 'Knowledge is the supreme strength.', 'beginner'),
('विद्या', 'vidyā', 'Learning / Wisdom', 'noun', 'feminine', 'School', 'विद् (vid)', '/audio/vidya.mp3', 'विद्या ददाति विनयम्।', 'vidyā dadāti vinayam.', 'Learning bestows humility.', 'beginner'),
('गुरुः', 'guruḥ', 'Teacher / Master', 'noun', 'masculine', 'School', 'गृ (gṛ)', '/audio/guruh.mp3', 'गुरुः साक्षात् परब्रह्म।', 'guruḥ sākṣāt parabrahma.', 'The guru is verily supreme consciousness.', 'beginner'),
('शिष्यः', 'śiṣyaḥ', 'Student / Disciple', 'noun', 'masculine', 'School', 'शास् (śās)', '/audio/shishyah.mp3', 'शिष्यः गुरोः पाठं शृणोति।', 'śiṣyaḥ guroḥ pāṭhaṃ śṛṇoti.', 'The student listens to the teacher''s lesson.', 'beginner'),
('पुस्तकम्', 'pustakam', 'Book', 'noun', 'neuter', 'School', 'पुस्त् (pust)', '/audio/pustakam.mp3', 'बालकः पुस्तकं पठति।', 'bālakaḥ pustakaṃ paṭhati.', 'The boy reads a book.', 'beginner'),
('विद्यालयः', 'vidyālayaḥ', 'School', 'noun', 'masculine', 'School', 'विद् + आलय', '/audio/vidyalayah.mp3', 'छात्राः विद्यालयं गच्छन्ति।', 'chātrāḥ vidyālayaṃ gacchanti.', 'Students go to school.', 'beginner'),
('लेखनी', 'lekhanī', 'Pen', 'noun', 'feminine', 'School', 'लिख् (likh)', '/audio/lekhani.mp3', 'मम समीपे एका उत्तमा लेखनी अस्ति।', 'mama samīpe ekā uttamā lekhanī asti.', 'I have an excellent pen.', 'beginner'),

-- 4. Family & Relations
('माता', 'mātā', 'Mother', 'noun', 'feminine', 'Family', 'मा (mā)', '/audio/mata.mp3', 'माता पुत्रं स्नेहयति।', 'mātā putraṃ snehayati.', 'Mother loves the son.', 'beginner'),
('पिता', 'pitā', 'Father', 'noun', 'masculine', 'Family', 'पा (pā)', '/audio/pita.mp3', 'पिता धर्मः पिता स्वर्गः।', 'pitā dharmaḥ pitā svargaḥ.', 'Father is duty, father is heaven.', 'beginner'),
('भ्राता', 'bhrātā', 'Brother', 'noun', 'masculine', 'Family', 'भृ (bhṛ)', '/audio/bhrata.mp3', 'सः मम ज्येष्ठः भ्राता।', 'saḥ mama jyeṣṭhaḥ bhrātā.', 'He is my elder brother.', 'beginner'),
('भगिनी', 'bhaginī', 'Sister', 'noun', 'feminine', 'Family', 'भज् (bhaj)', '/audio/bhagini.mp3', 'भगिनी मधुरं गायति।', 'bhaginī madhuraṃ gāyati.', 'Sister sings melodiously.', 'beginner'),
('मित्रम्', 'mitram', 'Friend', 'noun', 'neuter', 'Family', 'मिद् (mid)', '/audio/mitram.mp3', 'सत्यं मित्रं दुर्लभम्।', 'satyaṃ mitraṃ durlabham.', 'A true friend is rare.', 'beginner'),

-- 5. Animals
('गजः', 'gajaḥ', 'Elephant', 'noun', 'masculine', 'Animals', 'गज् (gaj)', '/audio/gajah.mp3', 'गजः मन्दं मन्दं चलति।', 'gajaḥ mandaṃ mandaṃ calati.', 'The elephant walks slowly.', 'beginner'),
('सिंहः', 'siṃhaḥ', 'Lion', 'noun', 'masculine', 'Animals', 'हिंस् (hiṃs)', '/audio/simhah.mp3', 'सिंहः वनस्य राजा अस्ति।', 'siṃhaḥ vanasya rājā asti.', 'The lion is the king of the forest.', 'beginner'),
('अश्वः', 'aśvaḥ', 'Horse', 'noun', 'masculine', 'Animals', 'अश् (aś)', '/audio/ashvah.mp3', 'अश्वः वेगेन धावति।', 'aśvaḥ vegena dhāvati.', 'The horse runs with great speed.', 'beginner'),
('धेनुः', 'dhenuḥ', 'Cow', 'noun', 'feminine', 'Animals', 'धे (dhe)', '/audio/dhenuh.mp3', 'धेनुः दुग्धं ददाति।', 'dhenuḥ dugdhaṃ dadāti.', 'The cow gives milk.', 'beginner'),
('मयूरः', 'mayūraḥ', 'Peacock', 'noun', 'masculine', 'Animals', 'मी (mī)', '/audio/mayurah.mp3', 'मयूरः वर्षाकाले नृत्यति।', 'mayūraḥ varṣākāle nṛtyati.', 'The peacock dances in the rainy season.', 'beginner'),

-- 6. Numbers (Saṅkhyāḥ)
('एकम्', 'ekam', 'One (1)', 'noun', 'neuter', 'Numbers', 'इ (i)', '/audio/ekam.mp3', 'एकं सद् विप्रा बहुधा वदन्ति।', 'ekaṃ sad viprā bahudhā vadanti.', 'Truth is one, wise people call it by many names.', 'beginner'),
('द्वे', 'dve', 'Two (2)', 'noun', 'neuter', 'Numbers', 'द्वि (dvi)', '/audio/dve.mp3', 'द्वे नेत्रे पश्यतः।', 'dve netre paśyataḥ.', 'Two eyes see.', 'beginner'),
('त्रीणि', 'trīṇi', 'Three (3)', 'noun', 'neuter', 'Numbers', 'त्रि (tri)', '/audio/trini.mp3', 'त्रिषु लोकेषु प्रसिद्धः।', 'triṣu lokeṣu prasiddhaḥ.', 'Renowned across the three worlds.', 'beginner'),
('चत्वारि', 'catvāri', 'Four (4)', 'noun', 'neuter', 'Numbers', 'चतुर् (catur)', '/audio/catvari.mp3', 'चत्वारः वेदाः सन्ति।', 'catvāraḥ vedāḥ santi.', 'There are four Vedas.', 'beginner'),
('पञ्च', 'pañca', 'Five (5)', 'noun', 'indeclinable', 'Numbers', 'पञ्चन् (pañcan)', '/audio/panca.mp3', 'पञ्च महाभूतानि सन्ति।', 'pañca mahābhūtāni santi.', 'There are five great elements.', 'beginner'),
('दश', 'daśa', 'Ten (10)', 'noun', 'indeclinable', 'Numbers', 'दशन् (daśan)', '/audio/dasha.mp3', 'दश दिशः व्याप्य स्थिता।', 'daśa diśaḥ vyāpya sthitā.', 'Pervading all ten directions.', 'beginner'),
('शतम्', 'śatam', 'Hundred (100)', 'noun', 'neuter', 'Numbers', 'शत (śata)', '/audio/shatam.mp3', 'जीवेम शरदः शतम्।', 'jīvema śaradaḥ śatam.', 'May we live for a hundred autumns.', 'intermediate'),

-- 7. Body Parts (Aṅgāni)
('शिरः', 'śiraḥ', 'Head', 'noun', 'neuter', 'Body', 'शी (śī)', '/audio/shirah.mp3', 'शिरः उन्नतम् अस्तु।', 'śiraḥ unnatam astu.', 'May the head be held high.', 'intermediate'),
('नेत्रम्', 'netram', 'Eye', 'noun', 'neuter', 'Body', 'नी (nī)', '/audio/netram.mp3', 'नेत्रं ज्ञानस्य साधनम्।', 'netraṃ jñānasya sādhanam.', 'The eye is an instrument of knowledge.', 'beginner'),
('हस्तः', 'hastaḥ', 'Hand', 'noun', 'masculine', 'Body', 'हस् (has)', '/audio/hastah.mp3', 'हस्तस्य भूषणं दानम्।', 'hastasya bhūṣaṇaṃ dānam.', 'The ornament of the hand is charity.', 'beginner'),
('हृदयम्', 'hṛdayam', 'Heart', 'noun', 'neuter', 'Body', 'हृ (hṛ)', '/audio/hridayam.mp3', 'शुद्धं हृदयं भगवतो मन्दिरम्।', 'śuddhaṃ hṛdayaṃ bhagavato mandiram.', 'A pure heart is the temple of the divine.', 'intermediate'),
('कर्णः', 'karṇaḥ', 'Ear', 'noun', 'masculine', 'Body', 'कृ (kṛ)', '/audio/karnah.mp3', 'कर्णाभ्यां सुवचनं शृणु।', 'karṇābhyāṃ suvacanaṃ śṛṇu.', 'Hear good words with both ears.', 'beginner'),

-- 8. Computational Linguistics & Technology
('सङ्गणकम्', 'saṅgaṇakam', 'Computer', 'noun', 'neuter', 'Technology', 'गन् (gaṇ)', '/audio/sanganakam.mp3', 'अहं सङ्गणकेन संस्कृतं पाठयामि।', 'ahaṃ saṅgaṇakena saṃskṛtaṃ pāṭhayāmi.', 'I teach Sanskrit using a computer.', 'intermediate'),
('जालम्', 'jālam', 'Network / Web', 'noun', 'neuter', 'Technology', 'जल् (jal)', '/audio/jalam_net.mp3', 'अन्तर्जालम् अतीव विस्तृतम्।', 'antarjālam atīva vistṛtam.', 'The internet is vast.', 'intermediate'),
('भाषाविज्ञानम्', 'bhāṣāvijñānam', 'Linguistics', 'noun', 'neuter', 'Science', 'भाष् + विद्', '/audio/bhasavijnanam.mp3', 'संस्कृतं भाषाविज्ञानस्य मूलम्।', 'saṃskṛtaṃ bhāṣāvijñānasya mūlam.', 'Sanskrit is the root of linguistics.', 'advanced'),
('पदच्छेदः', 'padacchedaḥ', 'Tokenization / Word Separation', 'noun', 'masculine', 'Science', 'छिद् (chid)', '/audio/padacchedah.mp3', 'पदच्छेदेन अर्थः स्पष्टः भवति।', 'padacchedena arthaḥ spaṣṭaḥ bhavati.', 'By word separation, meaning becomes crystal clear.', 'advanced'),
('प्रत्ययः', 'pratyayaḥ', 'Suffix / Affix', 'noun', 'masculine', 'Science', 'प्रति + इ (prati + i)', '/audio/pratyayah.mp3', 'धातुभ्यः प्रत्ययाः योज्यन्ते।', 'dhātubhyaḥ pratyayāḥ yojyante.', 'Suffixes are affixed to verbal roots.', 'advanced'),
('धातुः', 'dhātuḥ', 'Verbal Root', 'noun', 'masculine', 'Science', 'धा (dhā)', '/audio/dhatuh.mp3', 'संस्कृते द्विसहस्राधिकाः धातवः सन्ति।', 'saṃskṛte dvisahasrādhikāḥ dhātavaḥ santi.', 'There are over two thousand verbal roots in Sanskrit.', 'advanced');
