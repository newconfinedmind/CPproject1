#include "SurveyModule.h"
#include <algorithm>  // sort() - 정렬
#include <cmath>      // sqrt() - 제곱근
#include <numeric>    // accumulate() - 합계 계산

// 보조 함수들

// 변경 간격 계산 함수
static std::vector<double> calculateChangeIntervals(const std::vector<ChangeEntry>& changeHistory) {
    std::vector<double> intervals;
    for (size_t i = 1; i < changeHistory.size(); ++i) {
        double interval = changeHistory[i].time - changeHistory[i - 1].time;
        intervals.push_back(interval);
    }
    return intervals;
}

// 평균 계산 함수
static double calculateAverage(const std::vector<double>& values) {
    if (values.empty()) {
        return 0.0;
    }
    double sum = std::accumulate(values.begin(), values.end(), 0.0);
    return sum / values.size();
}

double calculateAverage(const std::vector<size_t>& values) {
    if (values.empty()) {
        return 0.0;
    }
    double sum = static_cast<double>(std::accumulate(values.begin(), values.end(), static_cast<size_t>(0)));
    return sum / values.size();
}

// 중앙값 계산 함수
static double calculateMedian(std::vector<double> values) {
    if (values.empty()) {
        return 0.0;
    }
    std::sort(values.begin(), values.end());
    size_t middle = values.size() / 2;
    if (values.size() % 2 == 0) {
        return (values[middle - 1] + values[middle]) / 2.0;
    } else {
        return values[middle];
    }
}

static double calculateMedian(std::vector<size_t> values) {
    if (values.empty()) {
        return 0.0;
    }
    std::sort(values.begin(), values.end());
    size_t middle = values.size() / 2;
    if (values.size() % 2 == 0) {
        return static_cast<double>(values[middle - 1] + values[middle]) / 2.0;
    } else {
        return static_cast<double>(values[middle]);
    }
}

// 표준 편차 계산 함수
static double calculateStdDev(const std::vector<double>& values) {
    if (values.size() <= 1) {
        return 0.0;
    }
    double mean = calculateAverage(values);
    double variance = 0.0;
    for (double value : values) {
        variance += (value - mean) * (value - mean);
    }
    variance /= (values.size() - 1);
    return std::sqrt(variance);
}

static double calculateStdDev(const std::vector<size_t>& values) {
    if (values.size() <= 1) {
        return 0.0;
    }
    double mean = calculateAverage(values);
    double variance = 0.0;
    for (size_t value : values) {
        variance += (value - mean) * (value - mean);
    }
    variance /= (values.size() - 1);
    return std::sqrt(variance);
}

// main 함수인 calculateStats 구현
Calculated calculateStats(const std::vector<Answer>& answers) {
    Calculated result = {};
    result.totalAnswers = answers.size();

    size_t changedAnswers = 0;
    std::vector<size_t> changeCounts;
    std::vector<double> responseTimes;
    std::vector<double> responseTimesChanged;
    std::vector<double> allIntervals;

    for (const auto& answer : answers) {
        const Metadata& metadata = answer.metadata;

        // isChanged 계산
        bool isChanged = metadata.changeHistory.size() > 1;
        if (isChanged) {
            ++changedAnswers;
            responseTimesChanged.push_back(metadata.responseTime);
        }

        // 변경 횟수 계산 (최초 입력 제외)
        size_t changeCount = metadata.changeHistory.size() - 1;
        changeCounts.push_back(changeCount);

        // 응답 시간 기록
        responseTimes.push_back(metadata.responseTime);

        // 변경 간격 계산
        std::vector<double> intervals = calculateChangeIntervals(metadata.changeHistory);
        allIntervals.insert(allIntervals.end(), intervals.begin(), intervals.end());
    }

    // 변경된 응답 수 및 비율
    result.changedAnswers = changedAnswers;
    if (result.totalAnswers > 0) {
        result.changedPercentage = (static_cast<double>(changedAnswers) / result.totalAnswers) * 100.0;
    } else {
        result.changedPercentage = 0.0;
    }

    // 평균 및 중앙값 계산
    result.avgChangeCount = calculateAverage(changeCounts);
    result.medianChangeCount = calculateMedian(changeCounts);

    result.avgResponseTime = calculateAverage(responseTimes);
    result.medianResponseTime = calculateMedian(responseTimes);

    result.avgChangeInterval = calculateAverage(allIntervals);
    result.medianChangeInterval = calculateMedian(allIntervals);

    // 추가된 부분: 변경된 응답의 응답 시간 평균 및 중앙값
    result.avgResponseTimeChanged = calculateAverage(responseTimesChanged);
    result.medianResponseTimeChanged = calculateMedian(responseTimesChanged);

    // 표준 편차 계산
    result.stdDevResponseTime = calculateStdDev(responseTimes);
    result.stdDevChangeCount = calculateStdDev(changeCounts);

    return result;
}

