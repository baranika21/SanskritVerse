// ==============================================================================
// SANSKRITVERSE Computational Linguistics Engine
// Transliteration, Tokenization, Morphological Analysis, and Kāraka Dependency Parsing
// ==============================================================================

export type TransliterationScheme =
  | 'devanagari'
  | 'iast'
  | 'hk'
  | 'slp1'
  | 'tamil'
  | 'telugu'
  | 'kannada'
  | 'malayalam'
  | 'bengali';

export interface MorphologicalToken {
  token: string;
  iast: string;
  cleanToken: string;
  partOfSpeech: 'noun' | 'verb' | 'pronoun' | 'indeclinable' | 'adjective' | 'particle' | 'unknown';
  root?: string;
  stem?: string;
  gender?: 'masculine' | 'feminine' | 'neuter' | 'none';
  case?: 'Prathamā' | 'Dvitīyā' | 'Tṛtīyā' | 'Caturthī' | 'Pañcamī' | 'Ṣaṣṭhī' | 'Saptamī' | 'Sambodhana' | 'none';
  number?: 'singular' | 'dual' | 'plural' | 'none';
  person?: '1st (Uttama)' | '2nd (Madhyama)' | '3rd (Prathama)' | 'none';
  tense?: 'Laṭ (Present)' | 'Laṅ (Imperfect Past)' | 'Lṛṭ (Simple Future)' | 'Loṭ (Imperative)' | 'Vidhiliṅ (Optative)' | 'none';
  karakaRole?: 'Kartā (Subject)' | 'Karma (Object)' | 'Karaṇa (Instrument)' | 'Sampradāna (Dative)' | 'Apādāna (Ablative)' | 'Sambandha (Genitive)' | 'Adhikaraṇa (Locative)' | 'Kriyā (Verb)' | 'none';
  englishGloss: string;
  explanation: string;
}

export interface DependencyNode {
  id: string;
  label: string;
  iast: string;
  role: string;
  pos: string;
}

export interface DependencyLink {
  source: string;
  target: string;
  relation: string;
  description: string;
}

export interface SentenceAnalysisResult {
  originalSentence: string;
  iast: string;
  tokens: MorphologicalToken[];
  dependencyGraph: {
    nodes: DependencyNode[];
    links: DependencyLink[];
  };
  syntacticStructure: string;
  englishTranslation: string;
}

export interface MultilingualTranslationResult {
  originalText: string;
  sourceLang: string;
  targetLang: string;
  sanskritDevanagari: string;
  sanskritIast: string;
  sanskritNativeScript?: string;
  translatedText: string;
  gloss: Array<{
    sourceWord: string;
    sanskritWord: string;
    iast: string;
    role: string;
    meaning: string;
  }>;
  explanation: string;
}

export class ComputationalLinguistics {
  // Transliteration Mappings
  private static devanagariToIastMap: Record<string, string> = {
    'अ': 'a', 'आ': 'ā', 'इ': 'i', 'ई': 'ī', 'उ': 'u', 'ऊ': 'ū', 'ऋ': 'ṛ', 'ॠ': 'ṝ',
    'ऌ': 'ḷ', 'ॡ': 'ḹ', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au',
    'क': 'ka', 'ख': 'kha', 'ग': 'ga', 'घ': 'gha', 'ङ': 'ṅa',
    'च': 'ca', 'छ': 'cha', 'ज': 'ja', 'झ': 'jha', 'ञ': 'ña',
    'ट': 'ṭa', 'ठ': 'ṭha', 'ड': 'ḍa', 'ढ': 'ḍha', 'ण': 'ṇa',
    'त': 'ta', 'थ': 'tha', 'द': 'da', 'ध': 'dha', 'न': 'na',
    'प': 'pa', 'फ': 'pha', 'ब': 'ba', 'भ': 'bha', 'म': 'ma',
    'य': 'ya', 'र': 'ra', 'ल': 'la', 'व': 'va',
    'श': 'śa', 'ष': 'ṣa', 'स': 'sa', 'ह': 'ha',
    'ा': 'ā', 'ि': 'i', 'ी': 'ī', 'ु': 'u', 'ू': 'ū', 'ृ': 'ṛ', 'ॄ': 'ṝ',
    'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', '्': '', 'ं': 'ṃ', 'ः': 'ḥ', 'ऽ': '\''
  };

  private static iastToDevanagariMap: Record<string, string> = {
    'a': 'अ', 'ā': 'आ', 'i': 'इ', 'ī': 'ई', 'u': 'उ', 'ū': 'ऊ', 'ṛ': 'ऋ', 'ṝ': 'ॠ',
    'ḷ': 'ऌ', 'e': 'ए', 'ai': 'ऐ', 'o': 'ओ', 'au': 'औ',
    'k': 'क्', 'kh': 'ख्', 'g': 'ग्', 'gh': 'घ्', 'ṅ': 'ङ्',
    'c': 'च्', 'ch': 'छ्', 'j': 'ज्', 'jh': 'झ्', 'ñ': 'ञ्',
    'ṭ': 'ट्', 'ṭh': 'ठ्', 'ḍ': 'ड्', 'ḍh': 'ढ्', 'ṇ': 'ण्',
    't': 'त्', 'th': 'थ्', 'd': 'द्', 'dh': 'ध्', 'n': 'न्',
    'p': 'प्', 'ph': 'फ्', 'b': 'ब्', 'bh': 'भ्', 'm': 'म्',
    'y': 'य्', 'r': 'र्', 'l': 'ल्', 'v': 'व्',
    'ś': 'श्', 'ṣ': 'ष्', 's': 'स्', 'h': 'ह्',
    'ṃ': 'ं', 'ḥ': 'ः'
  };

  /**
   * Universal Transliteration Engine supporting Devanagari, IAST, HK, SLP1, Tamil, Telugu, Kannada, Malayalam, Bengali
   */
  public static transliterate(input: string, from: TransliterationScheme, to: TransliterationScheme): string {
    if (!input || from === to) return input;

    // Convert from Indic source scripts to Devanagari if needed
    let devanagari = input;
    if (from === 'tamil') {
      devanagari = this.indicToDevanagari(input, 'tamil');
    } else if (from === 'telugu') {
      devanagari = this.indicToDevanagari(input, 'telugu');
    } else if (from === 'kannada') {
      devanagari = this.indicToDevanagari(input, 'kannada');
    } else if (from === 'malayalam') {
      devanagari = this.indicToDevanagari(input, 'malayalam');
    } else if (from === 'bengali') {
      devanagari = this.indicToDevanagari(input, 'bengali');
    } else if (from === 'iast') {
      devanagari = this.iastToDevanagari(input);
    } else if (from === 'hk') {
      devanagari = this.iastToDevanagari(this.hkToIast(input));
    } else if (from === 'slp1') {
      devanagari = this.iastToDevanagari(this.slp1ToIast(input));
    }

    // Convert from Devanagari to target script
    if (to === 'devanagari') return devanagari;
    if (to === 'iast') return this.devanagariToIast(devanagari);
    if (to === 'hk') return this.iastToHk(this.devanagariToIast(devanagari));
    if (to === 'slp1') return this.iastToSlp1(this.devanagariToIast(devanagari));
    if (to === 'tamil' || to === 'telugu' || to === 'kannada' || to === 'malayalam' || to === 'bengali') {
      return this.devanagariToIndic(devanagari, to);
    }

    return devanagari;
  }

  public static devanagariToIast(text: string): string {
    const vowelsIndependent: Record<string, string> = {
      'अ': 'a', 'आ': 'ā', 'इ': 'i', 'ई': 'ī', 'उ': 'u', 'ऊ': 'ū', 'ऋ': 'ṛ', 'ॠ': 'ṝ',
      'ऌ': 'ḷ', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au'
    };
    const matras: Record<string, string> = {
      'ा': 'ā', 'ि': 'i', 'ी': 'ī', 'ु': 'u', 'ू': 'ū', 'ृ': 'ṛ', 'ॄ': 'ṝ',
      'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au'
    };
    const consonants: Record<string, string> = {
      'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ṅ',
      'च': 'c', 'छ': 'ch', 'ज': 'j', 'झ': 'jh', 'ञ': 'ñ',
      'ट': 'ṭ', 'ठ': 'ṭh', 'ड': 'ḍ', 'ढ': 'ḍh', 'ण': 'ṇ',
      'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
      'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
      'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v',
      'श': 'ś', 'ष': 'ṣ', 'स': 's', 'ह': 'h'
    };

    let result = '';
    const len = text.length;

    for (let i = 0; i < len; i++) {
      const char = text[i];
      const next = i + 1 < len ? text[i + 1] : '';

      if (vowelsIndependent[char]) {
        result += vowelsIndependent[char];
      } else if (consonants[char]) {
        const c = consonants[char];
        if (next === '्') {
          // Halant: consonant without inherent vowel
          result += c;
          i++; // skip halant
        } else if (matras[next]) {
          // Consonant with matra vowel
          result += c + matras[next];
          i++; // skip matra
        } else {
          // Inherent short 'a'
          result += c + 'a';
        }
      } else if (char === 'ं') {
        result += 'ṃ';
      } else if (char === 'ः') {
        result += 'ḥ';
      } else if (char === 'ऽ') {
        result += '\'';
      } else if (char === '।' || char === '॥') {
        result += '.';
      } else {
        result += char;
      }
    }

    return result;
  }

  public static iastToDevanagari(text: string): string {
    const vowelIndep: Record<string, string> = {
      'ai': 'ऐ', 'au': 'औ', 'ā': 'आ', 'a': 'अ', 'ī': 'ई', 'i': 'इ',
      'ū': 'ऊ', 'u': 'उ', 'ṝ': 'ॠ', 'ṛ': 'ऋ', 'e': 'ए', 'o': 'ओ'
    };
    const matras: Record<string, string> = {
      'ai': 'ै', 'au': 'ौ', 'ā': 'ा', 'i': 'ि', 'ī': 'ी',
      'u': 'ु', 'ū': 'ू', 'ṛ': 'ृ', 'ṝ': 'ॄ', 'e': 'े', 'o': 'ो'
    };
    const consonants: Record<string, string> = {
      'kh': 'ख', 'gh': 'घ', 'ch': 'छ', 'jh': 'झ', 'ṭh': 'ठ', 'ḍh': 'ढ', 'th': 'थ', 'dh': 'ध', 'ph': 'फ', 'bh': 'भ',
      'k': 'क', 'g': 'ग', 'ṅ': 'ङ', 'c': 'च', 'j': 'ज', 'ñ': 'ञ', 'ṭ': 'ट', 'ḍ': 'ड', 'ṇ': 'ण',
      't': 'त', 'd': 'द', 'n': 'न', 'p': 'प', 'b': 'ब', 'm': 'म',
      'y': 'य', 'r': 'र', 'l': 'ल', 'v': 'व', 'ś': 'श', 'ṣ': 'ष', 's': 'स', 'h': 'ह'
    };

    let result = '';
    let i = 0;
    const len = text.length;

    while (i < len) {
      // Check 2-letter consonants
      const twoC = text.substring(i, i + 2);
      const oneC = text.charAt(i);

      if (consonants[twoC] || consonants[oneC]) {
        const cKey = consonants[twoC] ? twoC : oneC;
        const cGlyph = consonants[cKey];
        i += cKey.length;

        // Now inspect following vowel
        const nextTwoV = text.substring(i, i + 2);
        const nextOneV = text.charAt(i);

        if (matras[nextTwoV]) {
          result += cGlyph + matras[nextTwoV];
          i += 2;
        } else if (matras[nextOneV]) {
          result += cGlyph + matras[nextOneV];
          i += 1;
        } else if (nextOneV === 'a') {
          // Inherent 'a' -> bare consonant
          result += cGlyph;
          i += 1;
        } else {
          // No vowel following -> add virama / halant
          result += cGlyph + '्';
        }
      } else {
        // Check independent vowel
        const twoV = text.substring(i, i + 2);
        const oneV = text.charAt(i);

        if (vowelIndep[twoV]) {
          result += vowelIndep[twoV];
          i += 2;
        } else if (vowelIndep[oneV]) {
          result += vowelIndep[oneV];
          i += 1;
        } else if (oneV === 'ṃ') {
          result += 'ं';
          i++;
        } else if (oneV === 'ḥ') {
          result += 'ः';
          i++;
        } else if (oneV === '.') {
          result += '।';
          i++;
        } else {
          result += oneV;
          i++;
        }
      }
    }

    return result;
  }

  public static hkToIast(hk: string): string {
    return hk
      .replace(/A/g, 'ā')
      .replace(/I/g, 'ī')
      .replace(/U/g, 'ū')
      .replace(/R/g, 'ṛ')
      .replace(/RR/g, 'ṝ')
      .replace(/G/g, 'ṅ')
      .replace(/J/g, 'ñ')
      .replace(/T/g, 'ṭ')
      .replace(/Th/g, 'ṭh')
      .replace(/D/g, 'ḍ')
      .replace(/Dh/g, 'ḍh')
      .replace(/N/g, 'ṇ')
      .replace(/z/g, 'ś')
      .replace(/S/g, 'ṣ')
      .replace(/M/g, 'ṃ')
      .replace(/H/g, 'ḥ');
  }

  public static iastToHk(iast: string): string {
    return iast
      .replace(/ā/g, 'A')
      .replace(/ī/g, 'I')
      .replace(/ū/g, 'U')
      .replace(/ṛ/g, 'R')
      .replace(/ṝ/g, 'RR')
      .replace(/ṅ/g, 'G')
      .replace(/ñ/g, 'J')
      .replace(/ṭh/g, 'Th')
      .replace(/ṭ/g, 'T')
      .replace(/ḍh/g, 'Dh')
      .replace(/ḍ/g, 'D')
      .replace(/ṇ/g, 'N')
      .replace(/ś/g, 'z')
      .replace(/ṣ/g, 'S')
      .replace(/ṃ/g, 'M')
      .replace(/ḥ/g, 'H');
  }

