// ==============================================================================
// SANSKRITVERSE Computational Linguistics Controller
// ==============================================================================

import { Request, Response } from 'express';
import { ComputationalLinguistics, TransliterationScheme } from '../services/computationalLinguistics';
import { SandhiEngine } from '../services/sandhiEngine';

export class LinguisticsController {
  public static transliterate(req: Request, res: Response): void {
    const { text, from = 'devanagari', to = 'iast' } = req.body;

    if (!text) {
      res.status(400).json({ error: 'Text is required for transliteration.' });
      return;
    }

    const converted = ComputationalLinguistics.transliterate(
      text,
      from as TransliterationScheme,
      to as TransliterationScheme
    );

    res.json({
      original: text,
      from,
      to,
      result: converted
    });
  }

  public static tokenize(req: Request, res: Response): void {
    const { sentence } = req.body;
    if (!sentence) {
      res.status(400).json({ error: 'Sentence is required for tokenization.' });
      return;
    }

    const tokens = ComputationalLinguistics.tokenize(sentence);
    res.json({
      sentence,
      count: tokens.length,
      tokens
    });
  }

  public static analyzeSentence(req: Request, res: Response): void {
    const { sentence } = req.body;
    if (!sentence) {
      res.status(400).json({ error: 'Sentence is required for linguistic analysis.' });
      return;
    }

    const result = ComputationalLinguistics.analyzeSentence(sentence);
    res.json(result);
  }

  public static analyzeMorphology(req: Request, res: Response): void {
    const { word } = req.body;
    if (!word) {
      res.status(400).json({ error: 'Word is required for morphological analysis.' });
      return;
    }

    const analysis = ComputationalLinguistics.analyzeToken(word);
    res.json(analysis);
  }

  public static resolveSandhi(req: Request, res: Response): void {
    const { word1, word2 } = req.body;
    if (!word1 || !word2) {
      res.status(400).json({ error: 'Both word1 and word2 are required to resolve Sandhi.' });
      return;
    }

    const result = SandhiEngine.join(word1, word2);
    res.json(result);
  }

