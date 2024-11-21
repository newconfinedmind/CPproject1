// components/QuestionInput.tsx

import React from 'react';
import { Question } from '../stores/useQuestionStore';


type QuestionInputProps = {
  question: Question;
  value: number;
  onChange: (value: number) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string; 
};

function QuestionInput({ question, value, onChange, onFocus, onBlur }: QuestionInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = Number(e.target.value);
    onChange(newValue);
  };
  switch (question.questionType) {
    case 'likert5': {
      const options: number[] = [1, 2, 3, 4, 5];
      return (
        <div>
          {options.map((option) => (
            <label key={option} style={{ marginRight: '10px' }}>
              <input
                type="radio"
                name={question.questionId}
                value={option}
                checked={Number(value) === option}
                onChange={() => onChange(option)}
                onFocus={onFocus}
                onBlur={onBlur}
              />
              {option}
            </label>
          ))}
        </div>
      );
    }
    case 'likert7': {
      const options: number[] = [1, 2, 3, 4, 5, 6, 7];
      return (
        <div>
          {options.map((option) => (
            <label key={option} style={{ marginRight: '10px' }}>
              <input
                type="radio"
                name={question.questionId}
                value={option}
                checked={Number(value) === option}
                onChange={() => onChange(option)}
                onFocus={onFocus}
                onBlur={onBlur}
              />
              {option}
            </label>
          ))}
        </div>
      );
    }
    case 'sentenceChoice': {
      if (!question.options) {
        return <div>옵션이 없습니다.</div>;
      }
      return (
        <div>
          {question.options.map((option, index) => (
            <div key={index}>
              <label>
                <input
                  type="radio"
                  name={question.questionId}
                  value={index + 1}
                  checked={Number(value) === index + 1}
                  onChange={() => onChange(index + 1)}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
                {option}
              </label>
            </div>
          ))}
        </div>
      );
    }
    case 'text-input':
      return (
        <input
          type="number"
          value={value}
          onChange={handleChange}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      );
    default:
      return null;
  }
}

export default QuestionInput;






// 