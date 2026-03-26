import BlogEditor from '@/components/admin/BlogEditor'

export default function NewBlogPost() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
        <p className="text-gray-600 mt-1">Write and publish a new blog article</p>
      </div>

      {/* Editor */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
        <BlogEditor />
      </div>
    </div>
  )
}
