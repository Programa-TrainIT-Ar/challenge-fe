export interface QuizAnswer {
  question_id: string;
  selected_options: number[]; // índices de las opciones seleccionadas
}

export interface QuizSubmission {
  quiz_id: string;
  answers: QuizAnswer[];
  completed_at: string;
}

export interface QuizResult {
  quiz_id: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  passed: boolean;
  details: QuestionResult[];
}

export interface QuestionResult {
  question_id: string;
  question: string;
  user_answer: number[];
  correct_answer: number[];
  is_correct: boolean;
}

