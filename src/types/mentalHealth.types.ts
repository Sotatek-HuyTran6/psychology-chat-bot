export interface MBISSScore {
  emotional_exhaustion: number;
  cynicism: number;
  professional_efficacy: number;
  assessment: string;
}

export interface MentalHealthEvaluation {
  emotion_state: string;
  stress_level: number;
  gad7_score: number;
  gad7_assessment: string;
  pss10_score: number;
  pss10_assessment: string;
  mbi_ss_score: MBISSScore;
  overall_mental_health: string;
}
