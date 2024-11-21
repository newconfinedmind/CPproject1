// Bindings.cpp
#include <emscripten/bind.h>
#include "SurveyModule.h"

using namespace emscripten;

EMSCRIPTEN_BINDINGS(my_Module) {
  // ChangeEntry 클래스 바인딩
  class_<ChangeEntry>("ChangeEntry")
      .constructor<>()
      .property("value", &ChangeEntry::value)
      .property("time", &ChangeEntry::time);

  // Metadata 클래스 바인딩
  class_<Metadata>("Metadata")
      .constructor<>()
      .property("timestamp", &Metadata::timestamp)
      .property("initialRenderTime", &Metadata::initialRenderTime)
      .property("responseTime", &Metadata::responseTime)
      .property("changeHistory", &Metadata::changeHistory)
      .property("focusTime", &Metadata::focusTime)
      .property("blurTime", &Metadata::blurTime)
      .property("scrollDepth", &Metadata::scrollDepth);

  // Answer 클래스 바인딩
  class_<Answer>("Answer")
      .constructor<>()
      .property("surveyId", &Answer::surveyId)
      .property("respondent", &Answer::respondent)
      .property("questionId", &Answer::questionId)
      .property("questionType", &Answer::questionType)
      .property("value", &Answer::value)
      .property("metadata", &Answer::metadata)
      .property("persona", &Answer::persona);

  // Question 클래스 바인딩
  class_<Question>("Question")
      .constructor<>()
      .property("questionId", &Question::questionId)
      .property("surveyId", &Question::surveyId)
      .property("questionType", &Question::questionType)
      .property("text", &Question::text)
      .property("options", &Question::options)
      .property("persona", &Question::persona);

  // Calculated 클래스 바인딩
  class_<Calculated>("Calculated")
      .constructor<>()
      .property("totalAnswers", &Calculated::totalAnswers)
      .property("changedAnswers", &Calculated::changedAnswers)
      .property("changedPercentage", &Calculated::changedPercentage)
      .property("avgChangeCount", &Calculated::avgChangeCount)
      .property("medianChangeCount", &Calculated::medianChangeCount)
      .property("avgResponseTime", &Calculated::avgResponseTime)
      .property("medianResponseTime", &Calculated::medianResponseTime)
      .property("avgChangeInterval", &Calculated::avgChangeInterval)
      .property("medianChangeInterval", &Calculated::medianChangeInterval)
      .property("avgResponseTimeChanged", &Calculated::avgResponseTimeChanged)
      .property("medianResponseTimeChanged", &Calculated::medianResponseTimeChanged)
      .property("stdDevResponseTime", &Calculated::stdDevResponseTime)
      .property("stdDevChangeCount", &Calculated::stdDevChangeCount);

  // 바인딩된 벡터들 업데이트
  register_vector<std::string>("StringVector");
  register_vector<double>("DoubleVector");
  register_vector<Question>("QuestionVector");
  register_vector<ChangeEntry>("ChangeEntryVector");
  register_vector<Answer>("AnswerVector");

  // 함수 바인딩
  function("getNextQuestions", &getNextQuestions);
  function("analyzeAnswers", &analyzeAnswers);
  function("calculateStats", &calculateStats);
  function("determineWeight", &determineWeight);
}
