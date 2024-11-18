// components/EditQuestionForm.tsx
'use client';

import React, { useState, useEffect } from 'react';

interface EditQuestionFormProps {
  questionId: string;
  onSuccess: () => void;
}

const EditQuestionForm: React.FC<EditQuestionFormProps> = ({ questionId, onSuccess }) => {
  const [questionData, setQuestionData] = useState({
    _id: '',
    questionId: '',
    surveyId: '',
    questionType: '',
    text: '',
    options: [''],
    persona: '',
  });

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch(`/api/questions/${questionId}`);
        if (response.ok) {
          const data = await response.json();
          setQuestionData(data);
        } else {
          console.error('Failed to fetch question');
        }
      } catch (error) {
        console.error('Error fetching question:', error);
      }
    };

    fetchQuestion();
  }, [questionId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setQuestionData({
      ...questionData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...questionData.options];
    newOptions[index] = value;
    setQuestionData({
      ...questionData,
      options: newOptions,
    });
  };

  const addOption = () => {
    setQuestionData({
      ...questionData,
      options: [...questionData.options, ''],
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/questions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questionData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Question updated:', result);
        onSuccess();
      } else {
        const error = await response.text();
        console.error('Failed to update question:', error);
      }
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  return (
    <div>
      <h2>질문 수정</h2>
      <form>
        <input
          type="text"
          name="questionId"
          placeholder="Question ID"
          value={questionData.questionId}
          onChange={handleChange}
        />
        <input
          type="text"
          name="surveyId"
          placeholder="Survey ID"
          value={questionData.surveyId}
          onChange={handleChange}
        />
        <input
          type="text"
          name="questionType"
          placeholder="Question Type"
          value={questionData.questionType}
          onChange={handleChange}
        />
        <textarea
          name="text"
          placeholder="Question Text"
          value={questionData.text}
          onChange={handleChange}
        />
        <div>
          <h3>Options</h3>
          {questionData.options.map((option, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
            />
          ))}
          <button type="button" onClick={addOption}>
            옵션 추가
          </button>
        </div>
        <input
          type="text"
          name="persona"
          placeholder="Persona"
          value={questionData.persona}
          onChange={handleChange}
        />
        <button type="button" onClick={handleSubmit}>
          수정
        </button>
      </form>
    </div>
  );
};

export default EditQuestionForm;
