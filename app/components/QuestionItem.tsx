// components/QuestionItem.tsx

import React, { useState } from 'react';
import { useAnswerStore } from '../stores/useAnswerStore';
import { Question } from '../stores/useQuestionStore';
import QuestionInput from './QuestionInput';

type QuestionItemProps = {
  question: Question;
};

function QuestionItem({ question }: QuestionItemProps) {
  const { addAnswer, answers } = useAnswerStore();

  const existingAnswer = (() => {
    for (let i = answers.length - 1; i >= 0; i--) {
      if (answers[i].questionId === question.questionId) {
        return answers[i].value;
      }
    }
    return 0;
  })();
  const [value, setValue] = useState<number>(existingAnswer);


  // 메타데이터 관련 상태
  const [initialRenderTime] = useState<number>(Date.now());
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [focusTime, setFocusTime] = useState<number>(0);
  const [blurTime, setBlurTime] = useState<number>(0);
  const [changeHistory, setChangeHistory] = useState<Array<{ value: number; time: number }>>([]);

  
  const getScrollDepth = () => {
    const currentScrollTop =
      window.scrollY || document.documentElement.scrollTop || 0;
    
    const documentHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    
    // documentHeight가 0이면 depth를 0으로 설정합니다.
    const depth = documentHeight
      ? (currentScrollTop / documentHeight) * 100
      : 0;
    
    return depth;
  };
  
  
  const handleChange = (newValue: number) => {
    setValue(newValue);

    const timestamp = Date.now();

    // 응답 시간을 처음 설정합니다.
    if (responseTime === null) {
      setResponseTime(timestamp);
    }

  // 새로운 변경 이력을 직접 계산합니다.
  const newChangeHistory = [...changeHistory, { value: newValue, time: timestamp }];

  // 상태를 업데이트합니다.
  setChangeHistory(newChangeHistory);

    // **현재 스크롤 깊이 측정**
    const scrollDepth = getScrollDepth();
    // 응답 추가 또는 업데이트
    addAnswer({
      surveyId: question.surveyId,
      respondent: '응답자 이름', // 실제 응답자 정보로 대체
      questionId: question.questionId,
      questionType: question.questionType,
      value: newValue,
      metadata: {
        timestamp,
        initialRenderTime,
        responseTime: timestamp - initialRenderTime,
        changeHistory:newChangeHistory,
        focusTime,
        blurTime,
        scrollDepth
        // 기타 메타데이터 설정
       
      },
      persona: question.persona,
    })
    console.log('one step before');
    console.log(answers);

    
  };

  const handleFocus = () => {
    setFocusTime(Date.now());
  };

  const handleBlur = () => {
    setBlurTime(Date.now());
  };

 // components/QuestionItem.tsx

return (
  <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
    <p className="text-lg font-semibold mb-4">{question.text}</p>
    <QuestionInput
      question={question}
      value={value}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className="w-full"
    />
  </div>
);
}

export default QuestionItem;





// # **QuestionItem 컴포넌트**
// 위치: components/QuestionItem.tsx

// 역할:

// - 한 개의 질문 항목을 나타냅니다.
// - 입력된 답변의 상태 관리와 메타데이터 수집을 담당합니다.
// - QuestionInput을 사용하여 실제 입력 요소를 보여주고, 사용자 상호 작용을 처리합니다.
// - answers 배열을 업데이트하여 전역 상태를 관리합니다.

// 주요 기능:

// - 상태 관리:
//   - **value:** 현재 질문에 대한 사용자의 응답 값입니다.
//   - 메타데이터: 응답 시간, 변경 이력, 포커스 및 블러 시간, 스크롤 깊이 등을 추적합니다.
// - 함수들:
//   - **handleChange:** 입력값이 변경될 때 호출되어 상태를 업데이트하고 메타데이터를 기록합니다.
//   - **handleFocus, handleBlur:** 입력 요소에 포커스가 갔을 때와 벗어났을 때의 시간을 기록합니다.
// - 렌더링:
//   - 질문의 텍스트를 화면에 표시합니다.
//   - QuestionInput을 사용하여 입력 요소를 포함합니다.

// 요약:

// QuestionItem은 한 개의 질문을 나타내며, 사용자로부터의 응답과 메타데이터를 관리하고, 전역 상태에 변경 사항을 반영합니다.

