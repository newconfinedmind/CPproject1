// app/api/questions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Question 타입 정의
interface Question {
  questionId?: string;
  surveyId?: string;
  questionType: string;
  text: string;
  options: string[];
  persona?: string;
}

// GET method: Fetch all questions
export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('CPproject1');
    const questionsCollection = db.collection('questions');

    // Fetch all questions
    const questions = await questionsCollection.find({}).toArray();

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Failed to fetch questions:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST method: Add new questions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const questionsData = Array.isArray(body) ? body : [body];

    const questions: Question[] = questionsData.map((data: any) => {
      // 각 질문에 대해 필요한 필드 구성
      return {
        questionId: data.questionId,
        surveyId: data.surveyId,
        questionType: data.questionType,
        text: data.text,
        options: data.options || [],
        persona: data.persona || '',
      };
    });

    const client = await clientPromise;
    const db = client.db('CPproject1');
    const questionsCollection = db.collection('questions');

    const result = await questionsCollection.insertMany(questions);

    return NextResponse.json(
      { message: 'Questions added', ids: result.insertedIds },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Failed to add questions:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
