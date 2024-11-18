// app/api/answers/route.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import clientPromise from '@/lib/mongodb'; // 경로를 환경에 맞게 조정하세요.

export async function POST(request: NextRequest) {
  try {
    // 요청 바디에서 데이터 추출
    const body = await request.json();
    const { answer } = body;

    if (!answer) {
      return NextResponse.json({ error: 'Answer is required' }, { status: 400 });
    }

    // MongoDB 클라이언트 연결
    const client = await clientPromise;
    const db = client.db();

    // 'answers' 컬렉션에 데이터 삽입
    const collection = db.collection('answers');
    const result = await collection.insertOne({ answer, createdAt: new Date() });
    console.log('Insert Result:', result);
    // 성공 응답
    return NextResponse.json(
      { message: 'Answer saved', _id: result.insertedId },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving answer:', error);
    return NextResponse.json({ error: 'Error saving answer' }, { status: 500 });
  }
}
