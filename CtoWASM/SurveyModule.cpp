// SurveyModule.cpp

#include "SurveyModule.h"
#include <vector>
#include <string>
#include <algorithm>
#include <cmath>
#include "Word2VecModel.h"
#include <cmath>

#include <unordered_set>  // 추가 필요

double cosineSimilarity(const std::vector<double>& vecA, const std::vector<double>& vecB) {
    if (vecA.empty() || vecB.empty() || vecA.size() != vecB.size()) {
        return 0.0;
    }

    double dotProduct = 0.0;
    double normA = 0.0;
    double normB = 0.0;

    for (size_t i = 0; i < vecA.size(); ++i) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }

    if (normA == 0.0 || normB == 0.0) {
        return 0.0;
    }

    return dotProduct / (std::sqrt(normA) * std::sqrt(normB));
}































void updatePreferenceVector(std::vector<double>& preferenceVector, const std::vector<double>& personaVector, double weight) {
    for (size_t i = 0; i < preferenceVector.size(); ++i) {
        preferenceVector[i] += personaVector[i] * weight;
    }
}




std::vector<std::string> getNextQuestions(const std::vector<Answer>& answers, const std::vector<Question>& allQuestions) {
    // Word2Vec 모델 초기화
    Word2VecModel model; // 이미 벡터가 포함되어 있다고 가정



    // 선호 벡터 초기화
    std::vector<double> preferenceVector(model.dimension, 0.0);

    // 이미 응답한 질문 ID 집합 생성
    std::unordered_set<std::string> answeredQuestionIds;
    for (const Answer& answer : answers) {
        answeredQuestionIds.insert(answer.questionId);
    }

    // 이용자의 선호 벡터 업데이트
    for (const auto& answer : answers) {
        // 이 답변에 대한 가중치를 결정합니다.
        double weight = determineWeight(answer);

        // 해당 질문 찾기
        auto questionIt = std::find_if(allQuestions.begin(), allQuestions.end(),
            [&answer](const Question& q) {
                return q.questionId == answer.questionId;
            });
        if (questionIt == allQuestions.end()) {
            continue; // 질문을 찾을 수 없음
        }

        // persona 벡터 가져오기
        const std::string& persona = questionIt->persona;
        const std::vector<double>& personaVector = model.getVector(persona);

      

        // 선호 벡터 업데이트
        updatePreferenceVector(preferenceVector, personaVector, weight);
    }

    // 다음 질문 후보(아직 응답하지 않은 질문) 목록 생성
    std::vector<const Question*> candidateQuestions;
    for (const auto& question : allQuestions) {
        if (answeredQuestionIds.find(question.questionId) == answeredQuestionIds.end()) {
            candidateQuestions.push_back(&question);
        }
    }

    // 후보 질문들과 이용자의 선호 벡터 간의 유사도 계산
    std::vector<std::pair<const Question*, double>> questionScores;
    for (const auto& question : candidateQuestions) {
        const std::string& persona = question->persona;
        const std::vector<double>& personaVector = model.getVector(persona);

        if (personaVector.empty()) {
            // 필요한 경우 persona 벡터를 찾지 못한 경우 처리
            continue;
        }

        // 코사인 유사도 계산
        double similarity = cosineSimilarity(preferenceVector, personaVector);

        questionScores.emplace_back(question, similarity);
    }

    // 유사도에 따라 질문 정렬 (내림차순)
    std::sort(questionScores.begin(), questionScores.end(),
        [](const std::pair<const Question*, double>& a, const std::pair<const Question*, double>& b) {
            return a.second > b.second;
        });

    // 상위 N개의 질문 ID를 선택
    std::vector<std::string> nextQuestionIds;
    size_t N = 5; // 필요에 따라 조정
    for (size_t i = 0; i < std::min(N, questionScores.size()); ++i) {
        nextQuestionIds.push_back(questionScores[i].first->questionId);
    }

    return nextQuestionIds;
}




























// getNextQuestions 함수 구현 (질문 ID의 벡터를 반환)
std::vector<std::string> getNextQuestions(const std::vector<Answer>& answers) {


Calculated MetaDatacalculatedStats =calculateStats(answers);


    // 예시 구현: 임의로 다음 질문 ID를 반환
    std::vector<std::string> nextQuestionIds;

    // 실제 구현에서는 answers를 기반으로 다음 질문을 결정하는 로직을 추가합니다.

    // 예시로 질문 ID를 하나 추가
    nextQuestionIds.push_back("q_next");

    return nextQuestionIds;
}





// analyzeAnswers 함수 구현
std::string analyzeAnswers(const std::vector<Answer>& answers) {
    // 예시 구현: 응답 수를 반환
    size_t totalAnswers = answers.size();
    return "총 응답 수: " + std::to_string(totalAnswers);
}
