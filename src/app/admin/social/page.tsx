'use client'

import { useState } from 'react'

const platforms = [
  { id: 'instagram', name: 'Instagram', icon: '📸' },
  { id: 'facebook', name: 'Facebook', icon: '👤' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
  { id: 'twitter', name: 'Twitter/X', icon: '🐦' },
]

const contentTypes = [
  { id: 'promotional', name: 'Promotional', description: 'Promote services or offers' },
  { id: 'educational', name: 'Educational', description: 'Share tips and insights' },
  { id: 'testimonial', name: 'Testimonial', description: 'Customer success stories' },
  { id: 'behind_scenes', name: 'Behind the Scenes', description: 'Team and culture content' },
  { id: 'industry_news', name: 'Industry News', description: 'Trends and commentary' },
  { id: 'engagement', name: 'Engagement', description: 'Discussion starters' },
]

interface GeneratedPost {
  content: string
  hashtags: string[]
}

interface GeneratedContent {
  posts: Record<string, GeneratedPost>
}

export default function SocialMediaCreator() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [contentType, setContentType] = useState('')
  const [topic, setTopic] = useState('')
  const [additionalContext, setAdditionalContext] = useState('')
  const [generating, setGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((p) => p !== platformId)
        : [...prev, platformId]
    )
  }

  const handleGenerate = async () => {
    if (selectedPlatforms.length === 0) {
      setError('Please select at least one platform')
      return
    }
    if (!contentType) {
      setError('Please select a content type')
      return
    }
    if (!topic.trim()) {
      setError('Please enter a topic')
      return
    }

    setError('')
    setGenerating(true)
    setGeneratedContent(null)

    try {
      const response = await fetch('/api/admin/social/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedPlatforms,
          contentType,
          topic,
          additionalContext,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to generate content')
        return
      }

      setGeneratedContent(data)
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  const copyToClipboard = async (platformId: string, content: string, hashtags: string[]) => {
    const fullContent = hashtags.length > 0
      ? `${content}\n\n${hashtags.map((h) => `#${h}`).join(' ')}`
      : content

    await navigator.clipboard.writeText(fullContent)
    setCopied(platformId)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Social Media Creator</h1>
        <p className="text-gray-600 mt-1">Generate AI-powered social media content</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Platform Selection */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-4">Select Platforms</h2>
            <div className="grid grid-cols-2 gap-3">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => togglePlatform(platform.id)}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                    selectedPlatforms.includes(platform.id)
                      ? 'border-[#FF9700] bg-[#FF9700]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl">{platform.icon}</span>
                  <span className="font-medium text-gray-900">{platform.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Type */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-4">Content Type</h2>
            <div className="grid grid-cols-2 gap-3">
              {contentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setContentType(type.id)}
                  className={`text-left p-4 rounded-lg border-2 transition-all ${
                    contentType === type.id
                      ? 'border-[#FF9700] bg-[#FF9700]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900">{type.name}</p>
                  <p className="text-sm text-gray-500">{type.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Topic Input */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-4">Topic & Context</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Topic <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9700] focus:border-transparent"
                  placeholder="e.g., Our new SEO service launch"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Context (optional)
                </label>
                <textarea
                  value={additionalContext}
                  onChange={(e) => setAdditionalContext(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9700] focus:border-transparent resize-none"
                  placeholder="Any specific details, tone preferences, or CTAs..."
                />
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
              {error}
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full py-4 bg-[#FF9700] text-white font-semibold rounded-lg hover:bg-[#E68600] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {generating ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate Content
              </>
            )}
          </button>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          {generatedContent ? (
            Object.entries(generatedContent.posts).map(([platformId, post]) => {
              const platform = platforms.find((p) => p.id === platformId)
              return (
                <div
                  key={platformId}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{platform?.icon}</span>
                      <h3 className="font-semibold text-gray-900">{platform?.name}</h3>
                    </div>
                    <button
                      onClick={() => copyToClipboard(platformId, post.content, post.hashtags)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        copied === platformId
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {copied === platformId ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
                  </div>
                  {post.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.hashtags.map((tag) => (
                        <span
                          key={tag}
                          className="text-sm text-[#FF9700] bg-[#FF9700]/10 px-2 py-1 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-3">
                    {post.content.length} characters
                  </p>
                </div>
              )
            })
          ) : (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No content generated yet</h3>
              <p className="text-gray-500">
                Select platforms, content type, and topic, then click generate.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
