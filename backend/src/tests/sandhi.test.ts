import { describe, it, expect } from 'vitest';
import { SandhiEngine } from '../services/sandhiEngine';

describe('Pāṇinian Sandhi Engine', () => {
  it('applies Savarṇa Dīrgha Sandhi: विद्या + आलयः -> विद्यालयः', () => {
    const result = SandhiEngine.join('विद्या', 'आलयः');
    expect(result.output).toBe('विद्यालयः');
    expect(result.sutraName).toContain('दीर्घ');
  });

  it('applies Guṇa Sandhi: राम + इति -> रामेति', () => {
    const result = SandhiEngine.join('राम', 'इति');
    expect(result.output).toBe('रामेति');
    expect(result.sutraName).toContain('गुण');
  });

  it('applies Guṇa Sandhi: महा + उत्सवः -> महोत्सवः', () => {
    const result = SandhiEngine.join('महा', 'उत्सवः');
    expect(result.output).toBe('महोत्सवः');
  });

  it('applies Utva Visarga Sandhi: कः + अयम् -> कोऽयम्', () => {
    const result = SandhiEngine.join('कः', 'अयम्');
    expect(result.output).toBe('कोऽयम्');
    expect(result.sandhiType).toBe('Visarga');
  });
});
