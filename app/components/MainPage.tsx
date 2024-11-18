    // components/MainPage.tsx
    'use client';

    import React, { useEffect } from 'react';
    import QuestionItem from './QuestionItem';
    import { useQuestionStore } from '@/stores/useQuestionStore';
    import { useAnswerStore } from '@/stores/useAnswerStore';
    import { convertJsAnswerArrayToCpp } from '../utils/wasmHelper';
    import {useSurveyModule} from '@/hooks/useSurveyModule';


    const MainPage = () => {
      const fetchQuestions = useQuestionStore((state) => state.fetchQuestions);
      const currentQuestions = useQuestionStore((state) => state.currentQuestions);
      const answers = useAnswerStore((state) => state.answers);
      const questions = useQuestionStore((state) => state.questions);
      const setCurrentQuestions = useQuestionStore((state) => state.setCurrentQuestions)
      //wasm 모듈 임포트, 시간오래 걸려서 async 로 바꿔야 할수도.
      const surveyModule = useSurveyModule();



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
    
      
        if (!surveyModule) {
          console.error('WASM 모듈이 로드되지 않았습니다.');
          return;}

              //wasm 모듈이 로드되었을 경우, 로딩 상태를 관리하기 위해 currentQuestions를 빈 배열로 설정합니다.
          setCurrentQuestions([]);

        // 추천 알고리즘 실행
        try {
          // WebAssembly 모듈 임포트 및 알고리즘 실행
      
          const answerVector = convertJsAnswerArrayToCpp(answers, surveyModule);

          
    // getNextQuestions 함수 호출 (질문 ID의 벡터를 반환한다고 가정)
    const nextQuestionIdsVector = surveyModule.getNextQuestions(answerVector);

    // 결과 변환 및 메모리 관리
    const nextQuestionIds :string[] = [];
    for (let i = 0; i < nextQuestionIdsVector.size(); i++) {
      const qId = nextQuestionIdsVector.get(i);
      nextQuestionIds.push(qId);

      // Embind 객체인 qId는 기본 타입이므로 delete 필요 없음
    }

    // Embind 벡터 객체 메모리 해제
    nextQuestionIdsVector.delete();

    // 모든 질문에서 반환된 questionId에 해당하는 질문을 찾음
    const nextQuestions = questions.filter((q) => nextQuestionIds.includes(q.questionId));

    // 상태에 설정
    setCurrentQuestions(nextQuestions);

    // Embind 객체 메모리 해제
    answerVector.delete();
        
    



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
              className={`px-4 py-2 bg-blue-500 text-white rounded ${
                !allAnswered ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
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
    