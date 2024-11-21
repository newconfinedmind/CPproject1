// components/MainPage.tsx
'use client';

import React, { useEffect } from 'react';
import QuestionItem from './QuestionItem';
import { useQuestionStore } from '@/app/stores/useQuestionStore';
import { useAnswerStore } from '@/app/stores/useAnswerStore';
import { useSurveyModule } from '@/app/hooks/useSurveyModule';
import { convertAnswersArray, convertQuestionsArray } from '@/app/utils/convertJstoCpp';

const MainPage = () => {
  const fetchQuestions = useQuestionStore((state) => state.fetchQuestions);
  const answers = useAnswerStore((state) => state.answers); //상태를 구독
  const currentQuestions = useQuestionStore((state) => state.currentQuestions);
  const questions = useQuestionStore.getState().questions; // 한번만 불러와.

  const setCurrentQuestions = useQuestionStore((state) => state.setCurrentQuestions);

  //wasm 모듈 임포트, 시간오래 걸려서 async 로 바꿔야 할수도.
  const { surveyModule, error } = useSurveyModule();



  // surveyModule 로드 시 콘솔 출력
  useEffect(() => {
    if (surveyModule) {
      console.log('Survey module loaded:', surveyModule);
      console.log('Available methods:', Object.keys(surveyModule));
    }
  }, [surveyModule]);


  useEffect(() => {
    // questions 배열에 원소가 없을 때만 fetchQuestions를 호출합니다.
    if (questions.length === 0) {
      fetchQuestions();
    }
  }, [fetchQuestions, questions.length]);

  //질문의 개수가 바뀔 경우에도 실행됨.




  // 모든 것들이 응답되었는가?
  const allAnswered = currentQuestions.every((question) =>
    answers.some((answer) => answer.questionId === question.questionId)
  );



  const handleNext = async () => {
    console.log()
    console.log()
    if (!surveyModule) {
      console.error('WASM 모듈이 로드되지 않았습니다.');
      return;
    }

    //wasm 모듈이 로드되었을 경우, 로딩 상태를 관리하기 위해 currentQuestions를 빈 배열로 설정합니다.
    setCurrentQuestions([]);

    // 추천 알고리즘 실행
    try {
      // WebAssembly 모듈 임포트 및 알고리즘 실행

      // AnswerVector 생성
      // surveyModule은 Embind로 바인딩된 C++ 모듈입니다.
      // 이 모듈이 로드된 후 코드를 실행해야 합니다.

      // JavaScript에서 answers 배열을 C++의 AnswerVector로 변환
      // Convert the arrays

      
      const embindAnswers = convertAnswersArray(surveyModule, answers);
      const embindQuestions = convertQuestionsArray(surveyModule, questions);
      console.log(embindQuestions);
      
      
      
      // Call the C++ function
      const nextQuestionIds = surveyModule.getNextQuestions(
        embindAnswers,
        embindQuestions
      );


      // 모든 질문에서 반환된 questionId에 해당하는 질문을 찾음
      const nextQuestions = questions.filter((q) => nextQuestionIds.includes(q.questionId));

      // 상태에 설정
      setCurrentQuestions(nextQuestions);


    } catch (error) {
      console.error('추천 알고리즘 실행 중 오류 발생:', error);
      // 에러가 발생하면 이전 질문을 복원합니다.
      setCurrentQuestions(currentQuestions);
    }
  };



  if (currentQuestions.length === 0) {
    return <div>c++ 로 내가 만든 모듈이 당신의 메타데이터와 current question를 분석해 다음 추천 질문을 찾고 있습니다.</div>;
  }

  return (
    <div className="container mx-auto p-4">


      {!surveyModule && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
        </div>
      )}
      {currentQuestions.map((question) => (
        <QuestionItem key={question.questionId} question={question} />
      ))}
      <div className="flex justify-end mt-4">
        <button
          className={`px-4 py-2 bg-blue-500 text-white rounded ${!allAnswered ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
          onClick={handleNext}
          disabled={!allAnswered}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MainPage;
