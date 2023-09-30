import axiosClient from './axios-client'

export const courseApi = {
  create({ title }: { title: string }): Promise<any> {
    return axiosClient.post('/api/courses', {
      title
    })
  }
}
