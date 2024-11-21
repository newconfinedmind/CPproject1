// SurveyModule.h

#ifndef SURVEY_MODULE_H
#define SURVEY_MODULE_H

#include <string>
#include <vector>


struct ChangeEntry {
    std::string value;
    double time;
};

struct Metadata {
    double timestamp;
    double initialRenderTime;
    double responseTime;
    std::vector<ChangeEntry> changeHistory;
   double focusTime = 0.0;
    double blurTime = 0.0;
    double scrollDepth=0.0;
};

struct Answer {
    std::string surveyId;
    std::string respondent;
    std::string questionId;
    std::string questionType;
    std::string value;
    Metadata metadata;
    std::string persona;
};

struct Question {
    
    std::string questionId;
    std::string surveyId;
    std::string questionType;
    std::string text;
    std::string persona;
    
};

// Calculated 구조체 정의
struct Calculated {
    int totalAnswers = 0;
    int changedAnswers = 0;
    double changedPercentage = 0.0;

    double avgChangeCount = 0.0;
    double medianChangeCount = 0.0;

    double avgResponseTime = 0.0;
    double medianResponseTime = 0.0;

    double avgChangeInterval = 0.0;
    double medianChangeInterval = 0.0;

    double avgResponseTimeChanged = 0.0;
    double medianResponseTimeChanged = 0.0;

    double stdDevResponseTime = 0.0;
    double stdDevChangeCount = 0.0;
};

// 함수 선언
// 필요한 함수들만 선언합니다
    Calculated calculateStats(const std::vector<Answer>& answers);
    double determineWeight(const Answer& answer);
std::vector<std::string> getNextQuestions(const std::vector<Answer>& answers, const std::vector<Question>& allQuestions);

   std::string analyzeAnswers(const std::vector<Answer>& answers);

#endif // SURVEY_MODULE_H
