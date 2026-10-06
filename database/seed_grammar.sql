-- ==============================================================================
-- SANSKRITVERSE Seed Grammar Topics
-- Comprehensive Pāṇinian grammar topics with rules, examples, and inflection models
-- ==============================================================================

USE `sanskritverse`;

INSERT INTO `grammar_topics` (`title_sanskrit`, `title_english`, `category`, `summary`, `rules_json`, `examples_json`, `order_num`) VALUES
-- 1. Eight Cases (Aṣṭa-Vibhaktayaḥ)
('विभक्ति-परिचयः (Aṣṭa-Vibhaktayaḥ)', 'The Eight Sanskrit Cases', 'vibhakti', 
'Sanskrit has eight grammatical cases (vibhaktis) that indicate the role of a noun or pronoun in relation to the verb (kriyā). Each case has singular, dual, and plural numbers.',
'{
  "cases": [
    {
      "case_num": 1,
      "sanskrit_name": "प्रथमा",
      "english_name": "Nominative",
      "karaka": "कर्ता (Agent / Subject)",
      "question": "कः / का / किम् (Who? / What?)",
      "endings_masc": ["ः", "ौ", "ाः"],
      "sample_word": "रामः (Rāmaḥ)",
      "sample_sentence": "रामः वनं गच्छति। (Rama goes to the forest.)"
    },
    {
      "case_num": 2,
      "sanskrit_name": "द्वितीया",
      "english_name": "Accusative",
      "karaka": "कर्म (Object / Goal)",
      "question": "कम् / काम् / किम् (Whom? / Where to?)",
      "endings_masc": ["म्", "ौ", "ान्"],
      "sample_word": "रामम् (Rāmam)",
      "sample_sentence": "बालकः पुस्तकं पठति। (The boy reads a book.)"
    },
    {
      "case_num": 3,
      "sanskrit_name": "तृतीया",
      "english_name": "Instrumental",
      "karaka": "करण (Instrument / By / With)",
      "question": "केन / कया (By / With whom?)",
      "endings_masc": ["ेण", "ाभ्याम्", "ैः"],
      "sample_word": "रामेण (Rāmeṇa)",
      "sample_sentence": "अहं लेखन्या लिखामि। (I write with a pen.)"
    },
    {
      "case_num": 4,
      "sanskrit_name": "चतुर्थी",
      "english_name": "Dative",
      "karaka": "सम्प्रदान (Recipient / For whom)",
      "question": "कस्मै / कस्यै (To / For whom?)",
      "endings_masc": ["ाय", "ाभ्याम्", "ेभ्यः"],
      "sample_word": "रामाय (Rāmāya)",
      "sample_sentence": "माता बालकाय दुग्धं ददाति। (The mother gives milk to the boy.)"
    },
    {
      "case_num": 5,
      "sanskrit_name": "पञ्चमी",
      "english_name": "Ablative",
      "karaka": "अपादान (Source / Separation / From)",
      "question": "कस्मात् / कस्याः (From what / whom?)",
      "endings_masc": ["ात्", "ाभ्याम्", "ेभ्यः"],
      "sample_word": "रामात् (Rāmāt)",
      "sample_sentence": "वृक्षात् फलं पतति। (A fruit falls from the tree.)"
    },
    {
      "case_num": 6,
      "sanskrit_name": "षष्ठी",
      "english_name": "Genitive",
      "karaka": "सम्बन्ध (Possession / Of / ''s)",
      "question": "कस्य / कस्याः (Whose?)",
      "endings_masc": ["स्य", "योः", "ाणाम्"],
      "sample_word": "रामस्य (Rāmasya)",
      "sample_sentence": "इदं रामस्य पुस्तकम् अस्ति। (This is Rama''s book.)"
    },
    {
      "case_num": 7,
      "sanskrit_name": "सप्तमी",
      "english_name": "Locative",
      "karaka": "अधिकरण (Location / In / On / At)",
      "question": "कस्मिन् / कस्याम् / कुत्र (Where? / In what?)",
      "endings_masc": ["े", "योः", "ेषु"],
      "sample_word": "रामे (Rāme)",
      "sample_sentence": "मीनाः जले वसन्ति। (Fish live in water.)"
    },
    {
      "case_num": 8,
      "sanskrit_name": "सम्बोधनम्",
      "english_name": "Vocative",
      "karaka": "सम्बोधन (Addressing / Calling)",
      "question": "हे...",
      "endings_masc": ["हे...", "हे...ौ", "हे...ाः"],
      "sample_word": "हे राम! (He Rāma!)",
      "sample_sentence": "हे गुरो! मां शिक्षय। (O Teacher! Guide me.)"
    }
  ]
}',
'{
  "declension_table_rama": {
    "title": "अकारान्तः पुंलिङ्गः शब्दः - राम",
    "rows": [
      {"case": "प्रथमा", "singular": "रामः", "dual": "रामौ", "plural": "रामाः"},
      {"case": "द्वितीया", "singular": "रामम्", "dual": "रामौ", "plural": "रामान्"},
      {"case": "तृतीया", "singular": "रामेण", "dual": "रामाभ्याम्", "plural": "रामैः"},
      {"case": "चतुर्थी", "singular": "रामाय", "dual": "रामाभ्याम्", "plural": "रामेभ्यः"},
      {"case": "पञ्चमी", "singular": "रामात्", "dual": "रामाभ्याम्", "plural": "रामेभ्यः"},
      {"case": "षष्ठी", "singular": "रामस्य", "dual": "रामयोः", "plural": "रामाणाम्"},
      {"case": "सप्तमी", "singular": "रामे", "dual": "रामयोः", "plural": "रामेषु"},
      {"case": "सम्बोधनम्", "singular": "हे राम", "dual": "हे रामौ", "plural": "हे रामाः"}
    ]
  }
}', 1),

