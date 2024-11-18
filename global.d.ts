// global.d.ts

import { MongoClient } from 'mongodb';

declare global {
  namespace NodeJS {
    interface Global {
      _mongoClientPromise: Promise<MongoClient>;
    }
  }
}

// 이 파일 자체가 모듈로 간주되지 않도록 빈 export를 합니다.
export {};
