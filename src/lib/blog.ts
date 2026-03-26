import fs from 'fs/promises'
import path from 'path'

const BLOG_DIR = path.join(process.cwd(), 'data', 'blog')

export interface BlogPost {
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
  createdAt: string
  updatedAt: string
}

async function ensureBlogDir() {
  try {
    await fs.access(BLOG_DIR)
  } catch {
    await fs.mkdir(BLOG_DIR, { recursive: true })
  }
}

export async function getAllPosts(): Promise<BlogPost[]> {
  await ensureBlogDir()

  try {
    const files = await fs.readdir(BLOG_DIR)
    const posts: BlogPost[] = []

    for (const file of files) {
      if (file.endsWith('.json')) {
        const content = await fs.readFile(path.join(BLOG_DIR, file), 'utf-8')
        posts.push(JSON.parse(content))
      }
    }

    return posts.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  } catch {
    return []
  }
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const posts = await getAllPosts()
  return posts
    .filter((post) => post.status === 'published')
    .sort((a, b) =>
      new Date(b.publishedAt || b.createdAt).getTime() -
      new Date(a.publishedAt || a.createdAt).getTime()
    )
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  await ensureBlogDir()

  try {
    const filePath = path.join(BLOG_DIR, `${slug}.json`)
    const content = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(content)
  } catch {
    return null
  }
}

export async function createPost(
  data: Omit<BlogPost, 'createdAt' | 'updatedAt'>
): Promise<BlogPost> {
  await ensureBlogDir()

  const now = new Date().toISOString()
  const post: BlogPost = {
    ...data,
    createdAt: now,
    updatedAt: now,
  }

  const filePath = path.join(BLOG_DIR, `${post.slug}.json`)

  // Check if slug already exists
  try {
    await fs.access(filePath)
    throw new Error('A post with this slug already exists')
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error
    }
  }

  await fs.writeFile(filePath, JSON.stringify(post, null, 2))
  return post
}

export async function updatePost(
  slug: string,
  data: Partial<Omit<BlogPost, 'slug' | 'createdAt' | 'updatedAt'>>
): Promise<BlogPost | null> {
  const existingPost = await getPostBySlug(slug)
  if (!existingPost) return null

  const updatedPost: BlogPost = {
    ...existingPost,
    ...data,
    slug: existingPost.slug, // Keep original slug
    createdAt: existingPost.createdAt, // Keep original creation date
    updatedAt: new Date().toISOString(),
  }

  const filePath = path.join(BLOG_DIR, `${slug}.json`)
  await fs.writeFile(filePath, JSON.stringify(updatedPost, null, 2))
  return updatedPost
}

export async function deletePost(slug: string): Promise<boolean> {
  await ensureBlogDir()

  try {
    const filePath = path.join(BLOG_DIR, `${slug}.json`)
    await fs.unlink(filePath)
    return true
  } catch {
    return false
  }
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 60)
}
