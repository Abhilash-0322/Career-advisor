import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import AptitudeQuestion from '@/models/AptitudeQuestion'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Build filter object
    const filter: any = {}
    
    if (category) {
      filter.category = category
    }
    
    if (difficulty) {
      filter.difficulty = difficulty
    }

    // Get random questions
    const questions = await AptitudeQuestion.aggregate([
      { $match: filter },
      { $sample: { size: limit } }
    ])

    return NextResponse.json({
      success: true,
      data: questions,
      count: questions.length
    })
  } catch (error) {
    console.error('Error fetching aptitude questions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch questions' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await connectDB()
    
    const body = await request.json()
    const question = await AptitudeQuestion.create(body)
    
    return NextResponse.json({
      success: true,
      data: question
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating question:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create question' },
      { status: 500 }
    )
  }
}
