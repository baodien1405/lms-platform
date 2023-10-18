import axiosClient from './axios-client'
import { Course } from '@prisma/client'

export const courseApi = {
  create({ title }: { title: string }): Promise<Course> {
    return axiosClient.post('/api/courses', {
      title
    })
  },
  update(id: string, title: string): Promise<any> {
    return axiosClient.patch(`/api/courses/${id}`, {
      title
    })
  }
}
