#pragma once

#include <string>
#include <unordered_map>
#include <vector>

class Word2VecModel {
public:
    size_t dimension;
    std::unordered_map<std::string, std::vector<double>> personaToVector;

    Word2VecModel();

    // 특정 persona에 대한 벡터를 가져옵니다.
    const std::vector<double>& getVector(const std::string& persona) const;
};
