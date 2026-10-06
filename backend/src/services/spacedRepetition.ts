// ==============================================================================
// SANSKRITVERSE Spaced Repetition System (SuperMemo SM-2 Algorithm)
// Optimizes review intervals based on active recall performance
// ==============================================================================

export interface SrsItem {
  id: number;
  userId: number;
  wordId: number;
  srsStage: number;       // Repetition count
  easeFactor: number;     // Difficulty multiplier (defaults to 2.50)
  intervalDays: number;   // Days until next review
  correctCount: number;
  incorrectCount: number;
  lastReviewed: Date | null;
  nextReview: Date;
}

export interface SrsCalculationResult {
  srsStage: number;
  easeFactor: number;
  intervalDays: number;
  nextReview: Date;
  isCorrect: boolean;
}

export class SpacedRepetitionService {
  /**
   * Calculates new SM-2 intervals and ease factors based on user recall grade (0 - 5)
   * Grade 5: Perfect recall
   * Grade 4: Correct with hesitation
   * Grade 3: Correct with difficulty
   * Grade 2: Incorrect, but familiar
   * Grade 1: Incorrect, barely remembered
   * Grade 0: Total blackout
   */
  public static calculateNextReview(
    currentStage: number,
    currentEaseFactor: number,
    currentInterval: number,
    grade: number
  ): SrsCalculationResult {
    const validGrade = Math.max(0, Math.min(5, Math.round(grade)));
    const isCorrect = validGrade >= 3;

    let newStage = currentStage;
    let newInterval = currentInterval;

    // Calculate new Ease Factor (EF)
    // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    let newEaseFactor = currentEaseFactor + (0.1 - (5 - validGrade) * (0.08 + (5 - validGrade) * 0.02));
    if (newEaseFactor < 1.30) {
      newEaseFactor = 1.30;
    }

    if (!isCorrect) {
      // Failed recall -> reset repetitions and review tomorrow
      newStage = 0;
      newInterval = 1;
    } else {
      // Successful recall -> advance repetition interval
      if (newStage === 0) {
        newInterval = 1;
      } else if (newStage === 1) {
        newInterval = 6;
      } else {
        newInterval = Math.round(currentInterval * newEaseFactor);
      }
      newStage += 1;
    }

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

    return {
      srsStage: newStage,
      easeFactor: Number(newEaseFactor.toFixed(2)),
      intervalDays: newInterval,
      nextReview: nextReviewDate,
      isCorrect
    };
  }
}
