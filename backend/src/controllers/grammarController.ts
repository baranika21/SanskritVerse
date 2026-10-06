// ==============================================================================
// SANSKRITVERSE Grammar Academy Controller
// ==============================================================================

import { Request, Response } from 'express';
import { db } from '../services/db';

export class GrammarController {
  public static getTopics(req: Request, res: Response): void {
    const store = db.getMemoryStore();
    res.json({ count: store['grammar_topics'].length, topics: store['grammar_topics'] });
  }

  public static getVibhaktis(req: Request, res: Response): void {
    const vibhaktis = [
      {
        case_num: 1,
        sanskrit: 'प्रथमा',
        english: 'Nominative',
        karaka: 'कर्ता (Agent / Subject)',
        question: 'कः / का / किम् (Who? / What?)',
        meaning: 'Performs the action',
        masc_endings: { sg: 'ः (ः)', du: 'ौ (au)', pl: 'ाः (āḥ)' },
        sample_noun: 'रामः (Rāmaḥ)',
        sentence_sanskrit: 'रामः वनं गच्छति।',
        sentence_iast: 'rāmaḥ vanaṃ gacchati.',
        sentence_english: 'Rama goes to the forest.'
      },
      {
        case_num: 2,
        sanskrit: 'द्वितीया',
        english: 'Accusative',
        karaka: 'कर्म (Object / Goal)',
        question: 'कम् / काम् / किम् (Whom? / Where to?)',
        meaning: 'Target or destination of action',
        masc_endings: { sg: 'म् (m)', du: 'ौ (au)', pl: 'ान् (ān)' },
        sample_noun: 'रामम् (Rāmam)',
        sentence_sanskrit: 'बालकः पुस्तकं पठति।',
        sentence_iast: 'bālakaḥ pustakaṃ paṭhati.',
        sentence_english: 'The boy reads a book.'
      },
      {
        case_num: 3,
        sanskrit: 'तृतीया',
        english: 'Instrumental',
        karaka: 'करण (Instrument / Means)',
        question: 'केन / कया (By / With whom/what?)',
        meaning: 'Instrument used or companion',
        masc_endings: { sg: 'ेण (eṇa)', du: 'ाभ्याम् (ābhyām)', pl: 'ैः (aiḥ)' },
        sample_noun: 'रामेण (Rāmeṇa)',
        sentence_sanskrit: 'अहं लेखन्या लिखामि।',
        sentence_iast: 'ahaṃ lekhanīyā likhāmi.',
        sentence_english: 'I write with a pen.'
      },
      {
        case_num: 4,
        sanskrit: 'चतुर्थी',
        english: 'Dative',
        karaka: 'सम्प्रदान (Recipient / Beneficiary)',
        question: 'कस्मै / कस्यै (To / For whom?)',
        meaning: 'Whom something is given to or meant for',
        masc_endings: { sg: 'ाय (āya)', du: 'ाभ्याम् (ābhyām)', pl: 'ेभ्यः (ebhyaḥ)' },
        sample_noun: 'रामाय (Rāmāya)',
        sentence_sanskrit: 'माता बालकाय दुग्धं ददाति।',
        sentence_iast: 'mātā bālakāya dugdhaṃ dadāti.',
        sentence_english: 'The mother gives milk to the boy.'
      },
      {
        case_num: 5,
        sanskrit: 'पञ्चमी',
        english: 'Ablative',
        karaka: 'अपादान (Source / Separation)',
        question: 'कस्मात् / कस्याः (From what / whom?)',
        meaning: 'Origin, starting point, or cause of fear',
        masc_endings: { sg: 'ात् (āt)', du: 'ाभ्याम् (ābhyām)', pl: 'ेभ्यः (ebhyaḥ)' },
        sample_noun: 'रामात् (Rāmāt)',
        sentence_sanskrit: 'वृक्षात् फलं पतति।',
        sentence_iast: 'vṛkṣāt phalaṃ patati.',
        sentence_english: 'A fruit falls from the tree.'
      },
      {
        case_num: 6,
        sanskrit: 'षष्ठी',
        english: 'Genitive',
        karaka: 'सम्बन्ध (Relation / Possession)',
        question: 'कस्य / कस्याः (Whose? / Of what?)',
        meaning: 'Ownership, belonging, or relational connection',
        masc_endings: { sg: 'स्य (sya)', du: 'योः (yoḥ)', pl: 'ाणाम् (āṇām)' },
        sample_noun: 'रामस्य (Rāmasya)',
        sentence_sanskrit: 'इदं रामस्य पुस्तकम् अस्ति।',
        sentence_iast: 'idaṃ rāmasya pustakam asti.',
        sentence_english: 'This is Rama\'s book.'
      },
      {
        case_num: 7,
        sanskrit: 'सप्तमी',
        english: 'Locative',
        karaka: 'अधिकरण (Location / Locus)',
        question: 'कस्मिन् / कस्याम् / कुत्र (Where? / In what?)',
        meaning: 'Place, time, or circumstance of action',
        masc_endings: { sg: 'े (e)', du: 'योः (yoḥ)', pl: 'ेषु (eṣu)' },
        sample_noun: 'रामे (Rāme)',
        sentence_sanskrit: 'मीनाः जले वसन्ति।',
        sentence_iast: 'mīnāḥ jale vasanti.',
        sentence_english: 'Fish live in water.'
      },
      {
        case_num: 8,
        sanskrit: 'सम्बोधनम्',
        english: 'Vocative',
        karaka: 'सम्बोधन (Direct Address)',
        question: 'हे... (O...!)',
        meaning: 'Calling or attracting attention',
        masc_endings: { sg: 'हे ...', du: 'हे ...ौ', pl: 'हे ...ाः' },
        sample_noun: 'हे राम! (He Rāma!)',
        sentence_sanskrit: 'हे गुरो! मां शिक्षय।',
        sentence_iast: 'he guro! māṃ śikṣaya.',
        sentence_english: 'O Teacher! Instruct me.'
      }
    ];

    res.json({ vibhaktis });
  }