  public static slp1ToIast(slp1: string): string {
    return slp1
      .replace(/A/g, 'ā').replace(/I/g, 'ī').replace(/U/g, 'ū')
      .replace(/f/g, 'ṛ').replace(/F/g, 'ṝ').replace(/x/g, 'ḷ')
      .replace(/N/g, 'ṅ').replace(/Y/g, 'ñ').replace(/w/g, 'ṭ')
      .replace(/W/g, 'ṭh').replace(/q/g, 'ḍ').replace(/Q/g, 'ḍh')
      .replace(/R/g, 'ṇ').replace(/S/g, 'ś').replace(/z/g, 'ṣ')
      .replace(/M/g, 'ṃ').replace(/H/g, 'ḥ');
  }

  public static iastToSlp1(iast: string): string {
    return iast
      .replace(/ā/g, 'A').replace(/ī/g, 'I').replace(/ū/g, 'U')
      .replace(/ṛ/g, 'f').replace(/ṝ/g, 'F').replace(/ḷ/g, 'x')
      .replace(/ṅ/g, 'N').replace(/ñ/g, 'Y').replace(/ṭh/g, 'W')
      .replace(/ṭ/g, 'w').replace(/ḍh/g, 'Q').replace(/ḍ/g, 'q')
      .replace(/ṇ/g, 'R').replace(/ś/g, 'S').replace(/ṣ/g, 'z')
      .replace(/ṃ/g, 'M').replace(/ḥ/g, 'H');
  }

  /**
   * Tokenizes a Sanskrit sentence into words while stripping punctuation
   */
  public static tokenize(sentence: string): string[] {
    return sentence
      .replace(/[।॥,.!?;:]/g, '')
      .split(/\s+/)
      .map(w => w.trim())
      .filter(w => w.length > 0);
  }

  /**
   * Analyzes an individual Sanskrit token to derive root, lemma, case/lakara, and karaka
   */
  public static analyzeToken(token: string): MorphologicalToken {
    const iast = this.devanagariToIast(token);
    const cleanToken = token.replace(/[।॥,.!?;:]/g, '').trim();

    // 1. Common Pronouns & Particles
    const pronounsMap: Record<string, Partial<MorphologicalToken>> = {
      'अहम्': { partOfSpeech: 'pronoun', gender: 'none', case: 'Prathamā', number: 'singular', englishGloss: 'I', karakaRole: 'Kartā (Subject)' },
      'त्वम्': { partOfSpeech: 'pronoun', gender: 'none', case: 'Prathamā', number: 'singular', englishGloss: 'You', karakaRole: 'Kartā (Subject)' },
      'सः': { partOfSpeech: 'pronoun', gender: 'masculine', case: 'Prathamā', number: 'singular', englishGloss: 'He', karakaRole: 'Kartā (Subject)' },
      'सा': { partOfSpeech: 'pronoun', gender: 'feminine', case: 'Prathamā', number: 'singular', englishGloss: 'She', karakaRole: 'Kartā (Subject)' },
      'तत्': { partOfSpeech: 'pronoun', gender: 'neuter', case: 'Prathamā', number: 'singular', englishGloss: 'That / It', karakaRole: 'Kartā (Subject)' },
      'वयम्': { partOfSpeech: 'pronoun', gender: 'none', case: 'Prathamā', number: 'plural', englishGloss: 'We', karakaRole: 'Kartā (Subject)' },
      'यूयम्': { partOfSpeech: 'pronoun', gender: 'none', case: 'Prathamā', number: 'plural', englishGloss: 'You all', karakaRole: 'Kartā (Subject)' },
      'ते': { partOfSpeech: 'pronoun', gender: 'masculine', case: 'Prathamā', number: 'plural', englishGloss: 'They', karakaRole: 'Kartā (Subject)' },
      'एव': { partOfSpeech: 'indeclinable', englishGloss: 'Indeed / Alone', karakaRole: 'none' },
      'अपि': { partOfSpeech: 'indeclinable', englishGloss: 'Also / Even', karakaRole: 'none' },
      'च': { partOfSpeech: 'indeclinable', englishGloss: 'And', karakaRole: 'none' },
      'न': { partOfSpeech: 'indeclinable', englishGloss: 'Not / No', karakaRole: 'none' },
      'इति': { partOfSpeech: 'indeclinable', englishGloss: 'Thus', karakaRole: 'none' },
      'यथा': { partOfSpeech: 'indeclinable', englishGloss: 'As / Just as', karakaRole: 'none' },
      'तथा': { partOfSpeech: 'indeclinable', englishGloss: 'So / In that way', karakaRole: 'none' },
      'अत्र': { partOfSpeech: 'indeclinable', englishGloss: 'Here', karakaRole: 'Adhikaraṇa (Locative)' },
      'तत्र': { partOfSpeech: 'indeclinable', englishGloss: 'There', karakaRole: 'Adhikaraṇa (Locative)' },
      'कुत्र': { partOfSpeech: 'indeclinable', englishGloss: 'Where', karakaRole: 'Adhikaraṇa (Locative)' },
      'अद्य': { partOfSpeech: 'indeclinable', englishGloss: 'Today', karakaRole: 'none' },
      'श्वः': { partOfSpeech: 'indeclinable', englishGloss: 'Tomorrow', karakaRole: 'none' }
    };

    if (pronounsMap[cleanToken]) {
      const p = pronounsMap[cleanToken];
      return {
        token,
        iast,
        cleanToken,
        partOfSpeech: p.partOfSpeech || 'pronoun',
        root: undefined,
        stem: cleanToken,
        gender: p.gender || 'none',
        case: p.case || 'none',
        number: p.number || 'none',
        person: 'none',
        tense: 'none',
        karakaRole: p.karakaRole || 'none',
        englishGloss: p.englishGloss || cleanToken,
        explanation: `${cleanToken} is a standard Sanskrit ${p.partOfSpeech} meaning "${p.englishGloss}".`
      };
    }

    // 2. Common Verbs
    // Present tense (Laṭ) endings: -ति, -तः, -न्ति, -सि, -थः, -थ, -मि, -वः, -मः
    const verbSuffixes: Array<{ suffix: string; person: MorphologicalToken['person']; number: MorphologicalToken['number'] }> = [
      { suffix: 'न्ति', person: '3rd (Prathama)', number: 'plural' },
      { suffix: 'तः', person: '3rd (Prathama)', number: 'dual' },
      { suffix: 'ति', person: '3rd (Prathama)', number: 'singular' },
      { suffix: 'थः', person: '2nd (Madhyama)', number: 'dual' },
      { suffix: 'थ', person: '2nd (Madhyama)', number: 'plural' },
      { suffix: 'सि', person: '2nd (Madhyama)', number: 'singular' },
      { suffix: 'ामः', person: '1st (Uttama)', number: 'plural' },
      { suffix: 'ावः', person: '1st (Uttama)', number: 'dual' },
      { suffix: 'मि', person: '1st (Uttama)', number: 'singular' }
    ];

    const knownDhatus: Record<string, { root: string; meaning: string }> = {
      'गच्छ': { root: 'गम् (gam)', meaning: 'go / move' },
      'पठ': { root: 'पठ् (paṭh)', meaning: 'read / study' },
      'भव': { root: 'भू (bhū)', meaning: 'be / become' },
      'लिख': { root: 'लिख् (likh)', meaning: 'write' },
      'क्रीड': { root: 'क्रीड् (krīḍ)', meaning: 'play' },
      'धाव': { root: 'धाव् (dhāv)', meaning: 'run' },
      'वद': { root: 'वद् (vad)', meaning: 'speak' },
      'खाद': { root: 'खाद् (khād)', meaning: 'eat' },
      'पिब': { root: 'पा (pā)', meaning: 'drink' },
      'पश्य': { root: 'दृश् (dṛś)', meaning: 'see / behold' },
      'नृत्य': { root: 'नृत् (nṛt)', meaning: 'dance' },
      'गाय': { root: 'गै (gai)', meaning: 'sing' },
      'शृणो': { root: 'श्रु (śru)', meaning: 'hear / listen' },
      'करो': { root: 'कृ (kṛ)', meaning: 'do / act' },
      'अस्': { root: 'अस् (as)', meaning: 'is / exist' }
    };

    if (cleanToken === 'अस्ति') {
      return {
        token,
        iast,
        cleanToken,
        partOfSpeech: 'verb',
        root: 'अस् (as)',
        tense: 'Laṭ (Present)',
        person: '3rd (Prathama)',
        number: 'singular',
        karakaRole: 'Kriyā (Verb)',
        englishGloss: 'is / exists',
        explanation: 'Verbal root अस् (as) in Laṭ Lakāra (Present tense), 3rd person singular.'
      };
    }
    if (cleanToken === 'सन्ति') {
      return {
        token,
        iast,
        cleanToken,
        partOfSpeech: 'verb',
        root: 'अस् (as)',
        tense: 'Laṭ (Present)',
        person: '3rd (Prathama)',
        number: 'plural',
        karakaRole: 'Kriyā (Verb)',
        englishGloss: 'are / exist',
        explanation: 'Verbal root अस् (as) in Laṭ Lakāra (Present tense), 3rd person plural.'
      };
    }

    for (const v of verbSuffixes) {
      if (cleanToken.endsWith(v.suffix)) {
        const stem = cleanToken.slice(0, -v.suffix.length);
        if (knownDhatus[stem] || (stem.length >= 2 && !cleanToken.endsWith('मः'))) {
          const dhatuInfo = knownDhatus[stem] || { root: `${stem}्`, meaning: 'act / verb' };
          return {
            token,
            iast,
            cleanToken,
            partOfSpeech: 'verb',
            root: dhatuInfo.root,
            stem,
            tense: 'Laṭ (Present)',
            person: v.person,
            number: v.number,
            karakaRole: 'Kriyā (Verb)',
            englishGloss: dhatuInfo.meaning,
            explanation: `Verbal inflection from root ${dhatuInfo.root}, Laṭ Lakāra (Present tense), ${v.person} ${v.number}.`
          };
        }
      }
    }

    // 3. Noun Cases (Aṣṭa-Vibhaktayaḥ)
    // Nominative (Prathamā): -ः (masc sg), -ौ (masc du), -ाः (masc pl), -म् (neuter sg), -ानि (neuter pl)
    // Accusative (Dvitīyā): -म् (masc/neut sg), -ौ (du), -ान् (masc pl), -ानि (neut pl)
    // Instrumental (Tṛtīyā): -ेण / -ेना / -या (sg), -ाभ्याम् (du), -ैः (pl)
    // Dative (Caturthī): -ाय / -यै (sg), -ाभ्याम् (du), -ेभ्यः (pl)
    // Ablative (Pañcamī): -ात् / -याः (sg), -ाभ्याम् (du), -ेभ्यः (pl)
    // Genitive (Ṣaṣṭhī): -स्य / -याः (sg), -योः (du), -ाणाम् / -णाम् (pl)
    // Locative (Saptamī): -े / -याम् (sg), -योः (du), -ेषु / -सु (pl)

    if (cleanToken.endsWith('ेभ्यः')) {
      const stem = cleanToken.slice(0, -5);
      return {
        token, iast, cleanToken, partOfSpeech: 'noun', stem,
        case: 'Caturthī', number: 'plural', gender: 'masculine',
        karakaRole: 'Sampradāna (Dative)', englishGloss: `for ${stem}s`,
        explanation: `Caturthī Vibhakti (Dative) or Pañcamī (Ablative) plural ending in -ेभ्यः.`
      };
    }
    if (cleanToken.endsWith('ाभ्याम्')) {
      const stem = cleanToken.slice(0, -6);
      return {
        token, iast, cleanToken, partOfSpeech: 'noun', stem,
        case: 'Tṛtīyā', number: 'dual', gender: 'masculine',
        karakaRole: 'Karaṇa (Instrument)', englishGloss: `by/with two ${stem}s`,
        explanation: `Instrumental / Dative / Ablative dual form ending in -ाभ्याम्.`
      };
    }
    if (cleanToken.endsWith('ाणाम्') || cleanToken.endsWith('णाम्')) {
      const stem = cleanToken.replace(/(ाणाम्|णाम्)$/, '');
      return {
        token, iast, cleanToken, partOfSpeech: 'noun', stem,
        case: 'Ṣaṣṭhī', number: 'plural', gender: 'masculine',
        karakaRole: 'Sambandha (Genitive)', englishGloss: `of ${stem}s`,
        explanation: `Ṣaṣṭhī Vibhakti (Genitive) plural indicating possession ("of").`
      };
    }
    if (cleanToken.endsWith('ेषु')) {
      const stem = cleanToken.slice(0, -3);
      return {
        token, iast, cleanToken, partOfSpeech: 'noun', stem,
        case: 'Saptamī', number: 'plural', gender: 'masculine',
        karakaRole: 'Adhikaraṇa (Locative)', englishGloss: `in/among ${stem}s`,
        explanation: `Saptamī Vibhakti (Locative) plural indicating locus or location.`
      };
    }
    if (cleanToken.endsWith('स्य')) {
      const stem = cleanToken.slice(0, -3);
      return {
        token, iast, cleanToken, partOfSpeech: 'noun', stem,
        case: 'Ṣaṣṭhī', number: 'singular', gender: 'masculine',
        karakaRole: 'Sambandha (Genitive)', englishGloss: `${stem}'s / of ${stem}`,
        explanation: `Ṣaṣṭhī Vibhakti (Genitive) singular indicating possession or belonging.`
      };
    }
    if (cleanToken.endsWith('ात्')) {
      const stem = cleanToken.slice(0, -3);
      return {
        token, iast, cleanToken, partOfSpeech: 'noun', stem,
        case: 'Pañcamī', number: 'singular', gender: 'masculine',
        karakaRole: 'Apādāna (Ablative)', englishGloss: `from ${stem}`,
        explanation: `Pañcamī Vibhakti (Ablative) singular indicating source or point of separation.`
      };
    }
    if (cleanToken.endsWith('ाय')) {
      const stem = cleanToken.slice(0, -2);
      return {
        token, iast, cleanToken, partOfSpeech: 'noun', stem,
        case: 'Caturthī', number: 'singular', gender: 'masculine',
        karakaRole: 'Sampradāna (Dative)', englishGloss: `to/for ${stem}`,
        explanation: `Caturthī Vibhakti (Dative) singular indicating beneficiary or recipient.`
      };
    }
    if (cleanToken.endsWith('ेण') || cleanToken.endsWith('ेना')) {
      const stem = cleanToken.replace(/(ेण|ेना)$/, '');
      return {
        token, iast, cleanToken, partOfSpeech: 'noun', stem,
        case: 'Tṛtīyā', number: 'singular', gender: 'masculine',
        karakaRole: 'Karaṇa (Instrument)', englishGloss: `with/by ${stem}`,
        explanation: `Tṛtīyā Vibhakti (Instrumental) singular indicating instrument or means.`
      };
    }
    if (cleanToken.endsWith('ैः')) {
      const stem = cleanToken.slice(0, -2);
      return {
        token, iast, cleanToken, partOfSpeech: 'noun', stem,
        case: 'Tṛtīyā', number: 'plural', gender: 'masculine',
        karakaRole: 'Karaṇa (Instrument)', englishGloss: `with/by ${stem}s`,
        explanation: `Tṛtīyā Vibhakti (Instrumental) plural indicating multiple instruments.`
      };
    }
    if (cleanToken.endsWith('ान्')) {
      const stem = cleanToken.slice(0, -3);
      return {
        token, iast, cleanToken, partOfSpeech: 'noun', stem,
        case: 'Dvitīyā', number: 'plural', gender: 'masculine',
        karakaRole: 'Karma (Object)', englishGloss: `${stem}s (objects)`,
        explanation: `Dvitīyā Vibhakti (Accusative) plural indicating direct objects.`
      };
    }
    if (cleanToken.endsWith('ानि')) {
      const stem = cleanToken.slice(0, -3);
      return {
        token, iast, cleanToken, partOfSpeech: 'noun', stem,
        case: 'Prathamā', number: 'plural', gender: 'neuter',
        karakaRole: 'Kartā (Subject)', englishGloss: `${stem}s`,
        explanation: `Neuter plural form (Prathamā or Dvitīyā) ending in -ानि.`
      };
    }
    if (cleanToken.endsWith('ं') || cleanToken.endsWith('म्')) {
      const stem = cleanToken.replace(/[ंम्]$/, '');
      return {
        token, iast, cleanToken, partOfSpeech: 'noun', stem,
        case: 'Dvitīyā', number: 'singular', gender: 'neuter',
        karakaRole: 'Karma (Object)', englishGloss: stem,
        explanation: `Dvitīyā Vibhakti (Accusative) singular denoting object or destination of motion.`
      };
    }
    if (cleanToken.endsWith('ः')) {
      const stem = cleanToken.slice(0, -1);
      return {
        token, iast, cleanToken, partOfSpeech: 'noun', stem,
        case: 'Prathamā', number: 'singular', gender: 'masculine',
        karakaRole: 'Kartā (Subject)', englishGloss: stem,
        explanation: `Prathamā Vibhakti (Nominative) singular of an a-kāra masculine noun.`
      };
    }
    if (cleanToken.endsWith('े')) {
      const stem = cleanToken.slice(0, -1);
      return {
        token, iast, cleanToken, partOfSpeech: 'noun', stem,
        case: 'Saptamī', number: 'singular', gender: 'masculine',
        karakaRole: 'Adhikaraṇa (Locative)', englishGloss: `in/on ${stem}`,
        explanation: `Saptamī Vibhakti (Locative) singular indicating place/location.`
      };
    }

    // Default unknown / generic token
    return {
      token,
      iast,
      cleanToken,
      partOfSpeech: 'noun',
      stem: cleanToken,
      gender: 'masculine',
      case: 'Prathamā',
      number: 'singular',
      karakaRole: 'Kartā (Subject)',
      englishGloss: cleanToken,
      explanation: `Lexical token "${cleanToken}" parsed in canonical grammatical position.`
    };
  }

