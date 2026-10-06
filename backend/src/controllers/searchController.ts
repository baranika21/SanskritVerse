import { Request, Response } from 'express';
import { db } from '../services/db';

export class SearchController {
  public static search(req: Request, res: Response): void {
    const q = ((req.query.q as string) || '').trim().toLowerCase();
    if (!q) {
      res.json({ results: { vocabulary: [], grammar: [], lessons: [] } });
      return;
    }

    const store = db.getMemoryStore();

    const matchedVocab = store['vocabulary'].filter(w =>
      w.devanagari.includes(q) ||
      w.iast.toLowerCase().includes(q) ||
      w.english.toLowerCase().includes(q) ||
      w.category.toLowerCase().includes(q)
    );

    const matchedGrammar = store['grammar_topics'].filter(g =>
      g.title_sanskrit.includes(q) ||
      g.title_english.toLowerCase().includes(q) ||
      g.summary.toLowerCase().includes(q)
    );

    const matchedLessons = store['lessons'].filter(l =>
      l.title.toLowerCase().includes(q) ||
      l.title_sanskrit.includes(q) ||
      l.description.toLowerCase().includes(q)
    );

    res.json({
      query: q,
      results: {
        vocabulary: matchedVocab,
        grammar: matchedGrammar,
        lessons: matchedLessons
      }
    });
  }
}