  public static getDeclensionTable(req: Request, res: Response): void {
    const { word = 'राम' } = req.query;

    const tables: Record<string, any> = {
      'राम': {
        word: 'राम',
        gender: 'Masculine (अकारान्तः पुंलिङ्गः)',
        rows: [
          { case: 'प्रथमा (Nominative)', singular: 'रामः', dual: 'रामौ', plural: 'रामाः' },
          { case: 'द्वितीया (Accusative)', singular: 'रामम्', dual: 'रामौ', plural: 'रामान्' },
          { case: 'तृतीया (Instrumental)', singular: 'रामेण', dual: 'रामाभ्याम्', plural: 'रामैः' },
          { case: 'चतुर्थी (Dative)', singular: 'रामाय', dual: 'रामाभ्याम्', plural: 'रामेभ्यः' },
          { case: 'पञ्चमी (Ablative)', singular: 'रामात्', dual: 'रामाभ्याम्', plural: 'रामेभ्यः' },
          { case: 'षष्ठी (Genitive)', singular: 'रामस्य', dual: 'रामयोः', plural: 'रामाणाम्' },
          { case: 'सप्तमी (Locative)', singular: 'रामे', dual: 'रामयोः', plural: 'रामेषु' },
          { case: 'सम्बोधनम् (Vocative)', singular: 'हे राम', dual: 'हे रामौ', plural: 'हे रामाः' }
        ]
      },
      'लता': {
        word: 'लता',
        gender: 'Feminine (आकारान्तः स्त्रीलिङ्गः)',
        rows: [
          { case: 'प्रथमा (Nominative)', singular: 'लता', dual: 'लते', plural: 'लताः' },
          { case: 'द्वितीया (Accusative)', singular: 'लताम्', dual: 'लते', plural: 'लताः' },
          { case: 'तृतीया (Instrumental)', singular: 'लतया', dual: 'लताभ्याम्', plural: 'लताभिः' },
          { case: 'चतुर्थी (Dative)', singular: 'लतायै', dual: 'लताभ्याम्', plural: 'लताभ्यः' },
          { case: 'पञ्चमी (Ablative)', singular: 'लतायाः', dual: 'लताभ्याम्', plural: 'लताभ्यः' },
          { case: 'षष्ठी (Genitive)', singular: 'लतायाः', dual: 'लतयोः', plural: 'लतानाम्' },
          { case: 'सप्तमी (Locative)', singular: 'लतायाम्', dual: 'लतयोः', plural: 'लतासु' },
          { case: 'सम्बोधनम् (Vocative)', singular: 'हे लते', dual: 'हे लते', plural: 'हे लताः' }
        ]
      }
    };

    res.json(tables[word as string] || tables['राम']);
  }
}