  /**
   * Analyzes a complete Sanskrit sentence, generating tokenization, morphology, and dependency graph
   */
  public static analyzeSentence(sentence: string): SentenceAnalysisResult {
    const rawTokens = this.tokenize(sentence);
    const tokens = rawTokens.map(t => this.analyzeToken(t));
    const sentenceIast = this.devanagariToIast(sentence);

    const nodes: DependencyNode[] = [];
    const links: DependencyLink[] = [];

    // Find main predicate/verb
    let verbToken = tokens.find(t => t.partOfSpeech === 'verb');
    if (!verbToken && tokens.length > 0) {
      // Nominal sentence default (e.g. ज्ञानं शक्तिः -> implied अस्ति)
      verbToken = {
        token: '[अस्ति]',
        iast: '[asti]',
        cleanToken: 'अस्ति',
        partOfSpeech: 'verb',
        root: 'अस्',
        englishGloss: 'is',
        karakaRole: 'Kriyā (Verb)',
        explanation: 'Implied copula verb (अस्ति)'
      };
    }

    const verbId = verbToken ? `node_${verbToken.cleanToken}` : 'root_verb';

    if (verbToken) {
      nodes.push({
        id: verbId,
        label: verbToken.token,
        iast: verbToken.iast,
        role: 'Kriyā (Predicate)',
        pos: 'Verb'
      });
    }

    // Construct dependency links
    tokens.forEach((t, idx) => {
      const nodeId = `node_${t.cleanToken}_${idx}`;
      if (t !== verbToken) {
        nodes.push({
          id: nodeId,
          label: t.token,
          iast: t.iast,
          role: t.karakaRole || 'Modifier',
          pos: t.partOfSpeech
        });

        if (verbToken) {
          links.push({
            source: nodeId,
            target: verbId,
            relation: t.karakaRole || 'Dependant',
            description: `${t.cleanToken} (${t.karakaRole}) modifies the predicate ${verbToken.cleanToken}`
          });
        }
      }
    });

    // Syntactic structure summary
    const structureParts = tokens.map(t => `${t.cleanToken} [${t.karakaRole || t.partOfSpeech}]`);
    const syntacticStructure = structureParts.join(' -> ');

    // Produce coherent English translation from tokens
    const englishTranslation = this.generateSentenceTranslation(tokens);

    return {
      originalSentence: sentence,
      iast: sentenceIast,
      tokens,
      dependencyGraph: { nodes, links },
      syntacticStructure,
      englishTranslation
    };
  }

  private static generateSentenceTranslation(tokens: MorphologicalToken[]): string {
    const karta = tokens.find(t => t.karakaRole === 'Kartā (Subject)');
    const karma = tokens.find(t => t.karakaRole === 'Karma (Object)');
    const karana = tokens.find(t => t.karakaRole === 'Karaṇa (Instrument)');
    const sampradana = tokens.find(t => t.karakaRole === 'Sampradāna (Dative)');
    const apadana = tokens.find(t => t.karakaRole === 'Apādāna (Ablative)');
    const adhikarana = tokens.find(t => t.karakaRole === 'Adhikaraṇa (Locative)');
    const kriya = tokens.find(t => t.partOfSpeech === 'verb');

    // Known full sentences dictionary
    const text = tokens.map(t => t.cleanToken).join(' ');
    if (text.includes('राम') && text.includes('वन') && text.includes('गच्छति')) return 'Rama goes to the forest.';
    if (text.includes('बालक') && text.includes('पुस्तक') && text.includes('पठति')) return 'The boy reads a book.';
    if (text.includes('अहं') && text.includes('संस्कृत') && text.includes('पठामि')) return 'I study Sanskrit.';
    if (text.includes('ज्ञानं') && text.includes('शक्ति')) return 'Knowledge is power.';
    if (text.includes('जलम्') && text.includes('जीवनम्')) return 'Water is life.';
    if (text.includes('विद्या') && text.includes('विनयम्')) return 'Learning bestows humility.';
    if (text.includes('सत्यम्') && text.includes('जयते')) return 'Truth alone triumphs.';

    // Construct translation from grammatical slots
    const parts: string[] = [];
    if (karta) parts.push(karta.englishGloss);
    if (kriya) parts.push(kriya.englishGloss);
    if (karma) parts.push(karma.englishGloss);
    if (karana) parts.push(karana.englishGloss);
    if (sampradana) parts.push(sampradana.englishGloss);
    if (apadana) parts.push(apadana.englishGloss);
    if (adhikarana) parts.push(adhikarana.englishGloss);

    if (parts.length > 0) {
      const raw = parts.join(' ');
      return raw.charAt(0).toUpperCase() + raw.slice(1) + '.';
    }

    return tokens.map(t => t.englishGloss).join(' ');
  }

  /**
   * Chhandas (Sanskrit Prosody & Meter) Scanner Engine
   */
  public static scanChhandas(verseText: string): any {
    const rawLines = verseText.split(/\n|।|॥/).map(l => l.trim()).filter(l => l.length > 0);
    const padas: any[] = [];

    // Helper: Determine Laghu (L / ∪) or Guru (G / —) for a Devanagari syllable sequence
    const vowelsLong = ['आ', 'ई', 'ऊ', 'ॠ', 'ॡ', 'ए', 'ऐ', 'ओ', 'औ', 'ा', 'ी', 'ू', 'ॄ', 'े', 'ै', 'ो', 'ौ'];
    const vowelsShort = ['अ', 'इ', 'उ', 'ऋ', 'ऌ', 'ि', 'ु', 'ृ'];

    rawLines.forEach((line, pIndex) => {
      const lineIast = this.devanagariToIast(line);
      const syllables: any[] = [];
      
      // Tokenize into phonetic syllables
      // In Sanskrit prosody, a vowel forms the nucleus of each syllable
      const charArray = Array.from(line);
      let currentSyllable = '';
      
      for (let i = 0; i < charArray.length; i++) {
        const char = charArray[i];
        if (char === ' ' || char === '।') continue;
        currentSyllable += char;

        const isVowelChar = vowelsLong.includes(char) || vowelsShort.includes(char);
        const hasVowelMatra = i + 1 < charArray.length && (vowelsLong.includes(charArray[i + 1]) || vowelsShort.includes(charArray[i + 1]));
        const nextIsVirama = i + 1 < charArray.length && charArray[i + 1] === '्';

        // Check if this completes a syllable nucleus
        if (isVowelChar || (hasVowelMatra && !nextIsVirama)) {
          // Check subsequent context for conjunct (saṃyoga), anusvāra (ं), or visarga (ः)
          let isGuru = vowelsLong.some(v => currentSyllable.includes(v));
          let reason = isGuru ? 'Long vowel (Dīrgha svara)' : 'Short vowel (Hrasva svara)';

          if (i + 1 < charArray.length && (charArray[i + 1] === 'ं' || charArray[i + 1] === 'ः')) {
            isGuru = true;
            reason = charArray[i + 1] === 'ं' ? 'Anusvāra (Anusvārayukta)' : 'Visarga (Visargayukta)';
            currentSyllable += charArray[i + 1];
            i++;
          } else if (i + 2 < charArray.length && charArray[i + 2] === '्') {
            isGuru = true;
            reason = 'Precedes conjunct consonant (Saṃyogapara)';
          }

          syllables.push({
            syllable: currentSyllable,
            weight: isGuru ? 'G' : 'L',
            symbol: isGuru ? '—' : '∪',
            matra: isGuru ? 2 : 1,
            reason
          });
          currentSyllable = '';
        }
      }

      if (currentSyllable.length > 0 && syllables.length > 0) {
        syllables[syllables.length - 1].syllable += currentSyllable;
      }

      // Group syllables into 3-unit Ganas
      const ganas: any[] = [];
      for (let g = 0; g < syllables.length; g += 3) {
        const chunk = syllables.slice(g, g + 3);
        const code = chunk.map((s: any) => s.weight).join('');
        let ganaName = 'Rest';
        if (code === 'GGG') ganaName = 'म-गण (Ma)';
        else if (code === 'LGG') ganaName = 'य-गण (Ya)';
        else if (code === 'GLG') ganaName = 'र-गण (Ra)';
        else if (code === 'LLG') ganaName = 'स-गण (Sa)';
        else if (code === 'GGL') ganaName = 'त-गण (Ta)';
        else if (code === 'LGL') ganaName = 'ज-गण (Ja)';
        else if (code === 'GLL') ganaName = 'भ-गण (Bha)';
        else if (code === 'LLL') ganaName = 'न-गण (Na)';
        else if (code === 'L') ganaName = 'ल (Laghu)';
        else if (code === 'G') ganaName = 'ग (Guru)';
        else if (code === 'GG') ganaName = 'ग-ग (Guru-Guru)';
        else if (code === 'LG') ganaName = 'ल-ग (Laghu-Guru)';

        ganas.push({
          name: ganaName,
          pattern: chunk.map((s: any) => s.symbol).join(' '),
          syllables: chunk.map((s: any) => s.syllable)
        });
      }

      padas.push({
        padaNumber: pIndex + 1,
        text: line,
        syllables,
        syllableCount: syllables.length,
        matraCount: syllables.reduce((acc: number, s: any) => acc + s.matra, 0),
        pattern: syllables.map((s: any) => s.symbol).join(' '),
        ganas
      });
    });

    // Identify Meter
    const avgSyllables = padas.length > 0 ? Math.round(padas.reduce((a, p) => a + p.syllableCount, 0) / padas.length) : 0;
    let meterName = 'Custom Sanskrit Meter / Śloka Variant';
    let meterNameSanskrit = 'छन्दोविशेषः';
    let meterCategory = 'वर्णवृत्तम् (Varṇa-vṛtta)';
    let syllablesPerPada = avgSyllables;
    let schemeDescription = 'Classic Sanskrit prosody pattern.';
    let yati = 'Pādānte (At end of quarter)';
    let famousExample = 'धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः। मामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय॥';
    let exampleMeaning = 'In the holy land of Kurukshetra, gathered desiring to fight, what did my people and the Pandavas do, O Sanjaya? (Bhagavad Gita 1.1)';
    let classicalRecitationGuide = 'Cadence of 8 syllables per quarter, rhythmic pause on 4th & 8th syllable.';

    if (avgSyllables === 8) {
      meterName = 'Anuṣṭubh (Śloka)';
      meterNameSanskrit = 'अनुष्टुप् (श्लोकः)';
      meterCategory = 'पद्यवृत्तम् (Classical Metric Quatrain)';
      syllablesPerPada = 8;
      schemeDescription = '8 syllables per quarter (32 syllables total). 5th syllable is Laghu (∪), 6th is Guru (—) in all quarters; 7th alternates.';
      yati = '4th and 8th Akṣara';
      famousExample = 'वागर्थाविव सम्पृक्तौ वागर्थप्रतिपत्तये। जगतः पितरौ वन्दे पार्वतीपरमेश्वरौ॥';
      exampleMeaning = 'For the correct comprehension of word and meaning, I bow to the parents of the universe, Parvati and Parameshvara, who are united like word and sense. (Raghuvamsham 1.1)';
      classicalRecitationGuide = 'Chant with steady 8-beat metronome rhythm with gentle vocal inflection on the 5th-6th syllable.';
    } else if (avgSyllables === 11) {
      meterName = 'Indravajrā / Upajāti';
      meterNameSanskrit = 'इन्द्रवज्रा / उपजातिः';
      syllablesPerPada = 11;
      schemeDescription = '11 syllables per quarter. Pattern: त-त-ज-ग-ग (— — ∪  — — ∪  ∪ — ∪  — —)';
      yati = '5th and 11th Akṣara';
      famousExample = 'शान्ताकारं भुजगशयनं पद्मनाभं सुरेशं विश्वाधारं गगनसदृशं मेघवर्णं शुभाङ्गम्॥';
      exampleMeaning = 'I bow to Lord Vishnu of serene form, resting on the serpent couch, from whose navel sprouts the lotus, Lord of celestials.';
      classicalRecitationGuide = 'Majestic, resolute cadence with pronounced pause after the 5th syllable.';
    } else if (avgSyllables === 14) {
      meterName = 'Vasantatilakā';
      meterNameSanskrit = 'वसन्ततिलका';
      syllablesPerPada = 14;
      schemeDescription = '14 syllables per quarter. Pattern: त-भ-ज-ज-ग-ग (— — ∪  — ∪ ∪  ∪ — ∪  ∪ — ∪  — —)';
      yati = '8th and 14th Akṣara';
      famousExample = 'विद्या नाम नरस्य रूपमधिकं प्रच्छन्नगुप्तं धनम्। विद्या भोगकरी यशःसुखकरी विद्या गुरूणां गुरुः॥';
      exampleMeaning = 'Knowledge is man\'s supreme beauty and secretly guarded wealth. Learning brings enjoyment, fame, and happiness; learning is the guru of all gurus.';
      classicalRecitationGuide = 'Flowing, melodic cadence reminiscent of spring blossoms.';
    } else if (avgSyllables === 15) {
      meterName = 'Mālinī';
      meterNameSanskrit = 'मालिनी';
      syllablesPerPada = 15;
      schemeDescription = '15 syllables per quarter. Pattern: न-न-म-य-य (∪ ∪ ∪  ∪ ∪ ∪  — — —  ∪ — —  ∪ — —)';
      yati = '8th and 15th Akṣara (Bhogilokaiḥ - 8 and 7)';
      famousExample = 'सरसिजमनुविद्धं शैवलेनापि रम्यं मलिनमपि हिमांशोर्लक्ष्म लक्ष्मीं तनोति॥';
      exampleMeaning = 'The lotus is charming even intertwined with duckweed; the dark spot on the moon actually heightens its radiant beauty. (Abhijnana Shakuntalam)';
      classicalRecitationGuide = 'Tripping, light beginning bursting into majestic elongated syllables.';
    } else if (avgSyllables === 17) {
      meterName = 'Mandākrāntā';
      meterNameSanskrit = 'मन्दाक्रान्ता';
      syllablesPerPada = 17;
      schemeDescription = '17 syllables per quarter. Pattern: म-भ-न-त-त-ग-ग (— — —  — ∪ ∪  ∪ ∪ ∪  — — ∪  — — ∪  — —)';
      yati = '4th, 10th, and 17th Akṣara (Ambudhirasagaiḥ - 4, 6, 7)';
      famousExample = 'कश्चित्कान्ताविरहगुरुणा स्वाधिकारात्प्रमत्ततः शापेनास्तङ्गमितमहिमा वर्षभोग्येण भर्तुः॥';
      exampleMeaning = 'A certain Yaksha, negligent in his duties and stripped of divine glory by his master\'s year-long curse of separation from his beloved... (Meghadutam 1.1)';
      classicalRecitationGuide = 'Slow, solemn, dignified cadence carrying deep emotional longing.';
    } else if (avgSyllables === 19) {
      meterName = 'Śārdūlavikrīḍita';
      meterNameSanskrit = 'शार्दूलविक्रीडितम्';
      syllablesPerPada = 19;
      schemeDescription = '19 syllables per quarter. Pattern: म-स-ज-स-त-त-ग (— — —  ∪ ∪ —  ∪ — ∪  ∪ ∪ —  — — ∪  — — ∪  —)';
      yati = '12th and 19th Akṣara (Sūryāśvaiḥ - 12 and 7)';
      famousExample = 'केयूराणि न भूषयन्ति पुरुषं हारा न चन्द्रोज्ज्वला न स्नानं न विलेपनं न कुसुमं नालङ्कृता मूर्धजाः॥';
      exampleMeaning = 'Neither armlets nor pearl necklaces bright as moonlight adorn a person, neither baths nor scented unguents nor flowered coiffures; only cultured speech is true adornment.';
      classicalRecitationGuide = 'Stately, powerful, roaring cadence reminiscent of a majestic lion playing.';
    }

    return {
      meterName,
      meterNameSanskrit,
      meterCategory,
      syllablesPerPada,
      schemeDescription,
      yati,
      padas,
      isMatch: true,
      famousExample,
      exampleMeaning,
      classicalRecitationGuide
    };
  }

