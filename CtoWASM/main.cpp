// main.cpp

#include <iostream>
#include <vector>
#include <string>
#include <sstream>

// 헤더 파일 포함
#include "SurveyModule.h"
#include "Word2VecModel.h"

int main() {
    std::cout << "=== 이용자 응답 & 메타데이터 기반 동적 설문 문항 추천 모듈 테스트 ===" << std::endl;

    // 이 main.cpp는 라이브러리의 기능을 보여주기 위한 것이며,
    // 실제로는 cpp가 WebAssembly(wasm)로 컴파일되어 브라우저에서 실행됩니다.
    std::cout << "\n이 main.cpp는 라이브러리의 기능을 보여주기 위한 것이며," << std::endl;
    std::cout << "실제로는 cpp가 WebAssembly(wasm)로 컴파일되어 브라우저에서 실행됩니다." << std::endl;
    std::cout << "웹사이트 링크는 http://glhf.kr 로 들어가면 볼 수 있습니다." << std::endl;
    std::cout << "Answer 타입의 형식은 문서를 참조하세요." << std::endl;

    // 1. Word2Vec 모델 초기화
    std::cout << "\n1. Word2Vec 모델을 초기화합니다..." << std::endl;
    Word2VecModel word2VecModel;
    word2VecModel.dimension = 762;  // 762차원으로 수정

    std::cout << "허깅페이스의 한국어 전용 Word2Vec에서 미리 문항의 종류를 762차원 임베딩 벡터로 만들었습니다. 출력하시겠습니까? (y/n): ";
    char response;
    std::cin >> response;
    std::cin.ignore(); // 버퍼 비우기

    if (response == 'y' || response == 'Y') {
        std::cout << "\n페르소나 벡터 목록:" << std::endl;
        for (const auto& pair : word2VecModel.personaToVector) {
            std::cout << "페르소나: " << pair.first << std::endl;
            std::cout << "벡터: [";
            for (size_t i = 0; i < pair.second.size(); ++i) {
                std::cout << pair.second[i];
                if (i < pair.second.size() - 1) std::cout << ", ";
            }
            std::cout << "]\n" << std::endl;
        }
    }

    std::cout << "pretrained Word2Vec Model이 로드되었습니다." << std::endl;

    // 2. Answer 객체 배열 입력 받기
    std::cout << "\n2. Answer 객체 배열을 입력받습니다. 배열의 개수는 5의 배수여야 합니다." << std::endl;
    std::cout << "Answer 객체의 형식은 다음과 같습니다 (자세한 내용은 문서를 참조하세요):" << std::endl;
    std::cout << "surveyId, respondent, questionId, questionType, value, persona" << std::endl;
    std::cout << "예시: survey1, user1, q1, likert5, 5, persona1" << std::endl;
    std::cout << "\n이 main.cpp는 라이브러리의 기능을 보여주기 위한 것이며," << std::endl;
    std::cout << "실제로는 cpp가 WebAssembly(wasm)로 컴파일되어 브라우저에서 실행됩니다." << std::endl;
    std::cout << "웹사이트 링크는 http://glhf.kr 로 들어가면 볼 수 있습니다." << std::endl;
    std::cout << "Answer 타입의 형식은 문서를 참조하세요." << std::endl;
    std::vector<Answer> answers;
    std::string line;

   
   

    return 0;
}
