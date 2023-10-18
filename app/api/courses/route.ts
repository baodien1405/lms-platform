import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import db from '@/lib/prismadb'

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    const { title } = await req.json()

    if (!userId) {
      return new NextResponse('Unauthorize', { status: 401 })
    }

    const course = await db.course.create({
      data: {
        userId: userId,
        title: title
      }
    })

    return NextResponse.json(course)
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 })
  }
}
