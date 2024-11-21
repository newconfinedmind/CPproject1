// stores/useQuestionStore.ts

import { create } from 'zustand';

export interface Question {
  questionId: string;
  surveyId: string;
  questionType: string;
  text: string;
  options: number[];
  persona: string;
}

interface QuestionState {
  questions: Question[];
  currentQuestions: Question[];
  fetchQuestions: () => Promise<void>;
  setCurrentQuestions: (questions: Question[]) => void;
}

export const useQuestionStore = create<QuestionState>((set) => ({
  questions: [],
  currentQuestions: [],
  fetchQuestions: async () => {



    try {
      const response = await fetch('/api/questions');
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      const data: Question[] = await response.json();
      set({ questions: data,
        currentQuestions: data.slice(0, 5), // 초기값 설정
       });
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  },
  setCurrentQuestions: (questions) => set({ currentQuestions: questions }),
}));