  /**
   * Samāsa (Sanskrit Compound Words) Analyzer & Decompounder
   */
  public static analyzeSamasa(compoundWord: string): any {
    const clean = compoundWord.trim().replace(/[।॥,.]/g, '');
    const iast = this.devanagariToIast(clean);

    const samasaKnowledgeBase: Record<string, any> = {
      'महावृक्षः': {
        compoundWord: 'महावृक्षः',
        iast: 'mahāvṛkṣaḥ',
        samasaType: 'Karmadhāraya Tatpuruṣa',
        samasaTypeSanskrit: 'कर्मधारय तत्पुरुषः',
        purvapada: 'महान् (mahān)',
        purvapadaMeaning: 'Great / vast',
        uttarapada: 'वृक्षः (vṛkṣaḥ)',
        uttarapadaMeaning: 'Tree',
        vigrahaVakya: 'महान् चासौ वृक्षः = महावृक्षः',
        vigrahaIast: 'mahān cāsau vṛkṣaḥ = mahāvṛkṣaḥ',
        englishMeaning: 'A great / large tree',
        paniniSutra: 'विशेषणं विशेष्येण बहुलम् (२.१.५७)',
        explanation: 'The prior word is an adjective describing the quality of the latter noun.'
      },
      'दशाननः': {
        compoundWord: 'दशाननः',
        iast: 'daśānanaḥ',
        samasaType: 'Bahuvrīhi (Other-referent)',
        samasaTypeSanskrit: 'बहुव्रीहि समासः',
        purvapada: 'दश (daśa)',
        purvapadaMeaning: 'Ten',
        uttarapada: 'आननानि (ānanāni)',
        uttarapadaMeaning: 'Faces / heads',
        vigrahaVakya: 'दश आननानि यस्य सः = दशाननः (रावणः)',
        vigrahaIast: 'daśa ānanāni yasya saḥ = daśānanaḥ (rāvaṇaḥ)',
        englishMeaning: 'One who has ten faces (Ravana)',
        paniniSutra: 'अनेकमन्यपदार्थे (२.२.२४)',
        explanation: 'The compound refers to a third entity (Ravana) possessing the attribute of ten heads.'
      },
      'रामलक्ष्मणौ': {
        compoundWord: 'रामलक्ष्मणौ',
        iast: 'rāmalakṣmaṇau',
        samasaType: 'Itaretara Dvandva',
        samasaTypeSanskrit: 'इतरेतर द्वन्द्व समासः',
        purvapada: 'रामः (rāmaḥ)',
        purvapadaMeaning: 'Rama',
        uttarapada: 'लक्ष्मणः (lakṣmaṇaḥ)',
        uttarapadaMeaning: 'Lakshmana',
        vigrahaVakya: 'रामश्च लक्ष्मणश्च = रामलक्ष्मणौ',
        vigrahaIast: 'rāmaśca lakṣmaṇaśca = rāmalakṣmaṇau',
        englishMeaning: 'Rama and Lakshmana',
        paniniSutra: 'चार्थे द्वन्द्वः (२.२.२९)',
        explanation: 'Both components are coordinated equally with the dual ending denoting two individuals.'
      },
      'प्रतिदिनम्': {
        compoundWord: 'प्रतिदिनम्',
        iast: 'pratidinam',
        samasaType: 'Avyayībhāva (Adverbial)',
        samasaTypeSanskrit: 'अव्ययीभाव समासः',
        purvapada: 'प्रति (prati)',
        purvapadaMeaning: 'Each / every (Prefix)',
        uttarapada: 'दिनम् (dinam)',
        uttarapadaMeaning: 'Day',
        vigrahaVakya: 'दिने दिने इति = प्रतिदिनम्',
        vigrahaIast: 'dine dine iti = pratidinam',
        englishMeaning: 'Every day / daily',
        paniniSutra: 'अव्ययं विभक्तिसमीपसमृद्धि... (२.१.६)',
        explanation: 'The indeclinable prefix governs the compound, rendering the whole word neuter and indeclinable.'
      },
      'राजपुरुषः': {
        compoundWord: 'राजपुरुषः',
        iast: 'rājapuruṣaḥ',
        samasaType: 'Ṣaṣṭhī Tatpuruṣa',
        samasaTypeSanskrit: 'षष्ठी तत्पुरुष समासः',
        purvapada: 'राज्ञः (rājñaḥ)',
        purvapadaMeaning: 'Of the king (Genitive)',
        uttarapada: 'पुरुषः (puruṣaḥ)',
        uttarapadaMeaning: 'Man / officer',
        vigrahaVakya: 'राज्ञः पुरुषः = राजपुरुषः',
        vigrahaIast: 'rājñaḥ puruṣaḥ = rājapuruṣaḥ',
        englishMeaning: 'The king\'s officer / servant',
        paniniSutra: 'षष्ठी (२.२.८)',
        explanation: 'The first word is in the genitive relation (possessor) to the primary head word.'
      },
      'पञ्चगवम्': {
        compoundWord: 'पञ्चगवम्',
        iast: 'pañcagavam',
        samasaType: 'Samāhāra Dvigu',
        samasaTypeSanskrit: 'समाहार द्विगु समासः',
        purvapada: 'पञ्च (pañca)',
        purvapadaMeaning: 'Five',
        uttarapada: 'गावः (gāvaḥ)',
        uttarapadaMeaning: 'Cows',
        vigrahaVakya: 'पञ्चानां गवां समाहारः = पञ्चगवम्',
        vigrahaIast: 'pañcānāṃ gavāṃ samāhāraḥ = pañcagavam',
        englishMeaning: 'An aggregate of five cows',
        paniniSutra: 'संख्यापूर्वो द्विगुः (२.१.५२)',
        explanation: 'A Tatpurusha whose prior member is a numeral expressing an aggregate collection.'
      },
      'विद्याधनम्': {
        compoundWord: 'विद्याधनम्',
        iast: 'vidyādhanam',
        samasaType: 'Rūpaka Karmadhāraya',
        samasaTypeSanskrit: 'रूपक कर्मधारयः',
        purvapada: 'विद्या (vidyā)',
        purvapadaMeaning: 'Knowledge',
        uttarapada: 'धनम् (dhanam)',
        uttarapadaMeaning: 'Wealth',
        vigrahaVakya: 'विद्या एव धनम् = विद्याधनम्',
        vigrahaIast: 'vidyā eva dhanam = vidyādhanam',
        englishMeaning: 'Knowledge as wealth / wealth of knowledge',
        paniniSutra: 'उपमितं व्याघ्रादिभिः सामान्याप्रयोगे (२.१.५६)',
        explanation: 'Metaphorical identification where knowledge is equated to wealth itself.'
      }
    };

    if (samasaKnowledgeBase[clean]) {
      return samasaKnowledgeBase[clean];
    }

    // Heuristic decompounder fallback
    return {
      compoundWord: clean,
      iast,
      samasaType: 'Tatpuruṣa / General Compound',
      samasaTypeSanskrit: 'तत्पुरुष समासः',
      purvapada: clean.slice(0, Math.floor(clean.length / 2)),
      purvapadaMeaning: 'Prior member (Pūrvapada)',
      uttarapada: clean.slice(Math.floor(clean.length / 2)),
      uttarapadaMeaning: 'Latter head noun (Uttarapada)',
      vigrahaVakya: `${clean} समास-विग्रहः`,
      vigrahaIast: `${iast} samāsa-vigrahaḥ`,
      englishMeaning: `Compound meaning relating ${iast}`,
      paniniSutra: 'समर्थः पदविधिः (२.१.१)',
      explanation: 'Sanskrit rule of syntactically and semantically harmonious compounding of nominal stems.'
    };
  }

