// WeightCalculator.cpp

#include "SurveyModule.h"
#include <string>

double determineWeight(const Answer &answer) {
  const Metadata &metadata = answer.metadata;
  double responseTime = metadata.responseTime;

  int changeCount = 0;

  // changeHistory의 크기가 1 이상인 경우에만 -1을 수행
  if (metadata.changeHistory.size() > 1) {
    changeCount = metadata.changeHistory.size() - 1;
  } else {
    // 변경 이력이 없거나 한 번인 경우
    changeCount = 0;
  }
  double weight = 0.0;

  // 응답 값을 기반으로 가중치 조절
  std::string questionType = answer.questionType;
  int responseValue = 0;

  try {
    responseValue = std::stoi(answer.value);
  } catch (const std::exception &e) {
    // 응답 값이 숫자가 아닐 경우 처리 (예: 기본값 사용)
    responseValue = 0;
  }

  if (questionType == "likert5") {
    if (responseValue == 1 || responseValue == 5) {
      weight += 1.0; // 선호함
    } else if (responseValue == 3) {
      weight -= 1.0; // 선호하지 않음
    }
  } else if (questionType == "likert7") {
    if (responseValue == 1 || responseValue == 7) {
      weight += 1.0; // 선호함
    } else if (responseValue == 4) {
      weight -= 1.0; // 선호하지 않음
    }
  } else if (questionType == "sentenceChoice") {
    // sentenceChoice에 대한 처리 (필요에 따라 구현)
  } else {
    // 기타 질문 유형에 대한 처리
  }

  // 기존의 응답 시간과 변경 횟수를 활용하여 가중치 조절

  // 응답 시간이 짧을수록 높은 가중치 (예: 5초 이내)
  if (responseTime < 5000.0) {
    weight += 0.2;
  } else {
    weight -= 0.7;
  }

  // 변경 횟수가 적을수록 높은 가중치
  if (changeCount == 0) {
    weight += 0.2;
  } else {
    weight -= 0.2 * changeCount;
  }

  return weight;
}
