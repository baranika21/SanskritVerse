// ==============================================================================
// SANSKRITVERSE Sandhi Computational Engine
// Implements Pāṇinian rules for Svara (vowel), Vyañjana (consonant), & Visarga Sandhi
// ==============================================================================

export interface SandhiRuleResult {
  input1: string;
  input2: string;
  output: string;
  sutra: string;
  sutraName: string;
  sandhiType: 'Svara (Vowel)' | 'Vyañjana (Consonant)' | 'Visarga';
  explanation: string;
  steps: string[];
}

export class SandhiEngine {
  /**
   * Applies Sandhi transformation between two Sanskrit words / morphemes
   */
  public static join(p1: string, p2: string): SandhiRuleResult {
    const word1 = p1.trim();
    const word2 = p2.trim();

    // Check Visarga Sandhi rules
    const visargaRes = this.checkVisargaSandhi(word1, word2);
    if (visargaRes) return visargaRes;

    // Check Svara (Vowel) Sandhi rules
    const svaraRes = this.checkSvaraSandhi(word1, word2);
    if (svaraRes) return svaraRes;

    // Check Vyañjana (Consonant) Sandhi rules
    const vyanjanaRes = this.checkVyanjanaSandhi(word1, word2);
    if (vyanjanaRes) return vyanjanaRes;

    // Default fallback: direct concatenation
    return {
      input1: word1,
      input2: word2,
      output: `${word1} ${word2}`,
      sutra: 'संयोगः (Direct Union)',
      sutraName: 'Prakṛtibhāva / Concatenation',
      sandhiType: 'Svara (Vowel)',
      explanation: 'No euphonic sandhi alteration applies at this boundary; words remain in natural union.',
      steps: [
        `Word 1: "${word1}", Word 2: "${word2}"`,
        `Direct phonetic placement without elision.`
      ]
    };
  }

  private static checkVisargaSandhi(w1: string, w2: string): SandhiRuleResult | null {
    // 1. Utva Visarga Sandhi: अः + अ -> ओऽ (Pāṇini 6.1.113 अतो रोरप्लुतादप्लुते)
    if ((w1.endsWith('ः') || w1.endsWith(':')) && (w2.startsWith('अ') || w2.startsWith('a'))) {
      const stem1 = w1.replace(/[ः:]$/, '');
      const stem2 = w2.substring(1);
      const output = `${stem1}ोऽ${stem2}`;
      return {
        input1: w1,
        input2: w2,
        output,
        sutra: 'अतो रोरप्लुतादप्लुते (Pāṇini 6.1.113)',
        sutraName: 'Utva Visarga Sandhi (उत्व-सन्धिः)',
        sandhiType: 'Visarga',
        explanation: 'When short "a" preceded by visarga meets a following short "a", the visarga transforms to "u", merges with "a" into "o", and following "a" is replaced by avagraha (ऽ).',
        steps: [
          `Word 1: "${w1}" ending in "aḥ"`,
          `Word 2: "${w2}" beginning with "a"`,
          `Visarga (ः) converts to "u" -> "${stem1} + u" merges into "${stem1}ो"`,
          `Following "a" elides into avagraha (ऽ) -> "${output}"`
        ]
      };
    }

    // 2. Visarga Lopa before vowels other than 'a': (सः + इच्छति -> स इच्छति)
    if (w1 === 'सः' || w1 === 'एषः') {
      if (!w2.startsWith('अ')) {
        const stem1 = w1.replace('ः', '');
        return {
          input1: w1,
          input2: w2,
          output: `${stem1} ${w2}`,
          sutra: 'एतत्तदोः सुलोपोऽकोरनञ् समासे हलि (Pāṇini 6.1.132)',
          sutraName: 'Visarga Lopa Sandhi (लोप-सन्धिः)',
          sandhiType: 'Visarga',
          explanation: 'The visarga of "सः" and "एषः" is dropped before any consonant and vowels other than short "a".',
          steps: [
            `Special rule for "${w1}" before consonant or non-a vowel`,
            `Visarga dropped -> "${stem1} ${w2}"`
          ]
        };
      }
    }

    return null;
  }

