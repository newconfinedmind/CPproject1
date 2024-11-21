cmake_minimum_required(VERSION 3.10)
project(MyProject)

set(SOURCES 
    SurveyModule.cpp
    StatsCalculator.cpp
    WeightCalculator.cpp
)

add_library(SurveyModule STATIC ${SOURCES})