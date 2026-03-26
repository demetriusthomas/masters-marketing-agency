import { NextRequest, NextResponse } from 'next/server'
import { getAllPosts, createPost, generateSlug } from '@/lib/blog'
import { isAuthenticated } from '@/lib/auth'

export async function GET() {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const posts = await getAllPosts()
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, excerpt, content, author, status, featuredImage, tags, metaTitle, metaDescription } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    const slug = generateSlug(title)

    const post = await createPost({
      slug,
      title,
      excerpt: excerpt || '',
      content,
      author: author || 'Masters Marketing Agency',
      status: status || 'draft',
      publishedAt: status === 'published' ? new Date().toISOString() : null,
      featuredImage,
      tags: tags || [],
      metaTitle,
      metaDescription,
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    const message = error instanceof Error ? error.message : 'Failed to create post'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