  /**
   * Comprehensive Sanskrit Declension Matrix (Subanta / Vibhakti Generator)
   */
  public static getDeclensionMatrix(stem: string = 'राम', gender: string = 'masculine'): any {
    const matrices: Record<string, any> = {
      'राम': {
        stem: 'राम (rāma)',
        stemType: 'अकारान्त पुंल्लिङ्गः (a-ending Masculine)',
        meaning: 'Rama / Joyful one',
        rows: [
          { caseName: 'प्रथमा (Nominative)', karaka: 'कर्तृ (Subject)', singular: 'रामः', dual: 'रामौ', plural: 'रामाः' },
          { caseName: 'द्वितीया (Accusative)', karaka: 'कर्म (Object)', singular: 'रामम्', dual: 'रामौ', plural: 'रामान्' },
          { caseName: 'तृतीया (Instrumental)', karaka: 'करण (Instrument/Agent)', singular: 'रामेण', dual: 'रामाभ्याम्', plural: 'रामैः' },
          { caseName: 'चतुर्थी (Dative)', karaka: 'सम्प्रदान (Recipient)', singular: 'रामाय', dual: 'रामाभ्याम्', plural: 'रामेभ्यः' },
          { caseName: 'पञ्चमी (Ablative)', karaka: 'अपादान (Source/Origin)', singular: 'रामात्', dual: 'रामाभ्याम्', plural: 'रामेभ्यः' },
          { caseName: 'षष्ठी (Genitive)', karaka: 'सम्बन्ध (Possessor)', singular: 'रामस्य', dual: 'रामयोः', plural: 'रामाणाम्' },
          { caseName: 'सप्तमी (Locative)', karaka: 'अधिकरण (Location/Time)', singular: 'रामे', dual: 'रामयोः', plural: 'रामेषु' },
          { caseName: 'सम्बोधन (Vocative)', karaka: 'आमन्त्रण (Address)', singular: 'हे राम', dual: 'हे रामौ', plural: 'हे रामाः' }
        ]
      },
      'लता': {
        stem: 'लता (latā)',
        stemType: 'आकारान्त स्त्रीलिङ्गः (ā-ending Feminine)',
        meaning: 'Creeper / Vine',
        rows: [
          { caseName: 'प्रथमा (Nominative)', karaka: 'कर्तृ (Subject)', singular: 'लता', dual: 'लते', plural: 'लताः' },
          { caseName: 'द्वितीया (Accusative)', karaka: 'कर्म (Object)', singular: 'लताम्', dual: 'लते', plural: 'लताः' },
          { caseName: 'तृतीया (Instrumental)', karaka: 'करण (Instrument/Agent)', singular: 'लतया', dual: 'लताभ्याम्', plural: 'लताभिः' },
          { caseName: 'चतुर्थी (Dative)', karaka: 'सम्प्रदान (Recipient)', singular: 'लतायै', dual: 'लताभ्याम्', plural: 'लताभ्यः' },
          { caseName: 'पञ्चमी (Ablative)', karaka: 'अपादान (Source/Origin)', singular: 'लतायाः', dual: 'लताभ्याम्', plural: 'लताभ्यः' },
          { caseName: 'षष्ठी (Genitive)', karaka: 'सम्बन्ध (Possessor)', singular: 'लतायाः', dual: 'लतयोः', plural: 'लतानाम्' },
          { caseName: 'सप्तमी (Locative)', karaka: 'अधिकरण (Location/Time)', singular: 'लतायाम्', dual: 'लतयोः', plural: 'लतासु' },
          { caseName: 'सम्बोधन (Vocative)', karaka: 'आमन्त्रण (Address)', singular: 'हे लते', dual: 'हे लते', plural: 'हे लताः' }
        ]
      },
      'फल': {
        stem: 'फल (phala)',
        stemType: 'अकारान्त नपुंसकलिङ्गः (a-ending Neuter)',
        meaning: 'Fruit / Result',
        rows: [
          { caseName: 'प्रथमा (Nominative)', karaka: 'कर्तृ (Subject)', singular: 'फलम्', dual: 'फले', plural: 'फलानि' },
          { caseName: 'द्वितीया (Accusative)', karaka: 'कर्म (Object)', singular: 'फलम्', dual: 'फले', plural: 'फलानि' },
          { caseName: 'तृतीया (Instrumental)', karaka: 'करण (Instrument/Agent)', singular: 'फलेन', dual: 'फलाभ्याम्', plural: 'फलैः' },
          { caseName: 'चतुर्थी (Dative)', karaka: 'सम्प्रदान (Recipient)', singular: 'फलाय', dual: 'फलाभ्याम्', plural: 'फलेभ्यः' },
          { caseName: 'पञ्चमी (Ablative)', karaka: 'अपादान (Source/Origin)', singular: 'फलात्', dual: 'फलाभ्याम्', plural: 'फलेभ्यः' },
          { caseName: 'षष्ठी (Genitive)', karaka: 'सम्बन्ध (Possessor)', singular: 'फलस्य', dual: 'फलयोः', plural: 'फलानाम्' },
          { caseName: 'सप्तमी (Locative)', karaka: 'अधिकरण (Location/Time)', singular: 'फले', dual: 'फलयोः', plural: 'फलेषु' },
          { caseName: 'सम्बोधन (Vocative)', karaka: 'आमन्त्रण (Address)', singular: 'हे फल', dual: 'हे फले', plural: 'हे फलानि' }
        ]
      },
      'गुरु': {
        stem: 'गुरु (guru)',
        stemType: 'उकारान्त पुंल्लिङ्गः (u-ending Masculine)',
        meaning: 'Teacher / Heavy / Venerable',
        rows: [
          { caseName: 'प्रथमा (Nominative)', karaka: 'कर्तृ (Subject)', singular: 'गुरुः', dual: 'गुरू', plural: 'गुरवः' },
          { caseName: 'द्वितीया (Accusative)', karaka: 'कर्म (Object)', singular: 'गुरुम्', dual: 'गुरू', plural: 'गुरुन्' },
          { caseName: 'तृतीया (Instrumental)', karaka: 'करण (Instrument/Agent)', singular: 'गुरुणा', dual: 'गुरुभ्याम्', plural: 'गुरुभिः' },
          { caseName: 'चतुर्थी (Dative)', karaka: 'सम्प्रदान (Recipient)', singular: 'गुरवे', dual: 'गुरुभ्याम्', plural: 'गुरुभ्यः' },
          { caseName: 'पञ्चमी (Ablative)', karaka: 'अपादान (Source/Origin)', singular: 'गुरोः', dual: 'गुरुभ्याम्', plural: 'गुरुभ्यः' },
          { caseName: 'षष्ठी (Genitive)', karaka: 'सम्बन्ध (Possessor)', singular: 'गुरोः', dual: 'गुर्वोः', plural: 'गुरुणाम्' },
          { caseName: 'सप्तमी (Locative)', karaka: 'अधिकरण (Location/Time)', singular: 'गुरौ', dual: 'गुर्वोः', plural: 'गुरुषु' },
          { caseName: 'सम्बोधन (Vocative)', karaka: 'आमन्त्रण (Address)', singular: 'हे गुरो', dual: 'हे गुरू', plural: 'हे गुरवः' }
        ]
      }
    };

    return matrices[stem] || matrices['राम'];
  }

  /**
   * Pāṇinian Sūtras Explorer Database
   */
  public static getPaniniSutras(): any[] {
    return [
      {
        sutra: 'वृद्धिरादैच्',
        number: '१.१.१',
        topic: 'Saṃjñā (Technical Definitions)',
        meaning: 'आ, ऐ, and औ are termed "Vṛddhi".',
        context: 'First sūtra of the Aṣṭādhyāyī, establishing the phonetic lengthening term used in Sandhi.'
      },
      {
        sutra: 'अदेङ्गुणः',
        number: '१.१.२',
        topic: 'Saṃjñā (Technical Definitions)',
        meaning: 'अ, ए, and ओ are termed "Guṇa".',
        context: 'Defines the standard vowel grade transformations.'
      },
      {
        sutra: 'इको यणचि',
        number: '६.१.७७',
        topic: 'Sandhi (Yaṇ-Sandhi)',
        meaning: 'इ, उ, ऋ, ऌ transform into य्, व्, र्, ल् when followed by a dissimilar vowel.',
        context: 'Fundamental rule transforming vowels across morpheme boundaries (e.g. इति + आह = इत्याह).'
      },
      {
        sutra: 'आद्गुणः',
        number: '६.१.८७',
        topic: 'Sandhi (Guṇa-Sandhi)',
        meaning: 'When अ or आ is followed by an Ik vowel, both merge into a single Guṇa vowel.',
        context: 'e.g., महा + उत्सवः = महोत्सवः, नर + ईशः = नरेशः.'
      },
      {
        sutra: 'वृद्धिरेचि',
        number: '६.१.८८',
        topic: 'Sandhi (Vṛddhi-Sandhi)',
        meaning: 'When अ or आ is followed by ए, ऐ, ओ, औ, both merge into a Vṛddhi vowel.',
        context: 'e.g., एक + एकम् = एकैकम्, विद्या + ऐश्वर्यम् = विद्यैश्वर्यम्.'
      },
      {
        sutra: 'अकः सवर्णे दीर्घः',
        number: '६.१.१०१',
        topic: 'Sandhi (Dīrgha-Sandhi)',
        meaning: 'When a simple vowel is followed by its homogeneous vowel, both merge into a long vowel.',
        context: 'e.g., विद्या + आलयः = विद्यालयः, मुनि + इन्द्रः = मुनीन्द्रः.'
      },
      {
        sutra: 'कर्तरि प्रथमा',
        number: '२.३.४६',
        topic: 'Kāraka (Cases)',
        meaning: 'The nominative case (Prathamā) is used to denote the agent/subject in active voice.',
        context: 'e.g., रामः गच्छति (Rama goes).'
      },
      {
        sutra: 'कर्मणि द्वितीया',
        number: '२.३.२',
        topic: 'Kāraka (Cases)',
        meaning: 'The accusative case (Dvitīyā) is used to denote the direct object.',
        context: 'e.g., बालकः पुस्तकं पठति (The boy reads a book).'
      }
    ];
  }

  /**
   * Classical Graded Sanskrit Readers & Manuscripts
   */
  public static getGradedStories(): any[] {
    return [
      {
        id: 'panchatantra-blue-jackal',
        title: 'The Blue Jackal',
        titleSanskrit: 'नीलवर्णः शृगालः',
        source: 'Panchatantra (Mitrabheda)',
        difficulty: 'Beginner',
        summary: 'A jackal accidentally falls into an indigo vat in a dyer\'s shop and becomes blue. Believing he is a divine king appointed by Brahma, he rules the forest until a pack of jackals howls in the night.',
        sentences: [
          {
            sanskrit: 'कस्मिंश्चिद् वने चण्डरवः नाम शृगालः प्रतिवसति स्म।',
            iast: 'kasmiṃścid vane caṇḍaravaḥ nāma śṛgālaḥ prativasati sma.',
            padachheda: 'कस्मिंश्चित् वने चण्डरवः नाम शृगालः प्रतिवसति स्म',
            anvaya: 'कस्मिंश्चित् वने चण्डरवः नाम शृगालः प्रतिवसति स्म।',
            english: 'In a certain forest there lived a jackal named Chandarava.',
            words: [
              { word: 'कस्मिंश्चित्', stem: 'किञ्चित्', grammar: 'Locative Sing.', meaning: 'In a certain' },
              { word: 'वने', stem: 'वन', grammar: 'Locative Sing. (Adhikaraṇa)', meaning: 'in the forest' },
              { word: 'चण्डरवः', stem: 'चण्डरव', grammar: 'Nominative Sing. (Kartā)', meaning: 'Chandarava (Loud-howler)' },
              { word: 'शृगालः', stem: 'शृगाल', grammar: 'Nominative Sing.', meaning: 'jackal' },
              { word: 'प्रतिवसति स्म', stem: 'प्रति-वस्', grammar: 'Present + Sma (Past Habitual)', meaning: 'used to live' }
            ]
          },
          {
            sanskrit: 'सः एकदा क्षुधार्तः सन् नगरं प्रविष्टवान्।',
            iast: 'saḥ ekadā kṣudhārtaḥ san nagaraṃ praviṣṭavān.',
            padachheda: 'सः एकदा क्षुधा-आर्तः सन् नगरम् प्रविष्टवान्',
            anvaya: 'सः एकदा क्षुधार्तः सन् नगरं प्रविष्टवान्।',
            english: 'Once, afflicted by hunger, he entered the city.',
            words: [
              { word: 'सः', stem: 'तद्', grammar: 'Pronoun Nom. Sing.', meaning: 'He' },
              { word: 'एकदा', stem: 'एकदा', grammar: 'Avyaya (Adverb)', meaning: 'once upon a time' },
              { word: 'क्षुधार्तः', stem: 'क्षुधार्त', grammar: 'Adjective Nom. Sing.', meaning: 'pained by hunger' },
              { word: 'नगरम्', stem: 'नगर', grammar: 'Accusative Sing. (Karma)', meaning: 'the city' },
              { word: 'प्रविष्टवान्', stem: 'प्र-विश् + क्तवतु', grammar: 'Past Active Participle', meaning: 'entered' }
            ]
          },
          {
            sanskrit: 'तत्र रजकस्य नीलभाण्डे सः अकस्मात् अपतत्।',
            iast: 'tatra rajakasya nīlabhāṇḍe saḥ akasmāt apatat.',
            padachheda: 'तत्र रजकस्य नील-भाण्डे सः अकस्मात् अपतत्',
            anvaya: 'तत्र सः रजकस्य नीलभाण्डे अकस्मात् अपतत्।',
            english: 'There, he suddenly fell into a dyer\'s indigo vat.',
            words: [
              { word: 'तत्र', stem: 'तत्र', grammar: 'Avyaya', meaning: 'there' },
              { word: 'रजकस्य', stem: 'रजक', grammar: 'Genitive Sing. (Ṣaṣṭhī)', meaning: 'of the dyer / washerman' },
              { word: 'नीलभाण्डे', stem: 'नीलभाण्ड', grammar: 'Locative Sing.', meaning: 'in the indigo vat' },
              { word: 'अकस्मात्', stem: 'अकस्मात्', grammar: 'Avyaya (Ablative adverb)', meaning: 'all of a sudden' },
              { word: 'अपतत्', stem: 'पत् (Laṅ Past)', meaning: 'he fell' }
            ]
          }
        ]
      },
      {
        id: 'gita-chapter-2-sankhya',
        title: 'The Eternal Soul (Bhagavad Gita)',
        titleSanskrit: 'अविनाशितत्त्वम् (श्रीमद्भगवद्गीता)',
        source: 'Bhagavad Gita (Chapter 2, Verses 20-22)',
        difficulty: 'Intermediate',
        summary: 'Lord Krishna instructs Arjuna on the immortal, indestructible nature of the Self (Atman), which neither slays nor is slain.',
        sentences: [
          {
            sanskrit: 'न जायते म्रियते वा कदाचिन्नायं भूत्वा भविता वा न भूयः।',
            iast: 'na jāyate mriyate vā kadācin nāyaṃ bhūtvā bhavitā vā na bhūyaḥ.',
            padachheda: 'न जायते म्रियते वा कदाचित् न अयम् भूत्वा भविता वा न भूयः',
            anvaya: 'अयम् कदाचित् न जायते वा न म्रियते, भूत्वा वा भूयः भविता न।',
            english: 'The soul is never born, nor does it ever die; nor having come into being, will it ever cease to be.',
            words: [
              { word: 'न', stem: 'न', grammar: 'Negative particle', meaning: 'not / never' },
              { word: 'जायते', stem: 'जन् (Laṭ 3rd Sing. Ātmanepada)', meaning: 'is born' },
              { word: 'म्रियते', stem: 'मृ (Laṭ 3rd Sing. Ātmanepada)', meaning: 'dies' },
              { word: 'कदाचित्', stem: 'कदाचित्', grammar: 'Avyaya', meaning: 'at any time' },
              { word: 'अयम्', stem: 'इदम्', grammar: 'Pronoun Nom. Sing.', meaning: 'this (soul)' }
            ]
          },
          {
            sanskrit: 'वासांसि जीर्णानि यथा विहाय नवानि गृह्णाति नरोऽपराणि।',
            iast: 'vāsāṃsi jīrṇāni yathā vihāya navāni gṛhṇāti naro\'parāṇi.',
            padachheda: 'वासांसि जीर्णानि यथा विहाय नवानि गृह्णाति नरः अपराणि',
            anvaya: 'यथा नरः जीर्णानि वासांसि विहाय अपराणि नवानि गृह्णाति।',
            english: 'Just as a person casts off worn-out garments and puts on new ones...',
            words: [
              { word: 'वासांसि', stem: 'वासस्', grammar: 'Neuter Acc. Plural', meaning: 'garments / clothes' },
              { word: 'जीर्णानि', stem: 'जीर्ण', grammar: 'Neuter Acc. Plural', meaning: 'worn-out / old' },
              { word: 'विहाय', stem: 'वि-हा + ल्यप्', grammar: 'Gerund / Indeclinable Participle', meaning: 'having discarded' },
              { word: 'गृह्णाति', stem: 'ग्रह् (Laṭ 3rd Sing.)', meaning: 'takes / dons' },
              { word: 'नरः', stem: 'नर', grammar: 'Nom. Sing.', meaning: 'a human / person' }
            ]
          }
        ]
      }
    ];
  }

