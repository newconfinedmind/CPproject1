// stores/useAnswerStore.ts

import { create } from 'zustand';

interface Answer {
  surveyId: string; // 설문지 ID
  respondent : string; //응답자 이름
  questionId: string; // 질문 ID
  questionType: string; // 질문 타입 (e.g., 'likert','multiple-choice')
  value: string| number; // 응답 값
  metadata: Metadata; // 메타데이터
  persona?: string; // 응답자의 페르소나 (필요 시)
}



interface Metadata {
  timestamp: number; // 응답이 제출된 시간
  initialRenderTime: number; // 질문이 처음 표시된 시간
  responseTime: number; // 응답까지 걸린 시간 (밀리초)
  changeHistory: Array<{ value: string | number; time: number }>; // 변경 이력
  focusTime?: number | null; // 포커스된 시간
  blurTime?: number | null; // 블러된 시간
  // 기타 필요한 메타데이터를 추가
}

// 타입 안정성 개선
interface SurveyState {
  answers: Answer[];
  addAnswer: (answer: Answer) => void;
  updateAnswer: (questionId: string, value: any) => void;
}

export const useAnswerStore = create<SurveyState>()((set) => ({
  answers: [],
  addAnswer: (answer) =>
    set((state) => ({
      answers: [...state.answers, answer],
    })),
  updateAnswer: (questionId, value) =>
    set((state) => ({
      answers: state.answers.map((answer) =>
        answer.questionId === questionId
          ? { ...answer, value }
          : answer
      ),
    })),
}));