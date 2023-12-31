'use client'

import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import { useMutation } from '@tanstack/react-query'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { courseApi } from '@/api-client'

export default function CreatePage() {
  const router = useRouter()
  const formSchema = z.object({
    title: z.string().min(1, {
      message: 'Title is required'
    })
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  })

  const createCourseMutation = useMutation({
    mutationFn: (title: string) => courseApi.create({ title })
  })

  const { isSubmitting, isValid } = form.formState

  const handleFormSubmit = (formValues: z.infer<typeof formSchema>) => {
    createCourseMutation.mutate(formValues.title, {
      onSuccess: (data) => {
        router.push(`/teacher/courses/${data.id}`)
        toast.success('Create course successfully')
      },
      onError: (error: any) => {
        toast.error(error)
      }
    })
  }

  return (
    <div className="mx-auto flex h-full max-w-5xl p-6 md:items-center md:justify-center">
      <div>
        <h1 className="text-2xl">Name your course</h1>
        <p className="text-sm text-slate-600">
          What would you like to name your course? Don&apos;t, you can change this later
        </p>

        <Form {...form}>
          <form className="mt-8 space-y-8" onSubmit={form.handleSubmit(handleFormSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course title</FormLabel>

                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Advanced web development'"
                      {...field}
                    />
                  </FormControl>

                  <FormDescription>What will you teach in this course?</FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Link href="/">
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
