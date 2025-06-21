import { NextResponse } from 'next/server'

export async function GET() {
  // TODO: Implement get scores logic
  return NextResponse.json({ scores: [] })
}

export async function POST(request: Request) {
  // TODO: Implement save score logic
  const body = await request.json()
  return NextResponse.json({ success: true, data: body })
} 