-- 2. Verbal Roots (Dhātu-Prakaraṇam)
('धातु-परिचयः (Dhātu & Lakāra)', 'Verbal Roots & Conjugations', 'dhatu',
'Every Sanskrit verb stems from a root (Dhātu). Verbs conjugate across 10 tenses/moods (Lakāras), 3 persons (Prathama, Madhyama, Uttama), and 3 numbers (Eka, Dvi, Bahu).',
'{
  "dhatus": [
    {
      "root": "गम् (gam)",
      "gana": "भ्वादि (1st)",
      "meaning": "To go",
      "present_stem": "गच्छ् (gacch)",
      "lat_present": [
        {"person": "प्रथमः (3rd)", "singular": "गच्छति", "dual": "गच्छतः", "plural": "गच्छन्ति"},
        {"person": "मध्यमः (2nd)", "singular": "गच्छसि", "dual": "गच्छथः", "plural": "गच्छथ"},
        {"person": "उत्तमः (1st)", "singular": "गच्छामि", "dual": "गच्छावः", "plural": "गच्छामः"}
      ],
      "lang_past": [
        {"person": "प्रथमः (3rd)", "singular": "अगच्छत्", "dual": "अगच्छताम्", "plural": "अगच्छन्"},
        {"person": "मध्यमः (2nd)", "singular": "अगच्छः", "dual": "अगच्छतम्", "plural": "अगच्छत"},
        {"person": "उत्तमः (1st)", "singular": "अगच्छम्", "dual": "अगच्छाव", "plural": "अगच्छाम"}
      ],
      "lrit_future": [
        {"person": "प्रथमः (3rd)", "singular": "गमिष्यति", "dual": "गमिष्यतः", "plural": "गमिष्यन्ति"},
        {"person": "मध्यमः (2nd)", "singular": "गमिष्यसि", "dual": "गमिष्यथः", "plural": "गमिष्यथ"},
        {"person": "उत्तमः (1st)", "singular": "गमिष्यामि", "dual": "गमिष्यावः", "plural": "गमिष्यामः"}
      ],
      "kridanta": {
        "past_passive": "गतः (gone)",
        "gerund_ktva": "गत्वा (having gone)",
        "infinitive_tumun": "गन्तुम् (in order to go)",
        "noun_bhavat": "गमनम् (the act of going)"
      }
    },
    {
      "root": "पठ् (paṭh)",
      "gana": "भ्वादि (1st)",
      "meaning": "To read / study",
      "present_stem": "पठ् (paṭh)",
      "lat_present": [
        {"person": "प्रथमः (3rd)", "singular": "पठति", "dual": "पठतः", "plural": "पठन्ति"},
        {"person": "मध्यमः (2nd)", "singular": "पठसि", "dual": "पठथः", "plural": "पठथ"},
        {"person": "उत्तमः (1st)", "singular": "पठामि", "dual": "पठावः", "plural": "पठामः"}
      ],
      "kridanta": {
        "past_passive": "पठितः",
        "gerund_ktva": "पठित्वा",
        "infinitive_tumun": "पठितुम्",
        "noun_bhavat": "पठनम्"
      }
    },
    {
      "root": "भू (bhū)",
      "gana": "भ्वादि (1st)",
      "meaning": "To be / become",
      "present_stem": "भव् (bhav)",
      "lat_present": [
        {"person": "प्रथमः (3rd)", "singular": "भवति", "dual": "भवतः", "plural": "भवन्ति"},
        {"person": "मध्यमः (2nd)", "singular": "भवसि", "dual": "भवथः", "plural": "भवथ"},
        {"person": "उत्तमः (1st)", "singular": "भवामि", "dual": "भवावः", "plural": "भवामः"}
      ],
      "kridanta": {
        "past_passive": "भूतः",
        "gerund_ktva": "भूत्वा",
        "infinitive_tumun": "भवितुम्",
        "noun_bhavat": "भवनम्"
      }
    }
  ]
}',
'{
  "usage_examples": [
    {"sentence": "अहं संस्कृतं पठामि।", "meaning": "I study Sanskrit."},
    {"sentence": "त्वं कुत्र गच्छसि?", "meaning": "Where are you going?"},
    {"sentence": "सत्यम् एव जयते।", "meaning": "Truth alone triumphs."}
  ]
}', 2),