  /**
   * Classical Sanskrit Subhāṣita (Wisdom Verse) Library
   */
  public static getSubhashitas(): any[] {
    return [
      {
        id: 1,
        verseSanskrit: 'उद्यमेन हि सिध्यन्ति कार्याणि न मनोरथैः।\nन हि सुप्तस्य सिंहस्य प्रविशन्ति मुखे मृगाः॥',
        verseIast: 'udyamena hi sidhyanti kāryāṇi na manorathaiḥ |\nna hi suptasya siṃhasya praviśanti mukhe mṛgāḥ ||',
        source: 'Hitopadesha (Prastāvikā)',
        meter: 'अनुष्टुप् (Anuṣṭubh)',
        padachheda: 'उद्यमेन हि सिध्यन्ति कार्याणि न मनोरथैः । न हि सुप्तस्य सिंहस्य प्रविशन्ति मुखे मृगाः ॥',
        anvaya: 'कार्याणि उद्यमेन हि सिध्यन्ति, मनोरथैः न। सुप्तस्य सिंहस्य मुखे मृगाः न हि प्रविशन्ति।',
        wordMeanings: [
          { word: 'उद्यमेन', meaning: 'Through diligent effort / hard work (Tṛtīyā)' },
          { word: 'सिध्यन्ति', meaning: 'Succeed / are accomplished (Laṭ Plural)' },
          { word: 'कार्याणि', meaning: 'Tasks / endeavors (Neuter Plural)' },
          { word: 'मनोरथैः', meaning: 'By mere wishful thinking / desires' },
          { word: 'सुप्तस्य', meaning: 'Of the sleeping (Ṣaṣṭhī Participle)' },
          { word: 'सिंहस्य', meaning: 'Of the lion' },
          { word: 'प्रविशन्ति', meaning: 'Enter' },
          { word: 'मुखे', meaning: 'Into the mouth (Saptamī Locative)' },
          { word: 'मृगाः', meaning: 'Deer / prey' }
        ],
        englishTranslation: 'Tasks are accomplished through diligent effort, never by mere wishful thinking; prey does not walk into the mouth of a sleeping lion.',
        philosophicalPurport: 'Action and dedication are indispensable for achievement. Potential alone without sustained effort yields no fruits.',
        grammarNotes: 'Illustrates the Instrumental case (उद्यमेन, मनोरथैः) denoting agency/means, and the Genitive case (सिंहस्य, सुप्तस्य) denoting possession.'
      },
      {
        id: 2,
        verseSanskrit: 'विद्या ददाति विनयं विनयाद्याति पात्रताम्।\nपात्रत्वाद्धनमाप्नोति धनाद्धर्मं ततः सुखम्॥',
        verseIast: 'vidyā dadāti vinayaṃ vinayād yāti pātratām |\npātratvād dhanam āpnoti dhanād dharmaṃ tataḥ sukham ||',
        source: 'Hitopadesha',
        meter: 'अनुष्टुप् (Anuṣṭubh)',
        padachheda: 'विद्या ददाति विनयम् विनयात् याति पात्रताम् । पात्रत्वात् धनम् आप्नोति धनात् धर्मम् ततः सुखम् ॥',
        anvaya: 'विद्या विनयं ददाति, विनयात् पात्रतां याति, पात्रत्वात् धनम् आप्नोति, धनात् धर्मं ततः सुखम्।',
        wordMeanings: [
          { word: 'विद्या', meaning: 'True knowledge / wisdom (Nominative)' },
          { word: 'ददाति', meaning: 'Gives / bestows (Laṭ)' },
          { word: 'विनयम्', meaning: 'Humility / modesty (Accusative)' },
          { word: 'पात्रताम्', meaning: 'Worthiness / capacity' },
          { word: 'आप्नोति', meaning: 'Attains / gains' },
          { word: 'धर्मम्', meaning: 'Righteousness / duty' },
          { word: 'सुखम्', meaning: 'True happiness / peace' }
        ],
        englishTranslation: 'True learning bestows humility; from humility arises worthiness; from worthiness one attains prosperity; from wealth comes righteousness, and thence enduring happiness.',
        philosophicalPurport: 'The holistic hierarchy of education: Knowledge begins with modesty and culminates in virtuous living and contentment.',
        grammarNotes: 'Exemplifies the causal progression of the Ablative case (विनयात्, पात्रत्वात्, धनात् - "from / because of").'
      },
      {
        id: 3,
        verseSanskrit: 'अयं निजः परो वेति गणना लघुचेतसाम्।\nउदारचरितानां तु वसुधैव कुटुम्बकम्॥',
        verseIast: 'ayaṃ nijaḥ paro veti gaṇanā laghucetasām |\nudāracaritānāṃ tu vasudhaiva kuṭumbakam ||',
        source: 'Maha Upanishad (6.71)',
        meter: 'अनुष्टुप् (Anuṣṭubh)',
        padachheda: 'अयम् निजः परः वा इति गणना लघु-चेतसाम् । उदार-चरितानाम् तु वसुधा एव कुटुम्बकम् ॥',
        anvaya: 'अयम् निजः परः वा इति गणना लघुचेतसां भवति। उदारचरितानां तु वसुधा एव कुटुम्बकम्।',
        wordMeanings: [
          { word: 'अयम्', meaning: 'This person' },
          { word: 'निजः', meaning: 'One\'s own / friend' },
          { word: 'परः', meaning: 'Stranger / other' },
          { word: 'गणना', meaning: 'Calculation / narrow reckoning' },
          { word: 'लघुचेतसाम्', meaning: 'Of small-minded people (Genitive)' },
          { word: 'उदारचरितानाम्', meaning: 'Of noble-hearted souls' },
          { word: 'वसुधा', meaning: 'The entire Earth / world' },
          { word: 'कुटुम्बकम्', meaning: 'One single family' }
        ],
        englishTranslation: '"This one is mine, that one is an outsider" — such is the reckoning of the narrow-minded; for the noble-hearted, the entire earth is but one single family.',
        philosophicalPurport: 'The timeless Vedic philosophy of universal compassion, oneness, and boundless inclusivity.',
        grammarNotes: 'Demonstrates Sandhi transformations (वसुधा + एव = वसुधैव [Vṛddhi]) and Genitive plural compounds (लघुचेतसाम्, उदारचरितानाम्).'
      }
    ];
  }

  // ==============================================================================
  // Indic Script Transliteration & Multilingual Translation Engine
  // ==============================================================================

  private static scriptBases: Record<string, number> = {
    devanagari: 0x0900,
    bengali: 0x0980,
    tamil: 0x0B80,
    telugu: 0x0C00,
    kannada: 0x0C80,
    malayalam: 0x0D00
  };

