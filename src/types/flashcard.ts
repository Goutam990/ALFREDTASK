export interface Flashcard {
  id: string;
  user_id: string;
  question: string;
  answer: string;
  box: number;
  next_review: string;
  created_at: string;
  last_reviewed: string | null;
}

export interface NewFlashcard {
  question: string;
  answer: string;
}