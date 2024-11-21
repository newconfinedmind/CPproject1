// convertJstoCpp.js

export function convertToEmbindAnswer(surveyModule, answerData) {
  // Create a new Embind Answer instance
  const embindAnswer = new surveyModule.Answer();

  // Assign properties
  embindAnswer.surveyId = answerData.surveyId;
  embindAnswer.respondent = answerData.respondent;
  embindAnswer.questionId = answerData.questionId;
  embindAnswer.questionType = answerData.questionType;
  embindAnswer.value = String(answerData.value);

  // Handle optional 'persona' property
  if (answerData.persona) {
    embindAnswer.persona = answerData.persona;
  }

  // Convert Metadata
  const embindMetadata = new surveyModule.Metadata();
  embindMetadata.timestamp = answerData.metadata.timestamp;
  embindMetadata.initialRenderTime = answerData.metadata.initialRenderTime;
  embindMetadata.responseTime = answerData.metadata.responseTime;
  embindMetadata.focusTime = answerData.metadata.focusTime || 0;
  embindMetadata.blurTime = answerData.metadata.blurTime || 0;
  embindMetadata.scrollDepth = answerData.metadata.scrollDepth || 0;

  // Convert ChangeHistory (ChangeEntryVector)
  embindMetadata.changeHistory = new surveyModule.ChangeEntryVector();
  answerData.metadata.changeHistory.forEach((entry) => {
    const embindChangeEntry = new surveyModule.ChangeEntry();
    embindChangeEntry.value = entry.value;
    embindChangeEntry.time = entry.time;
    embindMetadata.changeHistory.push_back(embindChangeEntry);
  });

  // Assign converted Metadata to Answer
  embindAnswer.metadata = embindMetadata;

  return embindAnswer;
}

export function convertToEmbindQuestion(surveyModule, questionData) {
  // Create a new Embind Question instance
  const embindQuestion = new surveyModule.Question();

  // Assign properties
  embindQuestion.questionId = questionData.questionId;
  embindQuestion.surveyId = questionData.surveyId;
  embindQuestion.questionType = questionData.questionType;
  embindQuestion.text = questionData.text;

  // Handle optional 'persona' property
  if (questionData.persona) {
    embindQuestion.persona = questionData.persona;
  }
  embindQuestion.options = new surveyModule.StringVector();

  const somearray = ['d','d','d','d','d'];
  somearray.forEach((option) => {
       embindQuestion.options.push_back(option);
    });

  // // Convert Options (StringVector)
  // embindQuestion.options = new surveyModule.StringVector();
  // questionData.options.forEach((option) => {
  //   embindQuestion.options.push_back(option);
  // });

  return embindQuestion;
}

export function convertAnswersArray(surveyModule, answersArray) {
  // Create a new Embind AnswerVector
  const embindAnswerVector = new surveyModule.AnswerVector();

  answersArray.forEach((answerData) => {
    const embindAnswer = convertToEmbindAnswer(surveyModule, answerData);
    embindAnswerVector.push_back(embindAnswer);
  });

  return embindAnswerVector;
}

export function convertQuestionsArray(surveyModule, questionsArray) {
  // Create a new Embind QuestionVector
  const embindQuestionVector = new surveyModule.QuestionVector();

  questionsArray.forEach((questionData) => {
    const embindQuestion = convertToEmbindQuestion(surveyModule, questionData);
    embindQuestionVector.push_back(embindQuestion);
  });

  return embindQuestionVector;
}