-- 3. Sandhi Lab
('सन्धि-प्रकरणम् (Sandhi Lab)', 'Phonetic Conjunction Rules', 'sandhi',
'Sandhi is the euphonic blending of sounds at word boundaries or within a word. It preserves natural acoustic harmony in vocal articulation.',
'{
  "categories": [
    {
      "name": "स्वरसन्धिः (Vowel Sandhi)",
      "rules": [
        {
          "sutra": "अकः सवर्णे दीर्घः (Pāṇini 6.1.101)",
          "name": "Savarna Dīrgha Sandhi",
          "rule_text": "When similar simple vowels meet (a+a, i+i, u+u, ṛ+ṛ), they merge into their corresponding long vowel (ā, ī, ū, ṝ).",
          "formula": "अ/आ + अ/आ = आ | इ/ई + इ/ई = ई | उ/ऊ + उ/ऊ = ऊ",
          "examples": [
            {"input": "विद्या + आलयः", "intermediate": "विद्या + आलयः -> विद्यालयः", "output": "विद्यालयः", "meaning": "Abode of learning (School)"},
            {"input": "गिरि + ईशः", "intermediate": "गिरि + ईशः -> गिरीशः", "output": "गिरीशः", "meaning": "Lord of mountains"},
            {"input": "भानु + उदयः", "intermediate": "भानु + उदयः -> भानूदयः", "output": "भानूदयः", "meaning": "Sunrise"}
          ]
        },
        {
          "sutra": "आद्गुणः (Pāṇini 6.1.87)",
          "name": "Guṇa Sandhi",
          "rule_text": "When a or ā is followed by i/ī, u/ū, or ṛ/ṝ, the combination turns into e, o, or ar respectively.",
          "formula": "अ/आ + इ/ई = ए | अ/आ + उ/ऊ = ओ | अ/आ + ऋ/ॠ = अर्",
          "examples": [
            {"input": "राम + इति", "intermediate": "राम (अ) + इति (इ) -> ए", "output": "रामेति", "meaning": "Thus said Rama"},
            {"input": "महा + उत्सवः", "intermediate": "महा (आ) + उत्सवः (उ) -> ओ", "output": "महोत्सवः", "meaning": "Great festival"},
            {"input": "महा + ऋषिः", "intermediate": "महा (आ) + ऋषिः (ऋ) -> अर्", "output": "महर्षिः", "meaning": "Great sage"}
          ]
        },
        {
          "sutra": "वृद्धिरेचि (Pāṇini 6.1.88)",
          "name": "Vṛddhi Sandhi",
          "rule_text": "When a or ā is followed by e/ai, they merge into ai; when followed by o/au, they merge into au.",
          "formula": "अ/आ + ए/ऐ = ऐ | अ/आ + ओ/औ = औ",
          "examples": [
            {"input": "एक + एकम्", "intermediate": "एक (अ) + एकम् (ए) -> ऐ", "output": "एकैकम्", "meaning": "One by one"},
            {"input": "महा + औषधिः", "intermediate": "महा (आ) + औषधिः (ओ) -> औ", "output": "महौषधिः", "meaning": "Great medicine"}
          ]
        },
        {
          "sutra": "इको यणचि (Pāṇini 6.1.77)",
          "name": "Yaṇ Sandhi",
          "rule_text": "When i/ī, u/ū, ṛ/ṝ, or ḷ are followed by any dissimilar vowel, they change into y, v, r, l.",
          "formula": "इ/ई + स्वर = य् | उ/ऊ + स्वर = व् | ऋ + स्वर = र्",
          "examples": [
            {"input": "इति + आदि", "intermediate": "इत् (इ) + आदि -> इत्य् + आदि", "output": "इत्यादि", "meaning": "Et cetera / And so on"},
            {"input": "सु + आगतम्", "intermediate": "स् (उ) + आगतम् -> स्वा + गतम्", "output": "स्वागतम्", "meaning": "Welcome"}
          ]
        }
      ]
    },
    {
      "name": "विसर्गसन्धिः (Visarga Sandhi)",
      "rules": [
        {
          "sutra": "अतो रोरप्लुतादप्लुते (Pāṇini 6.1.113)",
          "name": "Utva Visarga Sandhi",
          "rule_text": "When a short ''a'' is followed by visarga and another short ''a'', the visarga becomes ''u'' and merges into ''o'', with the second ''a'' elided into avagraha (ऽ).",
          "formula": "अः + अ = ओऽ",
          "examples": [
            {"input": "कः + अयम्", "intermediate": "कः + अयम् -> कोऽयम्", "output": "कोऽयम्", "meaning": "Who is this?"},
            {"input": "सो + अहम्", "intermediate": "सः + अहम् -> सोऽहम्", "output": "सोऽहम्", "meaning": "I am That"}
          ]
        }
      ]
    }
  ]
}',
'{
  "practice_pairs": [
    {"p1": "नर", "p2": "ईशः", "expected": "नरेशः", "type": "Guṇa"},
    {"p1": "तथा", "p2": "एव", "expected": "तथैव", "type": "Vṛddhi"},
    {"p1": "प्रति", "p2": "एकम्", "expected": "प्रत्येकम्", "type": "Yaṇ"}
  ]
}', 3),

