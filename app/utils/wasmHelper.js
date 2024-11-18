// utils/wasmHelper.js

export function convertJsAnswerToCpp(Answer, surveyModule) {
  // Metadata 객체 생성
  const metadata = new surveyModule.Metadata();
  metadata.timestamp = Answer.metadata.timestamp || 0;
  metadata.initialRenderTime = Answer.metadata.initialRenderTime || 0;
  metadata.responseTime = Answer.metadata.responseTime || 0;
  metadata.focusTime = Answer.metadata.focusTime || 0;
  metadata.blurTime = Answer.metadata.blurTime || 0;

  // changeHistory 변환
  const changeHistory = new surveyModule.ChangeHistory();
  Answer.metadata.changeHistory.forEach((change) => {
    const valueStr = change.value.toString();
    const time = change.time || 0;

    // ChangeEntry 객체 생성
    const changeEntry = new surveyModule.ChangeEntry();
    changeEntry.value = valueStr;
    changeEntry.time = time;

    // changeHistory 벡터에 추가
    changeHistory.push_back(changeEntry);

    // 메모리 해제는 필요 없음 (벡터가 소유권 가짐)
  });
  metadata.changeHistory = changeHistory;

  // Answer 객체 생성
  const ans = new surveyModule.Answer();
  ans.surveyId = Answer.surveyId || '';
  ans.respondent = Answer.respondent || '';
  ans.questionId = Answer.questionId || '';
  ans.questionType = Answer.questionType || '';
  ans.value = Answer.value.toString() || '';
  ans.metadata = metadata;
  ans.persona = Answer.persona || '';

  // 메모리 관리: 필요에 따라 객체를 반환하거나 관리합니다.
  // metadata와 changeHistory는 ans에 설정되었으므로 별도의 delete는 필요 없음

  return ans;
}

export function convertJsAnswerArrayToCpp(answers, surveyModule) {
  const answerVector = new surveyModule.AnswerVector();
  answers.forEach((answer) => {
    const cppAnswer = convertJsAnswerToCpp(answer, surveyModule);
    answerVector.push_back(cppAnswer);

    // 메모리 관리: cppAnswer는 벡터에 추가되었으므로 별도의 delete는 필요 없음
  });
  return answerVector;
}
