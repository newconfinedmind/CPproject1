   // lib/mongodb.ts
   import { MongoClient } from 'mongodb';

   const uri = process.env.MONGODB_URI;

   if (!uri) {
     throw new Error('Please add your MongoDB URI to .env.local');
   }

   let client: MongoClient;
   let clientPromise: Promise<MongoClient>;

   declare global {
     // eslint-disable-next-line no-var
     var _mongoClientPromise: Promise<MongoClient> | undefined;
   }

   if (process.env.NODE_ENV === 'development') {
     // 개발 환경에서는 전역 변수를 사용하여 클라이언트를 캐싱합니다.
     if (!global._mongoClientPromise) {
       client = new MongoClient(uri);
       global._mongoClientPromise = client.connect();
     }
     clientPromise = global._mongoClientPromise;
   } else {
     // 프로덕션 환경에서는 새로운 클라이언트를 생성합니다.
     client = new MongoClient(uri);
     clientPromise = client.connect();
   }

   // 연결 테스트 로그 추가
   clientPromise
     .then(() => console.log('MongoDB에 연결되었습니다.'))
     .catch((err) => console.error('MongoDB 연결 오류:', err));

   export default clientPromise;
   