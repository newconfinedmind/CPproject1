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
  const existingAnswer = answers.find((a) => a.questionId === question.questionId);
  const [value, setValue] = useState<string | number>(
    existingAnswer ? existingAnswer.value : ''
  );

  // 메타데이터 관련 상태
  const [initialRenderTime] = useState<number>(Date.now());
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [focusTime, setFocusTime] = useState<number | null>(null);
  const [blurTime, setBlurTime] = useState<number | null>(null);
  const [changeHistory, setChangeHistory] = useState<Array<{ value: string | number; time: number }>>([]);

  const handleChange = (newValue: string | number) => {
    setValue(newValue);

    const timestamp = Date.now();

    // 응답 시간을 처음 설정합니다.
    if (responseTime === null) {
      setResponseTime(timestamp);
    }

    // 변경 이력을 기록합니다.
    setChangeHistory((prevHistory) => [...prevHistory, { value: newValue, time: timestamp }]);

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
        changeHistory,
        focusTime,
        blurTime,
        // 기타 메타데이터 설정
       
      },
      persona: question.persona,
    });

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
