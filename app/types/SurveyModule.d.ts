// types/SurveyModule.d.ts

// Interface for the WASM module
export interface SurveyModule {
    // Constructors for classes
    Metadata: new () => Metadata;
    Answer: new () => Answer;
    AnswerVector: new () => AnswerVector;
    StringVector: new () => StringVector;
    StringDoublePair: new (first: string, second: number) => StringDoublePair;
    ChangeHistory: new () => ChangeHistory;
  
    // Functions exported from the module
    getNextQuestions: (answers: AnswerVector) => StringVector;
    analyzeAnswers: (answers: AnswerVector) => string;
  
    // Include any other functions or classes exported by your module
  }
  
  // Define interfaces for the classes and data structures
  export interface Metadata {
    timestamp: number;
    initialRenderTime: number;
    responseTime: number;
    changeHistory: ChangeHistory;
    focusTime: number;
    blurTime: number;
  }
  
  export interface Answer {
    surveyId: string;
    respondent: string;
    questionId: string;
    questionType: string;
    value: string;
    metadata: Metadata;
    persona: string;
  }
  
  export interface AnswerVector {
    size(): number;
    get(index: number): Answer;
    push_back(answer: Answer): void;
    delete(): void;
  }
  
  export interface StringVector {
    size(): number;
    get(index: number): string;
    push_back(value: string): void;
    delete(): void;
  }
  
  export interface StringDoublePair {
    first: string;
    second: number;
    delete(): void;
  }
  
  export interface ChangeHistory {
    size(): number;
    get(index: number): StringDoublePair;
    push_back(pair: StringDoublePair): void;
    delete(): void;
  }
  