  public static getDhatuTree(req: Request, res: Response): void {
    const { root = 'गम्' } = req.query;

    const trees: Record<string, any> = {
      'गम्': {
        root: 'गम् (gam)',
        meaning: 'To go / move',
        gana: 'भ्वादिगणः (1st Class)',
        paradigm: {
          present_lat: {
            title: 'लट् लकारः (Present Tense)',
            forms: [
              { person: 'प्रथमः (3rd)', singular: 'गच्छति', dual: 'गच्छतः', plural: 'गच्छन्ति' },
              { person: 'मध्यमः (2nd)', singular: 'गच्छसि', dual: 'गच्छथः', plural: 'गच्छथ' },
              { person: 'उत्तमः (1st)', singular: 'गच्छामि', dual: 'गच्छावः', plural: 'गच्छामः' }
            ]
          },
          past_lang: {
            title: 'लङ् लकारः (Past Tense)',
            forms: [
              { person: 'प्रथमः (3rd)', singular: 'अगच्छत्', dual: 'अगच्छताम्', plural: 'अगच्छन्' },
              { person: 'मध्यमः (2nd)', singular: 'अगच्छः', dual: 'अगच्छतम्', plural: 'अगच्छत' },
              { person: 'उत्तमः (1st)', singular: 'अगच्छम्', dual: 'अगच्छाव', plural: 'अगच्छाम' }
            ]
          },
          future_lrit: {
            title: 'लृट् लकारः (Future Tense)',
            forms: [
              { person: 'प्रथमः (3rd)', singular: 'गमिष्यति', dual: 'गमिष्यतः', plural: 'गमिष्यन्ति' },
              { person: 'मध्यमः (2nd)', singular: 'गमिष्यसि', dual: 'गमिष्यथः', plural: 'गमिष्यथ' },
              { person: 'उत्तमः (1st)', singular: 'गमिष्यामि', dual: 'गमिष्यावः', plural: 'गमिष्यामः' }
            ]
          },
          kridanta_tree: [
            { affix: 'क्त (Past Passive)', form: 'गतः', meaning: 'Gone / departed' },
            { affix: 'क्तवतु (Past Active)', form: 'गतवान्', meaning: 'He who went' },
            { affix: 'क्त्वा (Gerund)', form: 'गत्वा', meaning: 'Having gone' },
            { affix: 'तुमुन् (Infinitive)', form: 'गन्तुम्', meaning: 'In order to go' },
            { affix: 'ल्युट् (Action Noun)', form: 'गमनम्', meaning: 'The act of going / movement' },
            { affix: 'तव्यत् (Obligation)', form: 'गन्तव्यम्', meaning: 'Ought to be gone' }
          ]
        }
      },
      'पठ्': {
        root: 'पठ् (paṭh)',
        meaning: 'To read / study',
        gana: 'भ्वादिगणः (1st Class)',
        paradigm: {
          present_lat: {
            title: 'लट् लकारः (Present Tense)',
            forms: [
              { person: 'प्रथमः (3rd)', singular: 'पठति', dual: 'पठतः', plural: 'पठन्ति' },
              { person: 'मध्यमः (2nd)', singular: 'पठसि', dual: 'पठथः', plural: 'पठथ' },
              { person: 'उत्तमः (1st)', singular: 'पठामि', dual: 'पठावः', plural: 'पठामः' }
            ]
          },
          kridanta_tree: [
            { affix: 'क्त (Past Passive)', form: 'पठितः', meaning: 'Read / studied' },
            { affix: 'क्त्वा (Gerund)', form: 'पठित्वा', meaning: 'Having read' },
            { affix: 'तुमुन् (Infinitive)', form: 'पठितुम्', meaning: 'In order to read' },
            { affix: 'ल्युट् (Action Noun)', form: 'पठनम्', meaning: 'The act of reading' }
          ]
        }
      },
      'भू': {
        root: 'भू (bhū)',
        meaning: 'To be / become',
        gana: 'भ्वादिगणः (1st Class)',
        paradigm: {
          present_lat: {
            title: 'लट् लकारः (Present Tense)',
            forms: [
              { person: 'प्रथमः (3rd)', singular: 'भवति', dual: 'भवतः', plural: 'भवन्ति' },
              { person: 'मध्यमः (2nd)', singular: 'भवसि', dual: 'भवथः', plural: 'भवथ' },
              { person: 'उत्तमः (1st)', singular: 'भवामि', dual: 'भवावः', plural: 'भवामः' }
            ]
          },
          kridanta_tree: [
            { affix: 'क्त (Past Passive)', form: 'भूतः', meaning: 'Been / become' },
            { affix: 'क्त्वा (Gerund)', form: 'भूत्वा', meaning: 'Having become' },
            { affix: 'तुमुन् (Infinitive)', form: 'भवितुम्', meaning: 'To become' },
            { affix: 'ल्युट् (Action Noun)', form: 'भवनम्', meaning: 'Becoming / abode' }
          ]
        }
      }
    };

    const tree = trees[root as string] || trees['गम्'];
    res.json(tree);
  }

  public static scanChhandas(req: Request, res: Response): void {
    const { verse } = req.body;
    if (!verse) {
      res.status(400).json({ error: 'Verse text is required for prosody scanning.' });
      return;
    }

    const result = ComputationalLinguistics.scanChhandas(verse);
    res.json(result);
  }

  public static analyzeSamasa(req: Request, res: Response): void {
    const { word } = req.body;
    if (!word) {
      res.status(400).json({ error: 'Compound word is required for Samāsa analysis.' });
      return;
    }

    const result = ComputationalLinguistics.analyzeSamasa(word);
    res.json(result);
  }

  public static getDeclensions(req: Request, res: Response): void {
    const { stem = 'राम', gender = 'masculine' } = req.query;
    const matrix = ComputationalLinguistics.getDeclensionMatrix(stem as string, gender as string);
    res.json(matrix);
  }

  public static getPaniniSutras(req: Request, res: Response): void {
    const sutras = ComputationalLinguistics.getPaniniSutras();
    res.json({ sutras, count: sutras.length });
  }

  public static getStories(req: Request, res: Response): void {
    const stories = ComputationalLinguistics.getGradedStories();
    res.json({ stories, count: stories.length });
  }

  public static getSubhashitas(req: Request, res: Response): void {
    const subhashitas = ComputationalLinguistics.getSubhashitas();
    res.json({ subhashitas, count: subhashitas.length });
  }

  public static translateSentence(req: Request, res: Response): void {
    const { text, sourceLang = 'en', targetLang = 'sa' } = req.body;
    if (!text) {
      res.status(400).json({ error: 'Text is required for translation.' });
      return;
    }

    const result = ComputationalLinguistics.translateSentence(text, sourceLang, targetLang);
    res.json(result);
  }
}