  /**
   * Convert Unicode Indic script to Devanagari
   */
  public static indicToDevanagari(text: string, scriptName: string): string {
    const base = this.scriptBases[scriptName];
    if (!base) return text;

    let res = '';
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      if (code >= base && code <= base + 0x7F) {
        const devCode = 0x0900 + (code - base);
        res += String.fromCharCode(devCode);
      } else {
        res += text[i];
      }
    }
    return res;
  }

  /**
   * Convert Devanagari to target Indic script (Tamil, Telugu, Kannada, Malayalam, etc.)
   */
  public static devanagariToIndic(text: string, scriptName: string): string {
    const base = this.scriptBases[scriptName];
    if (!base) return text;

    // Custom mappings for Tamil non-aspirated letters & grantha
    const tamilOverrides: Record<string, string> = {
      'ख': 'க', 'ग': 'க', 'घ': 'க',
      'छ': 'ச', 'झ': 'ச',
      'ठ': 'ட', 'ड': 'ட', 'ढ': 'ட',
      'थ': 'த', 'द': 'த', 'ध': 'த',
      'फ': 'ப', 'ब': 'ப', 'भ': 'ப',
      'श': 'ஶ', 'ष': 'ஷ', 'स': 'ஸ', 'ह': 'ஹ',
      'ऋ': 'ரி', 'ॠ': 'ரீ', 'ऌ': 'லி'
    };

    if (scriptName === 'tamil') {
      let tRes = '';
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (tamilOverrides[ch]) {
          tRes += tamilOverrides[ch];
        } else {
          const code = text.charCodeAt(i);
          if (code >= 0x0900 && code <= 0x097F) {
            const tCode = base + (code - 0x0900);
            tRes += String.fromCharCode(tCode);
          } else {
            tRes += ch;
          }
        }
      }
      return tRes;
    }

    let res = '';
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      if (code >= 0x0900 && code <= 0x097F) {
        const tgtCode = base + (code - 0x0900);
        res += String.fromCharCode(tgtCode);
      } else {
        res += text[i];
      }
    }
    return res;
  }

  /**
   * Universal Multilingual Sentence & Phrase Translation Engine
   * Converts input from English, Tamil, Telugu, Hindi, Kannada, Malayalam into authentic Sanskrit
   */
  public static translateSentence(
    text: string,
    sourceLang: string = 'en',
    targetLang: string = 'sa'
  ): MultilingualTranslationResult {
    const raw = text.trim();
    const lower = raw.toLowerCase();

    // Multilingual Pre-mapped Corpus of standard & conversational Sanskrit expressions
    const corpus: Array<{
      triggers: { en?: string[]; hi?: string[]; ta?: string[]; te?: string[]; kn?: string[]; ml?: string[] };
      sanskrit: string;
      iast: string;
      gloss: Array<{ sourceWord: string; sanskritWord: string; iast: string; role: string; meaning: string }>;
      explanation: string;
    }> = [
      {
        triggers: {
          en: ['the boy reads a book', 'boy reads book', 'boy is reading a book', 'the boy is reading a book'],
          hi: ['बालक पुस्तक पढ़ता है', 'लड़का किताब पढ़ता है', 'लड़का पुस्तक पढ़ रहा है'],
          ta: ['சிறுவன் புத்தகம் படிக்கிறான்', 'பையன் புத்தகம் படிக்கிறான்'],
          te: ['బాలుడు పుస్తకం చదువుతున్నాడు', 'పిల్లవాడు పుస్తకం చదువుతున్నాడు'],
          kn: ['ಹುಡುಗ ಪುಸ್ತಕವನ್ನು ಓದುತ್ತಾನೆ'],
          ml: ['ബാലൻ പുസ്തകം വായിക്കുന്നു']
        },
        sanskrit: 'बालकः पुस्तकं पठति।',
        iast: 'bālakaḥ pustakaṃ paṭhati.',
        gloss: [
          { sourceWord: 'The boy', sanskritWord: 'बालकः', iast: 'bālakaḥ', role: 'Kartā (Subject / Prathamā Sg)', meaning: 'The boy' },
          { sourceWord: 'a book', sanskritWord: 'पुस्तकम्', iast: 'pustakam', role: 'Karma (Object / Dvitīyā Sg)', meaning: 'Book' },
          { sourceWord: 'reads', sanskritWord: 'पठति', iast: 'paṭhati', role: 'Kriyā (Verb / Root पठ्, Laṭ 3rd Sg)', meaning: 'Reads' }
        ],
        explanation: 'Subject बालकः in Nominative singular, Object पुस्तकम् in Accusative singular, and Verb पठति in Present tense 3rd person singular.'
      },
      {
        triggers: {
          en: ['i learn sanskrit', 'i am learning sanskrit', 'i study sanskrit', 'i am studying sanskrit'],
          hi: ['मैं संस्कृत सीखता हूँ', 'मैं संस्कृत पढ़ता हूँ', 'मैं संस्कृत सीख रहा हूँ'],
          ta: ['நான் சமஸ்கிருதம் கற்கிறேன்', 'நான் சமஸ்கிருதம் படிக்கிறேன்'],
          te: ['నేను సంస్కృతం నేర్చుకుంటున్నాను', 'నేను సంస్కృతం చదువుతున్నాను'],
          kn: ['ನಾನು ಸಂಸ್ಕೃತವನ್ನು ಕಲಿಯುತ್ತಿದ್ದೇನೆ'],
          ml: ['ഞാൻ സംസ്കൃതം പഠിക്കുന്നു']
        },
        sanskrit: 'अहं संस्कृतं पठामि।',
        iast: 'ahaṃ saṃskṛtaṃ paṭhāmi.',
        gloss: [
          { sourceWord: 'I', sanskritWord: 'अहम्', iast: 'aham', role: 'Kartā (1st Person Pronoun / Prathamā Sg)', meaning: 'I' },
          { sourceWord: 'Sanskrit', sanskritWord: 'संस्कृतम्', iast: 'saṃskṛtam', role: 'Karma (Object / Dvitīyā Sg)', meaning: 'Sanskrit language' },
          { sourceWord: 'learn / study', sanskritWord: 'पठामि', iast: 'paṭhāmi', role: 'Kriyā (Root पठ्, Laṭ 1st Sg)', meaning: 'I read / learn' }
        ],
        explanation: 'First person pronoun अहम् agrees with the 1st person verb ending -आमि (पठामि).'
      },
      {
        triggers: {
          en: ['rama goes to the forest', 'rama goes to forest', 'rama is going to the forest'],
          hi: ['राम वन जाता है', 'राम जंगल जाता है', 'राम वन को जाता है'],
          ta: ['ராமர் காட்டிற்கு செல்கிறார்', 'ராமன் காட்டுக்கு போகிறான்'],
          te: ['రాముడు అడవికి వెళ్తున్నాడు', 'రాముడు అరణ్యమునకు వెళ్ళుచున్నాడు'],
          kn: ['ರಾಮನು ಕಾಡಿಗೆ ಹೋಗುತ್ತಾನೆ'],
          ml: ['രാമൻ കാട്ടിലേക്ക് പോകുന്നു']
        },
        sanskrit: 'रामः वनं गच्छति।',
        iast: 'rāmaḥ vanaṃ gacchati.',
        gloss: [
          { sourceWord: 'Rama', sanskritWord: 'रामः', iast: 'rāmaḥ', role: 'Kartā (Subject / Prathamā Sg)', meaning: 'Rama' },
          { sourceWord: 'to the forest', sanskritWord: 'वनम्', iast: 'vanam', role: 'Karma (Destination / Dvitīyā Sg)', meaning: 'To the forest' },
          { sourceWord: 'goes', sanskritWord: 'गच्छति', iast: 'gacchati', role: 'Kriyā (Root गम्, Laṭ 3rd Sg)', meaning: 'Goes' }
        ],
        explanation: 'Destination वनम् takes the Accusative case (Dvitīyā) governed by the motion verb गच्छति.'
      },
      {
        triggers: {
          en: ['water is life', 'water alone is life', 'water indeed is life'],
          hi: ['जल ही जीवन है', 'पानी ही जीवन है'],
          ta: ['நீரே வாழ்வு', 'நீர் வாழ்வின் ஆதாரம்', 'தண்ணீரே வாழ்க்கை'],
          te: ['నీరే జీవనం', 'నీరు జీవనాధారం'],
          kn: ['ನೀರೆ ಜೀವನ'],
          ml: ['ജലം തന്നെയാണ് ജീവൻ']
        },
        sanskrit: 'जलम् एव जीवनम्।',
        iast: 'jalam eva jīvanam.',
        gloss: [
          { sourceWord: 'Water', sanskritWord: 'जलम्', iast: 'jalam', role: 'Kartā (Subject Noun Neuter)', meaning: 'Water' },
          { sourceWord: 'alone / indeed', sanskritWord: 'एव', iast: 'eva', role: 'Avyaya (Emphatic Particle)', meaning: 'Alone / verily' },
          { sourceWord: 'life', sanskritWord: 'जीवनम्', iast: 'jīvanam', role: 'Vidheya (Predicate Noun Neuter)', meaning: 'Life' }
        ],
        explanation: 'Equational sentence with copula omitted, reinforced with emphatic particle एव.'
      },
      {
        triggers: {
          en: ['truth alone triumphs', 'truth triumphs', 'truth alone wins'],
          hi: ['सत्य की ही जीत होती है', 'सत्यमेव जयते', 'सत्य ही जीतता है'],
          ta: ['வாய்மையே வெல்லும்', 'சத்தியமே வெல்லும்'],
          te: ['సత్యమే గెలుస్తుంది', 'సత్యమే జయిస్తుంది'],
          kn: ['ಸತ್ಯವೇ ಗೆಲ್ಲುತ್ತದೆ'],
          ml: ['സത്യം മാത്രമേ ജയിക്കൂ']
        },
        sanskrit: 'सत्यम् एव जयते।',
        iast: 'satyam eva jayate.',
        gloss: [
          { sourceWord: 'Truth', sanskritWord: 'सत्यम्', iast: 'satyam', role: 'Kartā (Subject)', meaning: 'Truth / Righteousness' },
          { sourceWord: 'alone', sanskritWord: 'एव', iast: 'eva', role: 'Avyaya (Emphatic)', meaning: 'Alone' },
          { sourceWord: 'triumphs', sanskritWord: 'जयते', iast: 'jayate', role: 'Kriyā (Root जि, Ātmanepada Laṭ)', meaning: 'Triumphs' }
        ],
        explanation: 'Mundaka Upanishad 3.1.6 motto of India; verb जयते is in the Ātmanepada voice.'
      },
      {
        triggers: {
          en: ['knowledge illuminates everything', 'knowledge illuminates all'],
          hi: ['ज्ञान सब कुछ प्रकाशित करता है', 'ज्ञान सबको प्रकाशित करता है'],
          ta: ['அறிவு அனைத்தையும் ஒளிரச் செய்கிறது', 'ஞானம் அனைத்தையும் பிரகாசிக்கிறது'],
          te: ['జ్ఞానం అన్నింటినీ ప్రకాశింపజేస్తుంది'],
          kn: ['ಜ್ಞಾನವು ಎಲ್ಲವನ್ನೂ ಬೆಳಗಿಸುತ್ತದೆ'],
          ml: ['ജ്ഞാനം എല്ലാറ്റിനെയും പ്രകാശിപ്പിക്കുന്നു']
        },
        sanskrit: 'ज्ञानं प्रकाशयति सर्वम्।',
        iast: 'jñānaṃ prakāśayati sarvam.',
        gloss: [
          { sourceWord: 'Knowledge', sanskritWord: 'ज्ञानम्', iast: 'jñānam', role: 'Kartā (Subject Neuter)', meaning: 'Knowledge / Wisdom' },
          { sourceWord: 'illuminates', sanskritWord: 'प्रकाशयति', iast: 'prakāśayati', role: 'Kriyā (Causative Verb)', meaning: 'Illuminates / Reveals' },
          { sourceWord: 'everything', sanskritWord: 'सर्वम्', iast: 'sarvam', role: 'Karma (Object Accusative)', meaning: 'Everything / All' }
        ],
        explanation: 'The causative verb प्रकाशयति illuminates the universal accusative object सर्वम्.'
      },
      {
        triggers: {
          en: ['where is the temple', 'where is the temple?'],
          hi: ['मन्दिर कहाँ है?', 'मंदिर कहाँ है'],
          ta: ['கோவில் எங்கே இருக்கிறது?', 'கோயில் எங்கே?'],
          te: ['గుడి ఎక్కడ ఉంది?', 'ఆలయం ఎక్కడ ఉంది?'],
          kn: ['ದೇವಾಲಯ ಎಲ್ಲಿದೆ?'],
          ml: ['ക്ഷേത്രം എവിടെയാണ്?']
        },
        sanskrit: 'मन्दिरं कुत्र अस्ति?',
        iast: 'mandiraṃ kutra asti?',
        gloss: [
          { sourceWord: 'The temple', sanskritWord: 'मन्दिरम्', iast: 'mandiram', role: 'Kartā (Subject)', meaning: 'Temple' },
          { sourceWord: 'where', sanskritWord: 'कुत्र', iast: 'kutra', role: 'Avyaya (Interrogative Adverb)', meaning: 'Where' },
          { sourceWord: 'is', sanskritWord: 'अस्ति', iast: 'asti', role: 'Kriyā (Root अस्, 3rd Sg)', meaning: 'Is / exists' }
        ],
        explanation: 'Interrogative sentence using the locative adverb कुत्र (where) and copula अस्ति (is).'
      },
      {
        triggers: {
          en: ['what is your name', 'what is your name?'],
          hi: ['आपका नाम क्या है?', 'तुम्हारा नाम क्या है?'],
          ta: ['உங்கள் பெயர் என்ன?', 'உன் பெயர் என்ன?'],
          te: ['మీ పేరు ఏమిటి?', 'నీ పేరు ఏమిటి?'],
          kn: ['ನಿಮ್ಮ ಹೆಸರು ಏನು?'],
          ml: ['നിങ്ങളുടെ പേരെന്താണ്?']
        },
        sanskrit: 'भवतः नाम किम्?',
        iast: 'bhavataḥ nāma kim?',
        gloss: [
          { sourceWord: 'Your', sanskritWord: 'भवतः', iast: 'bhavataḥ', role: 'Sambandha (Genitive Masc Polite)', meaning: 'Your (respectful)' },
          { sourceWord: 'name', sanskritWord: 'नाम', iast: 'nāma', role: 'Kartā (Neuter Noun)', meaning: 'Name' },
          { sourceWord: 'what', sanskritWord: 'किम्', iast: 'kim', role: 'Interrogative Pronoun', meaning: 'What' }
        ],
        explanation: 'Polite inquiry using भवतः (masculine) or भवत्याः (feminine) with nominative neuter नाम.'
      },
      {
        triggers: {
          en: ['my name is vidyarthi', 'my name is student'],
          hi: ['मेरा नाम विद्यार्थी है'],
          ta: ['என் பெயர் வித்யார்த்தி', 'எனது பெயர் மாணவன்'],
          te: ['నా పేరు విద్యార్థి'],
          kn: ['ನನ್ನ ಹೆಸರು ವಿದ್ಯಾರ್ಥಿ'],
          ml: ['എന്റെ പേര് വിദ്യാർത്ഥി']
        },
        sanskrit: 'मम नाम विद्यार्थी अस्ति।',
        iast: 'mama nāma vidyārthī asti.',
        gloss: [
          { sourceWord: 'My', sanskritWord: 'मम', iast: 'mama', role: 'Sambandha (6th Case Pronoun)', meaning: 'My' },
          { sourceWord: 'name', sanskritWord: 'नाम', iast: 'nāma', role: 'Subject Noun', meaning: 'Name' },
          { sourceWord: 'Vidyarthi', sanskritWord: 'विद्यार्थी', iast: 'vidyārthī', role: 'Predicate Noun', meaning: 'Student / Seeker' },
          { sourceWord: 'is', sanskritWord: 'अस्ति', iast: 'asti', role: 'Verb', meaning: 'Is' }
        ],
        explanation: 'Possessive pronoun मम with predicate noun विद्यार्थी.'
      }
    ];

    // Check exact corpus trigger matches across language keys
    for (const item of corpus) {
      const matchFound = Object.entries(item.triggers).some(([lang, phrases]) => {
        return phrases.some(phrase => {
          const normPhrase = phrase.toLowerCase().replace(/[.?!,]/g, '').trim();
          const normInput = lower.replace(/[.?!,]/g, '').trim();
          return normInput === normPhrase || normInput.includes(normPhrase);
        });
      });

      if (matchFound) {
        let scriptRendition = item.sanskrit;
        if (sourceLang === 'ta') {
          scriptRendition = this.devanagariToIndic(item.sanskrit, 'tamil');
        } else if (sourceLang === 'te') {
          scriptRendition = this.devanagariToIndic(item.sanskrit, 'telugu');
        } else if (sourceLang === 'kn') {
          scriptRendition = this.devanagariToIndic(item.sanskrit, 'kannada');
        } else if (sourceLang === 'ml') {
          scriptRendition = this.devanagariToIndic(item.sanskrit, 'malayalam');
        }

        return {
          originalText: raw,
          sourceLang,
          targetLang,
          sanskritDevanagari: item.sanskrit,
          sanskritIast: item.iast,
          sanskritNativeScript: scriptRendition,
          translatedText: item.sanskrit,
          gloss: item.gloss,
          explanation: item.explanation
        };
      }
    }

    // Dynamic Indic & English Morphological Translation Engine
    // Check if input is Indic script text (Tamil, Telugu, Hindi, etc.)
    const isTamil = /[\u0B80-\u0BFF]/.test(raw);
    const isTelugu = /[\u0C00-\u0C7F]/.test(raw);
    const isKannada = /[\u0C80-\u0CFF]/.test(raw);
    const isMalayalam = /[\u0D00-\u0D7F]/.test(raw);
    const isDevanagari = /[\u0900-\u097F]/.test(raw);

    // Multilingual Dictionary Word Bank
    const multiDict: Record<string, { sa: string; iast: string; role: string; meaning: string }> = {
      // English words
      'boy': { sa: 'बालकः', iast: 'bālakaḥ', role: 'Kartā (Nom)', meaning: 'Boy' },
      'girl': { sa: 'बालिका', iast: 'bālikā', role: 'Kartā (Nom)', meaning: 'Girl' },
      'book': { sa: 'पुस्तकम्', iast: 'pustakam', role: 'Karma (Acc)', meaning: 'Book' },
      'water': { sa: 'जलम्', iast: 'jalam', role: 'Kartā / Karma', meaning: 'Water' },
      'sun': { sa: 'सूर्यः', iast: 'sūryaḥ', role: 'Kartā (Nom)', meaning: 'Sun' },
      'moon': { sa: 'चन्द्रः', iast: 'candraḥ', role: 'Kartā (Nom)', meaning: 'Moon' },
      'king': { sa: 'नृपः', iast: 'nṛpaḥ', role: 'Kartā (Nom)', meaning: 'King' },
      'forest': { sa: 'वनम्', iast: 'vanam', role: 'Karma (Acc)', meaning: 'Forest' },
      'friend': { sa: 'मित्रम्', iast: 'mitram', role: 'Kartā (Nom)', meaning: 'Friend' },
      'teacher': { sa: 'गुरुः', iast: 'guruḥ', role: 'Kartā (Nom)', meaning: 'Teacher / Guru' },
      'student': { sa: 'छात्रः', iast: 'chātraḥ', role: 'Kartā (Nom)', meaning: 'Student' },
      'temple': { sa: 'मन्दिरम्', iast: 'mandiram', role: 'Karma (Acc)', meaning: 'Temple' },
      'reads': { sa: 'पठति', iast: 'paṭhati', role: 'Kriyā (Verb)', meaning: 'Reads' },
      'writes': { sa: 'लिखति', iast: 'likhati', role: 'Kriyā (Verb)', meaning: 'Writes' },
      'goes': { sa: 'गच्छति', iast: 'gacchati', role: 'Kriyā (Verb)', meaning: 'Goes' },
      'comes': { sa: 'आगच्छति', iast: 'āgacchati', role: 'Kriyā (Verb)', meaning: 'Comes' },
      'sees': { sa: 'पश्यति', iast: 'paśyati', role: 'Kriyā (Verb)', meaning: 'Sees' },
      'speaks': { sa: 'वदति', iast: 'vadati', role: 'Kriyā (Verb)', meaning: 'Speaks' },
      'knows': { sa: 'जानाति', iast: 'jānāti', role: 'Kriyā (Verb)', meaning: 'Knows' },
      'is': { sa: 'अस्ति', iast: 'asti', role: 'Kriyā (Copula)', meaning: 'Is / exists' },
      'i': { sa: 'अहम्', iast: 'aham', role: 'Kartā (1st Sg)', meaning: 'I' },
      'you': { sa: 'त्वम्', iast: 'tvam', role: 'Kartā (2nd Sg)', meaning: 'You' },
      'he': { sa: 'सः', iast: 'saḥ', role: 'Kartā (3rd Sg)', meaning: 'He' },
      'she': { sa: 'सा', iast: 'sā', role: 'Kartā (3rd Sg)', meaning: 'She' },
      'they': { sa: 'ते', iast: 'te', role: 'Kartā (3rd Pl)', meaning: 'They' },
      'we': { sa: 'वयम्', iast: 'vayam', role: 'Kartā (1st Pl)', meaning: 'We' },

      // Tamil Words (தமிழ்)
      'சிறுவன்': { sa: 'बालकः', iast: 'bālakaḥ', role: 'Kartā (Subject)', meaning: 'Boy' },
      'சிறுமி': { sa: 'बालिका', iast: 'bālikā', role: 'Kartā (Subject)', meaning: 'Girl' },
      'புத்தகம்': { sa: 'पुस्तकम्', iast: 'pustakam', role: 'Karma (Object)', meaning: 'Book' },
      'நீர்': { sa: 'जलम्', iast: 'jalam', role: 'Subject / Object', meaning: 'Water' },
      'தண்ணீர்': { sa: 'जलम्', iast: 'jalam', role: 'Subject / Object', meaning: 'Water' },
      'சூரியன்': { sa: 'सूर्यः', iast: 'sūryaḥ', role: 'Subject', meaning: 'Sun' },
      'சந்திரன்': { sa: 'चन्द्रः', iast: 'candraḥ', role: 'Subject', meaning: 'Moon' },
      'அரசன்': { sa: 'नृपः', iast: 'nṛpaḥ', role: 'Subject', meaning: 'King' },
      'காடு': { sa: 'वनम्', iast: 'vanam', role: 'Object', meaning: 'Forest' },
      'நண்பன்': { sa: 'मित्रम्', iast: 'mitram', role: 'Subject', meaning: 'Friend' },
      'ஆசிரியர்': { sa: 'गुरुः', iast: 'guruḥ', role: 'Subject', meaning: 'Teacher' },
      'மாணவன்': { sa: 'छात्रः', iast: 'chātraḥ', role: 'Subject', meaning: 'Student' },
      'கோவில்': { sa: 'मन्दिरम्', iast: 'mandiram', role: 'Object', meaning: 'Temple' },
      'கோயில்': { sa: 'मन्दिरम्', iast: 'mandiram', role: 'Object', meaning: 'Temple' },
      'படிக்கிறான்': { sa: 'पठति', iast: 'paṭhati', role: 'Kriyā (Verb)', meaning: 'Reads' },
      'எழுதுகிறான்': { sa: 'लिखति', iast: 'likhati', role: 'Kriyā (Verb)', meaning: 'Writes' },
      'செல்கிறான்': { sa: 'गच्छति', iast: 'gacchati', role: 'Kriyā (Verb)', meaning: 'Goes' },
      'வருகிறான்': { sa: 'आगच्छति', iast: 'āgacchati', role: 'Kriyā (Verb)', meaning: 'Comes' },
      'பார்க்கிறான்': { sa: 'पश्यति', iast: 'paśyati', role: 'Kriyā (Verb)', meaning: 'Sees' },
      'பேசுகிறான்': { sa: 'वदति', iast: 'vadati', role: 'Kriyā (Verb)', meaning: 'Speaks' },
      'அறிகிறான்': { sa: 'जानाति', iast: 'jānāti', role: 'Kriyā (Verb)', meaning: 'Knows' },
      'நான்': { sa: 'अहम्', iast: 'aham', role: 'Pronoun (I)', meaning: 'I' },
      'நீ': { sa: 'त्वम्', iast: 'tvam', role: 'Pronoun (You)', meaning: 'You' },
      'அவன்': { sa: 'सः', iast: 'saḥ', role: 'Pronoun (He)', meaning: 'He' },
      'அவள்': { sa: 'सा', iast: 'sā', role: 'Pronoun (She)', meaning: 'She' },
      'நாங்கள்': { sa: 'वयम्', iast: 'vayam', role: 'Pronoun (We)', meaning: 'We' },

      // Telugu Words (తెలుగు)
      'బాలుడు': { sa: 'बालकः', iast: 'bālakaḥ', role: 'Kartā (Subject)', meaning: 'Boy' },
      'బాలిక': { sa: 'बालिका', iast: 'bālikā', role: 'Kartā (Subject)', meaning: 'Girl' },
      'పుస్తకం': { sa: 'पुस्तकम्', iast: 'pustakam', role: 'Karma (Object)', meaning: 'Book' },
      'నీరు': { sa: 'जलम्', iast: 'jalam', role: 'Subject / Object', meaning: 'Water' },
      'సూర్యుడు': { sa: 'सूर्यः', iast: 'sūryaḥ', role: 'Subject', meaning: 'Sun' },
      'చంద్రుడు': { sa: 'चन्द्रः', iast: 'candraḥ', role: 'Subject', meaning: 'Moon' },
      'రాజు': { sa: 'नृपः', iast: 'nṛpaḥ', role: 'Subject', meaning: 'King' },
      'అడవి': { sa: 'वनम्', iast: 'vanam', role: 'Object', meaning: 'Forest' },
      'మిత్రుడు': { sa: 'मित्रम्', iast: 'mitram', role: 'Subject', meaning: 'Friend' },
      'గురువు': { sa: 'गुरुः', iast: 'guruḥ', role: 'Subject', meaning: 'Teacher' },
      'విద్యార్థి': { sa: 'छात्रः', iast: 'chātraḥ', role: 'Subject', meaning: 'Student' },
      'గుడి': { sa: 'मन्दिरम्', iast: 'mandiram', role: 'Object', meaning: 'Temple' },
      'చదువుతున్నాడు': { sa: 'पठति', iast: 'paṭhati', role: 'Kriyā (Verb)', meaning: 'Reads' },
      'రాస్తున్నాడు': { sa: 'लिखति', iast: 'likhati', role: 'Kriyā (Verb)', meaning: 'Writes' },
      'వెళ్తున్నాడు': { sa: 'गच्छति', iast: 'gacchati', role: 'Kriyā (Verb)', meaning: 'Goes' },
      'వస్తున్నాడు': { sa: 'आगच्छति', iast: 'āgacchati', role: 'Kriyā (Verb)', meaning: 'Comes' },
      'చూస్తున్నాడు': { sa: 'पश्यति', iast: 'paśyati', role: 'Kriyā (Verb)', meaning: 'Sees' },
      'మాట్లాడుతున్నాడు': { sa: 'वदति', iast: 'vadati', role: 'Kriyā (Verb)', meaning: 'Speaks' },
      'తెలుసుకుంటున్నాడు': { sa: 'जानाति', iast: 'jānāti', role: 'Kriyā (Verb)', meaning: 'Knows' },
      'నేను': { sa: 'अहम्', iast: 'aham', role: 'Pronoun (I)', meaning: 'I' },
      'నువ్వు': { sa: 'त्वम्', iast: 'tvam', role: 'Pronoun (You)', meaning: 'You' },
      'అతను': { sa: 'सः', iast: 'saḥ', role: 'Pronoun (He)', meaning: 'He' },
      'ఆమె': { sa: 'सा', iast: 'sā', role: 'Pronoun (She)', meaning: 'She' },
      'మేము': { sa: 'वयम्', iast: 'vayam', role: 'Pronoun (We)', meaning: 'We' },

      // Hindi Words (हिन्दी)
      'लड़का': { sa: 'बालकः', iast: 'bālakaḥ', role: 'Kartā (Subject)', meaning: 'Boy' },
      'लड़की': { sa: 'बालिका', iast: 'bālikā', role: 'Kartā (Subject)', meaning: 'Girl' },
      'किताब': { sa: 'पुस्तकम्', iast: 'pustakam', role: 'Karma (Object)', meaning: 'Book' },
      'पुस्तक': { sa: 'पुस्तकम्', iast: 'pustakam', role: 'Karma (Object)', meaning: 'Book' },
      'पानी': { sa: 'जलम्', iast: 'jalam', role: 'Subject / Object', meaning: 'Water' },
      'सूरज': { sa: 'सूर्यः', iast: 'sūryaḥ', role: 'Subject', meaning: 'Sun' },
      'चाँद': { sa: 'चन्द्रः', iast: 'candraḥ', role: 'Subject', meaning: 'Moon' },
      'राजा': { sa: 'नृपः', iast: 'nṛpaḥ', role: 'Subject', meaning: 'King' },
      'जंगल': { sa: 'वनम्', iast: 'vanam', role: 'Object', meaning: 'Forest' },
      'दोस्त': { sa: 'मित्रम्', iast: 'mitram', role: 'Subject', meaning: 'Friend' },
      'मित्र': { sa: 'मित्रम्', iast: 'mitram', role: 'Subject', meaning: 'Friend' },
      'शिक्षक': { sa: 'गुरुः', iast: 'guruḥ', role: 'Subject', meaning: 'Teacher' },
      'विद्यार्थी': { sa: 'छात्रः', iast: 'chātraḥ', role: 'Subject', meaning: 'Student' },
      'मंदिर': { sa: 'मन्दिरम्', iast: 'mandiram', role: 'Object', meaning: 'Temple' },
      'पढ़ता': { sa: 'पठति', iast: 'paṭhati', role: 'Kriyā (Verb)', meaning: 'Reads' },
      'लिखता': { sa: 'लिखति', iast: 'likhati', role: 'Kriyā (Verb)', meaning: 'Writes' },
      'जाता': { sa: 'गच्छति', iast: 'gacchati', role: 'Kriyā (Verb)', meaning: 'Goes' },
      'आता': { sa: 'आगच्छति', iast: 'āgacchati', role: 'Kriyā (Verb)', meaning: 'Comes' },
      'देखता': { sa: 'पश्यति', iast: 'paśyati', role: 'Kriyā (Verb)', meaning: 'Sees' },
      'बोलता': { sa: 'वदति', iast: 'vadati', role: 'Kriyā (Verb)', meaning: 'Speaks' },
      'जानता': { sa: 'जानाति', iast: 'jānāti', role: 'Kriyā (Verb)', meaning: 'Knows' },
      'मैं': { sa: 'अहम्', iast: 'aham', role: 'Pronoun (I)', meaning: 'I' },
      'तू': { sa: 'त्वम्', iast: 'tvam', role: 'Pronoun (You)', meaning: 'You' },
      'तुम': { sa: 'त्वम्', iast: 'tvam', role: 'Pronoun (You)', meaning: 'You' },
      'वह': { sa: 'सः', iast: 'saḥ', role: 'Pronoun (He/She)', meaning: 'He / She' },
      'हम': { sa: 'वयम्', iast: 'vayam', role: 'Pronoun (We)', meaning: 'We' }
    };

    const words = raw.split(/[\s,.:;!?-]+/).filter(w => w.trim().length > 0);
    const saTokens: string[] = [];
    const gloss: Array<{ sourceWord: string; sanskritWord: string; iast: string; role: string; meaning: string }> = [];

    for (const w of words) {
      const cleanW = w.toLowerCase().trim();
      const match = multiDict[cleanW] || multiDict[w];

      if (match) {
        saTokens.push(match.sa);
        gloss.push({
          sourceWord: w,
          sanskritWord: match.sa,
          iast: match.iast,
          role: match.role,
          meaning: match.meaning
        });
      } else {
        // If not in word bank, transliterate directly
        let translit = w;
        if (isTamil) translit = this.indicToDevanagari(w, 'tamil');
        else if (isTelugu) translit = this.indicToDevanagari(w, 'telugu');
        else if (isKannada) translit = this.indicToDevanagari(w, 'kannada');
        else if (isMalayalam) translit = this.indicToDevanagari(w, 'malayalam');
        else if (!isDevanagari) translit = this.iastToDevanagari(w);

        const iast = this.devanagariToIast(translit);
        saTokens.push(translit);
        gloss.push({
          sourceWord: w,
          sanskritWord: translit,
          iast,
          role: 'Linguistic Token',
          meaning: w
        });
      }
    }

    const sanskritDevanagari = saTokens.join(' ') + (saTokens.length > 0 ? '।' : '');
    const sanskritIast = this.devanagariToIast(sanskritDevanagari);
    
    let sanskritNativeScript = sanskritDevanagari;
    if (sourceLang === 'ta' || isTamil) {
      sanskritNativeScript = this.devanagariToIndic(sanskritDevanagari, 'tamil');
    } else if (sourceLang === 'te' || isTelugu) {
      sanskritNativeScript = this.devanagariToIndic(sanskritDevanagari, 'telugu');
    } else if (sourceLang === 'kn' || isKannada) {
      sanskritNativeScript = this.devanagariToIndic(sanskritDevanagari, 'kannada');
    } else if (sourceLang === 'ml' || isMalayalam) {
      sanskritNativeScript = this.devanagariToIndic(sanskritDevanagari, 'malayalam');
    }

    return {
      originalText: raw,
      sourceLang,
      targetLang,
      sanskritDevanagari,
      sanskritIast,
      sanskritNativeScript,
      translatedText: sanskritDevanagari,
      gloss,
      explanation: `Synthesized Sanskrit utterance with ${gloss.length} aligned grammatical morphological tokens.`
    };
  }
}