  private static checkSvaraSandhi(w1: string, w2: string): SandhiRuleResult | null {
    // 1. Savarna Dīrgha Sandhi: अकः सवर्णे दीर्घः (Pāṇini 6.1.101)
    // विद्या + आलयः -> विद्यालयः | पुस्तक + आलयः -> पुस्तकालयः
    if ((w1.endsWith('ा') || w1.endsWith('अ') || !w1.match(/[ािीुूृेैोौंः]$/)) && (w2.startsWith('आ') || w2.startsWith('अ'))) {
      const stem1 = w1.endsWith('ा') ? w1.slice(0, -1) : (w1.endsWith('अ') ? w1.slice(0, -1) : w1);
      const stem2 = w2.substring(1);
      const output = `${stem1}ा${stem2}`;
      return {
        input1: w1,
        input2: w2,
        output,
        sutra: 'अकः सवर्णे दीर्घः (Pāṇini 6.1.101)',
        sutraName: 'Savarṇa Dīrgha Sandhi (दीर्घ-सन्धिः)',
        sandhiType: 'Svara (Vowel)',
        explanation: 'When similar homogeneous vowels meet (a/ā + a/ā), both vowels coalesce into their prolonged lengthened form (आ).',
        steps: [
          `Terminal vowel of "${w1}": short/long "a"`,
          `Initial vowel of "${w2}": short/long "a"`,
          `Rule applies: a + a -> ā (ा)`,
          `United form: "${output}"`
        ]
      };
    }

    // 2. Guṇa Sandhi: आद्गुणः (Pāṇini 6.1.87)
    // a/ā + i/ī -> e | a/ā + u/ū -> o | a/ā + ṛ/ṝ -> ar
    const isEndingInA = w1.endsWith('ा') || w1.endsWith('अ') || !w1.match(/[ािीुूृेैोौंः]$/);
    if (isEndingInA) {
      const base1 = w1.endsWith('ा') || w1.endsWith('अ') ? w1.slice(0, -1) : w1;

      // a + i/ī -> e (राम + इति -> रामेति, नर + ईशः -> नरेशः)
      if (w2.startsWith('इ') || w2.startsWith('ई')) {
        const stem2 = w2.substring(1);
        const output = `${base1}े${stem2}`;
        return {
          input1: w1,
          input2: w2,
          output,
          sutra: 'आद्गुणः (Pāṇini 6.1.87)',
          sutraName: 'Guṇa Sandhi (गुण-सन्धिः)',
          sandhiType: 'Svara (Vowel)',
          explanation: 'When "a" or "ā" is followed by "i" or "ī", both sounds merge into the guṇa diphthong "e" (े).',
          steps: [
            `Terminal sound of "${w1}": "a" / "ā"`,
            `Initial sound of "${w2}": "i" / "ī"`,
            `Guṇa transformation: a + i -> e`,
            `Result: "${output}"`
          ]
        };
      }

      // a + u/ū -> o (महा + उत्सवः -> महोत्सवः)
      if (w2.startsWith('उ') || w2.startsWith('ऊ')) {
        const stem2 = w2.substring(1);
        const output = `${base1}ो${stem2}`;
        return {
          input1: w1,
          input2: w2,
          output,
          sutra: 'आद्गुणः (Pāṇini 6.1.87)',
          sutraName: 'Guṇa Sandhi (गुण-सन्धिः)',
          sandhiType: 'Svara (Vowel)',
          explanation: 'When "a" or "ā" is followed by "u" or "ū", both sounds merge into the guṇa vowel "o" (ो).',
          steps: [
            `Terminal sound of "${w1}": "a" / "ā"`,
            `Initial sound of "${w2}": "u" / "ū"`,
            `Guṇa transformation: a + u -> o`,
            `Result: "${output}"`
          ]
        };
      }

      // a + ṛ -> ar (महा + ऋषिः -> महर्षिः)
      if (w2.startsWith('ऋ') || w2.startsWith('ॠ')) {
        const stem2 = w2.substring(1);
        // "ar" represented with repha (र्) or attached
        const output = `${base1}र्${stem2}`;
        return {
          input1: w1,
          input2: w2,
          output,
          sutra: 'आद्गुणः (Pāṇini 6.1.87) & उरण् रपरः (Pāṇini 1.1.51)',
          sutraName: 'Guṇa Sandhi with Repha (गुण-सन्धिः)',
          sandhiType: 'Svara (Vowel)',
          explanation: 'When "a" or "ā" meets "ṛ", they transform into "ar" (अ + ऋ -> अर्).',
          steps: [
            `Terminal sound of "${w1}": "a" / "ā"`,
            `Initial sound of "${w2}": "ṛ"`,
            `Transformation: a + ṛ -> ar`,
            `Result: "${output}"`
          ]
        };
      }

      // 3. Vṛddhi Sandhi: वृद्धिरेचि (Pāṇini 6.1.88)
      // a/ā + e/ai -> ai | a/ā + o/au -> au
      if (w2.startsWith('ए') || w2.startsWith('ऐ')) {
        const stem2 = w2.substring(1);
        const output = `${base1}ै${stem2}`;
        return {
          input1: w1,
          input2: w2,
          output,
          sutra: 'वृद्धिरेचि (Pāṇini 6.1.88)',
          sutraName: 'Vṛddhi Sandhi (वृद्धि-सन्धिः)',
          sandhiType: 'Svara (Vowel)',
          explanation: 'When "a" or "ā" is followed by "e" or "ai", they coalesce into the lengthened vṛddhi vowel "ai" (ै).',
          steps: [
            `Terminal sound of "${w1}": "a"`,
            `Initial sound of "${w2}": "e" / "ai"`,
            `Vṛddhi merger: a + e -> ai`,
            `Result: "${output}"`
          ]
        };
      }

      if (w2.startsWith('ओ') || w2.startsWith('औ')) {
        const stem2 = w2.substring(1);
        const output = `${base1}ौ${stem2}`;
        return {
          input1: w1,
          input2: w2,
          output,
          sutra: 'वृद्धिरेचि (Pāṇini 6.1.88)',
          sutraName: 'Vṛddhi Sandhi (वृद्धि-सन्धिः)',
          sandhiType: 'Svara (Vowel)',
          explanation: 'When "a" or "ā" is followed by "o" or "au", they coalesce into the vṛddhi vowel "au" (ौ).',
          steps: [
            `Terminal sound of "${w1}": "a"`,
            `Initial sound of "${w2}": "o" / "au"`,
            `Vṛddhi merger: a + o -> au`,
            `Result: "${output}"`
          ]
        };
      }
    }

    // 4. Yaṇ Sandhi: इको यणचि (Pāṇini 6.1.77)
    // i/ī + vowel -> y | u/ū + vowel -> v
    if (w1.endsWith('ि') || w1.endsWith('ी') || w1.endsWith('इ') || w1.endsWith('ई')) {
      const base1 = w1.replace(/[िी]$/, '').replace(/[इई]$/, '');
      const output = `${base1}्य्${w2}`;
      return {
        input1: w1,
        input2: w2,
        output: output.replace(/्([अ-ह])/g, '$1'), // smooth devanagari conjunct
        sutra: 'इको यणचि (Pāṇini 6.1.77)',
        sutraName: 'Yaṇ Sandhi (यण्-सन्धिः)',
        sandhiType: 'Svara (Vowel)',
        explanation: 'The vowel "i" or "ī" followed by an unlike vowel transforms into the semivowel "y" (य्). E.g. इति + आदि -> इत्यादि.',
        steps: [
          `Terminal sound of "${w1}": "i"`,
          `Initial vowel of "${w2}": unlike vowel`,
          `Semivowel shift: i -> y`,
          `Result: "${output}"`
        ]
      };
    }

    if (w1.endsWith('ु') || w1.endsWith('ू') || w1.endsWith('उ') || w1.endsWith('ऊ')) {
      const base1 = w1.replace(/[ुू]$/, '').replace(/[उऊ]$/, '');
      const output = `${base1}्व्${w2}`;
      return {
        input1: w1,
        input2: w2,
        output: output.replace(/्([अ-ह])/g, '$1'),
        sutra: 'इको यणचि (Pāṇini 6.1.77)',
        sutraName: 'Yaṇ Sandhi (यण्-सन्धिः)',
        sandhiType: 'Svara (Vowel)',
        explanation: 'The vowel "u" or "ū" followed by an unlike vowel transforms into the semivowel "v" (व्). E.g. सु + आगतम् -> स्वागतम्.',
        steps: [
          `Terminal sound of "${w1}": "u"`,
          `Initial vowel of "${w2}": unlike vowel`,
          `Semivowel shift: u -> v`,
          `Result: "${output}"`
        ]
      };
    }

    return null;
  }

