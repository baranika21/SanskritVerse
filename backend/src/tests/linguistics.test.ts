import { describe, it, expect } from 'vitest';
import { ComputationalLinguistics } from '../services/computationalLinguistics';

describe('Computational Linguistics Engine', () => {
  it('correctly transliterates Devanagari to IAST', () => {
    const dev = 'रामः वनं गच्छति।';
    const iast = ComputationalLinguistics.devanagariToIast(dev);
    expect(iast).toContain('rāmaḥ');
    expect(iast).toContain('vanaṃ');
    expect(iast).toContain('gacchati');
  });

  it('correctly transliterates IAST to Devanagari', () => {
    const iast = 'namaste';
    const dev = ComputationalLinguistics.iastToDevanagari(iast);
    expect(dev).toBe('नमस्ते');
  });

  it('tokenizes sentences correctly while stripping punctuation', () => {
    const sentence = 'ज्ञानं परमं बलम्।';
    const tokens = ComputationalLinguistics.tokenize(sentence);
    expect(tokens).toEqual(['ज्ञानं', 'परमं', 'बलम्']);
  });

  it('correctly identifies nominative case for Ramaḥ', () => {
    const analysis = ComputationalLinguistics.analyzeToken('रामः');
    expect(analysis.case).toBe('Prathamā');
    expect(analysis.karakaRole).toBe('Kartā (Subject)');
  });

  it('analyzes complex sentence structure and builds dependency graph', () => {
    const sentence = 'रामः वनं गच्छति।';
    const result = ComputationalLinguistics.analyzeSentence(sentence);
    expect(result.tokens.length).toBe(3);
    expect(result.dependencyGraph.nodes.length).toBeGreaterThanOrEqual(3);
    expect(result.englishTranslation).toContain('Rama');
  });

  it('translates Tamil and Telugu phrases into Sanskrit accurately', () => {
    const tamilRes = ComputationalLinguistics.translateSentence('நான் சமஸ்கிருதம் கற்கிறேன்', 'ta');
    expect(tamilRes.sanskritDevanagari).toBe('अहं संस्कृतं पठामि।');
    expect(tamilRes.gloss.length).toBeGreaterThan(0);

    const teluguRes = ComputationalLinguistics.translateSentence('రాముడు అడవికి వెళ్తున్నాడు', 'te');
    expect(teluguRes.sanskritDevanagari).toBe('रामः वनं गच्छति।');
  });

  it('translates Hindi and English phrases into Sanskrit accurately', () => {
    const hindiRes = ComputationalLinguistics.translateSentence('बालक पुस्तक पढ़ता है', 'hi');
    expect(hindiRes.sanskritDevanagari).toBe('बालकः पुस्तकं पठति।');

    const englishRes = ComputationalLinguistics.translateSentence('water is life', 'en');
    expect(englishRes.sanskritDevanagari).toBe('जलम् एव जीवनम्।');
  });

  it('transliterates across Indic scripts (Telugu/Tamil)', () => {
    const dev = 'रामः';
    const tel = ComputationalLinguistics.devanagariToIndic(dev, 'telugu');
    expect(tel).toBeDefined();
    expect(tel.length).toBeGreaterThan(0);
  });
});
