import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import db from '@/lib/prismadb'

export async function PATCH(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = auth()
    const { courseId } = params
    const values = await req.json()

    if (!userId) {
      return new NextResponse('Unauthorize', { status: 401 })
    }

    const course = await db.course.update({
      where: {
        id: courseId,
        userId: userId
      },
      data: {
        ...values
      }
    })

    return NextResponse.json(course)
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 })
  }
}