  private static checkVyanjanaSandhi(w1: string, w2: string): SandhiRuleResult | null {
    // Anusvāra Sandhi: मोऽनुस्वारः (Pāṇini 8.3.23)
    // Final 'm' (म्) before consonant transforms to anusvāra (ं)
    if (w1.endsWith('म्') || w1.endsWith('म')) {
      const firstChar2 = w2.charAt(0);
      const isConsonant = /[क-ह]/.test(firstChar2);
      if (isConsonant) {
        const base1 = w1.replace(/म्$/, '').replace(/म$/, '');
        const output = `${base1}ं ${w2}`;
        return {
          input1: w1,
          input2: w2,
          output,
          sutra: 'मोऽनुस्वारः (Pāṇini 8.3.23)',
          sutraName: 'Anusvāra Sandhi (अनुस्वार-सन्धिः)',
          sandhiType: 'Vyañjana (Consonant)',
          explanation: 'Padānta "m" (म्) at the end of a word changes to anusvāra (ं) when followed by any consonant.',
          steps: [
            `Word 1 terminates in Padānta "m" (म्): "${w1}"`,
            `Word 2 begins with a consonant: "${w2}"`,
            `Transformation: "m" -> Anusvāra (ं)`,
            `Result: "${output}"`
          ]
        };
      }
    }

    return null;
  }
}
