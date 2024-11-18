// components/AddQuestionForm.tsx
'use client';

import React, { useState } from 'react';

const AddQuestionForm: React.FC = () => {
    interface Question {
        questionId: string;
        surveyId: string;
        text: string;
        questionType: string;
        options: string[];
        persona: string;
      }

      
  const [questions, setQuestions] = useState<Question[]>([
    {
      questionId: '',
      surveyId: '',
      text: '',
      questionType: '',
      options: [],
      persona: '',
    },
  ]);

  const handleQuestionChange = (
    index: number,
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const updatedQuestions = [...questions];
    const { name, value } = e.target;
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [name]: value,
    };

    // questionType 변경 시 options 자동 설정 또는 초기화
    if (name === 'questionType') {
      if (value === 'likert5') {
        updatedQuestions[index].options = ['1', '2', '3', '4', '5'];
      } else if (value === 'likert7') {
        updatedQuestions[index].options = ['1', '2', '3', '4', '5', '6', '7'];
      } else {
        // 그 외의 경우 options를 빈 배열로 초기화하여 수동 편집 가능하게 함
        updatedQuestions[index].options = [''];
      }
    }

    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (
    qIndex: number,
    oIndex: number,
    value: string
  ) => {
    const updatedQuestions = [...questions];
    const newOptions = [...updatedQuestions[qIndex].options];
    newOptions[oIndex] = value;
    updatedQuestions[qIndex].options = newOptions;
    setQuestions(updatedQuestions);
  };

  const addOption = (qIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options.push('');
    setQuestions(updatedQuestions);
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    const updatedQuestions = [...questions];
    const newOptions = updatedQuestions[qIndex].options.filter(
      (_, idx) => idx !== oIndex
    );
    updatedQuestions[qIndex].options = newOptions;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionId: '',
        surveyId: '',
        text: '',
        questionType: '',
        options: [],
        persona: '',
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questions),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Questions added:', result);
        // Reset form
        setQuestions([
          {
            questionId: '',
            surveyId: '',
            text: '',
            questionType: '',
            options: [],
            persona: '',
          },
        ]);
      } else {
        const error = await response.text();
        console.error('Failed to add questions:', error);
      }
    } catch (error) {
      console.error('Error adding questions:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">새 질문 추가</h2>
      <form onSubmit={handleSubmit}>
        {questions.map((question, qIndex) => (
          <div key={qIndex} className="border p-4 mb-4 rounded bg-white shadow">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">질문 {qIndex + 1}</h3>
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  className="text-red-500"
                >
                  삭제
                </button>
              )}
            </div>

            {/* questionId 입력 */}
            <div className="mb-2">
              <label className="block font-medium">Question ID</label>
              <input
                type="text"
                name="questionId"
                value={question.questionId}
                onChange={(e) => handleQuestionChange(qIndex, e)}
                placeholder="Question ID"
                className="w-full border p-2 rounded"
              />
            </div>

            {/* surveyId 입력 */}
            <div className="mb-2">
              <label className="block font-medium">Survey ID</label>
              <input
                type="text"
                name="surveyId"
                value={question.surveyId}
                onChange={(e) => handleQuestionChange(qIndex, e)}
                placeholder="Survey ID"
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="mb-2">
              <label className="block font-medium">질문 내용</label>
              <textarea
                name="text"
                value={question.text}
                onChange={(e) => handleQuestionChange(qIndex, e)}
                placeholder="질문 내용을 입력하세요"
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div className="mb-2">
              <label className="block font-medium">질문 유형</label>
              <select
                name="questionType"
                value={question.questionType}
                onChange={(e) => handleQuestionChange(qIndex, e)}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">질문 유형 선택</option>
                <option value="likert5">5점 리커트 척도</option>
                <option value="likert7">7점 리커트 척도</option>
                <option value="sentenceChoice">주관식 선택형</option>
              </select>
            </div>

            {/* Likert 척도가 아닌 경우에만 옵션을 직접 입력할 수 있게 함 */}
            {question.questionType !== 'likert5' &&
              question.questionType !== 'likert7' && (
                <div className="mb-2">
                  <label className="block font-medium">옵션들</label>
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center mb-1">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(qIndex, oIndex, e.target.value)
                        }
                        placeholder={`옵션 ${oIndex + 1}`}
                        className="w-full border p-2 rounded"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => removeOption(qIndex, oIndex)}
                        className="ml-2 text-red-500"
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addOption(qIndex)}
                    className="mt-1 text-blue-500"
                  >
                    옵션 추가
                  </button>
                </div>
              )}

            <div className="mb-2">
              <label className="block font-medium">페르소나</label>
              <input
                type="text"
                name="persona"
                value={question.persona}
                onChange={(e) => handleQuestionChange(qIndex, e)}
                placeholder="페르소나를 입력하세요"
                className="w-full border p-2 rounded"
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addQuestion}
          className="bg-green-500 text-white py-2 px-4 rounded mb-4"
        >
          질문 추가
        </button>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          제출
        </button>
      </form>
    </div>
  );
};

export default AddQuestionForm;
