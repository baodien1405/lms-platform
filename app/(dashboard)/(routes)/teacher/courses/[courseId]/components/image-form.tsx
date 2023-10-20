'use client'

import { Course } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import { ImageIcon, Pencil, PlusCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-toastify'
import Image from 'next/image'
import * as z from 'zod'

import { courseApi } from '@/api-client'
import { FileUpload } from '@/components/file-upload'
import { Button } from '@/components/ui/button'

interface ImageFormProps {
  initialData: Course
  courseId: string
}

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: 'Image is required'
  })
})

export const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false)

  const toggleEdit = () => setIsEditing((current) => !current)

  const router = useRouter()

  const updateCourseMutation = useMutation({
    mutationFn: (body: z.infer<typeof formSchema>) => courseApi.update(courseId, body as Course)
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    updateCourseMutation.mutate(values, {
      onSuccess: () => {
        toast.success('Course updated')
        toggleEdit()
        router.refresh()
      },
      onError: () => {
        toast.error('Something went wrong')
      }
    })
  }

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Course title
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}

          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add an image
            </>
          )}

          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit image
            </>
          )}
        </Button>
      </div>

      {!isEditing &&
        (!initialData.imageUrl ? (
          <div className="flex h-60 items-center justify-center rounded-md bg-slate-200">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative mt-2 aspect-video">
            <Image
              alt="Upload"
              fill
              className="rounded-md object-cover"
              src={initialData.imageUrl}
            />
          </div>
        ))}

      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              if (url) {
                onSubmit({ imageUrl: url })
              }
            }}
          />
          <div className="mt-4 text-xs text-muted-foreground">16:9 aspect ratio recommended</div>
        </div>
      )}
    </div>
  )
}