-- 4. Samāsa (Compound Words)
('समास-विचारः (Samāsa Academy)', 'Compound Words Classification', 'samasa',
'Samāsa is compounding multiple words into a single semantic unit while dropping case affixes.',
'{
  "types": [
    {"name": "तत्पुरुषः (Tatpuruṣa)", "desc": "Determinative compound where the second member (uttarapada) is principal. E.g. राजपुरुषः (King''s man)."},
    {"name": "कर्मधारयः (Karmadhāraya)", "desc": "Descriptive noun-adjective or appositional compound. E.g. नीलोत्पलम् (Blue lotus)."},
    {"name": "द्विगुः (Dvigu)", "desc": "Numeral compound whose first word denotes count. E.g. त्रिलोकम् (The three worlds)."},
    {"name": "द्वन्द्वः (Dvandva)", "desc": "Copulative compound where all elements are equally principal (''and''). E.g. रामलक्ष्मणौ (Rama and Lakshmana)."},
    {"name": "बहुव्रीहिः (Bahuvrīhi)", "desc": "Exocentric compound referring to an external entity not named directly. E.g. पीताम्बरः (One wearing yellow garments, i.e., Krishna)."},
    {"name": "अव्ययीभावः (Avyayībhāva)", "desc": "Indeclinable compound where the first member is an indeclinable prefix. E.g. प्रतिदिनम् (Every day)."}
  ]
}',
'{"examples": ["राजपुरुषः", "नीलकमलम्", "पञ्चवटी", "मातापितरौ", "दशाननः", "यथाशक्ति"]}', 4);
