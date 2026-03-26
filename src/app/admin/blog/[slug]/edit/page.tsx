'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import BlogEditor from '@/components/admin/BlogEditor'

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  publishedAt: string | null
  status: 'draft' | 'published'
  featuredImage?: string
  tags: string[]
  metaTitle?: string
  metaDescription?: string
}

export default function EditBlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/admin/blog/${slug}`)
        if (!response.ok) {
          if (response.status === 404) {
            setError('Post not found')
          } else {
            setError('Failed to load post')
          }
          return
        }
        const data = await response.json()
        setPost(data)
      } catch {
        setError('An error occurred while loading the post')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  if (loading) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-xl p-12 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#FF9700] border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading post...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-xl p-12 text-center">
          <svg className="w-16 h-16 text-red-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{error}</h3>
          <button
            onClick={() => router.push('/admin/blog')}
            className="mt-4 px-4 py-2 bg-[#FF9700] text-white font-medium rounded-lg hover:bg-[#E68600] transition-colors"
          >
            Back to Blog
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
        <p className="text-gray-600 mt-1">Update your blog article</p>
      </div>

      {/* Editor */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
        {post && <BlogEditor post={post} isEditing />}
      </div>
    </div>
  )
}
