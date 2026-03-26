import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic()

interface Platform {
  name: string
  maxLength: number
  style: string
}

const platforms: Record<string, Platform> = {
  instagram: {
    name: 'Instagram',
    maxLength: 2200,
    style: 'Visual, engaging, use emojis moderately, line breaks for readability, include relevant hashtags',
  },
  facebook: {
    name: 'Facebook',
    maxLength: 63206,
    style: 'Conversational, can be longer, encourage engagement with questions, minimal hashtags',
  },
  linkedin: {
    name: 'LinkedIn',
    maxLength: 3000,
    style: 'Professional, thought leadership, industry insights, use line breaks, 3-5 relevant hashtags',
  },
  twitter: {
    name: 'Twitter/X',
    maxLength: 280,
    style: 'Concise, punchy, attention-grabbing, 1-2 hashtags max, can use thread format',
  },
}

const contentTypes: Record<string, string> = {
  promotional: 'Promote a service or product, highlight benefits and value proposition',
  educational: 'Share valuable tips, insights, or how-to information',
  testimonial: 'Share customer success story or review',
  behind_scenes: 'Show behind-the-scenes content, team culture, or process',
  industry_news: 'Comment on industry trends or news',
  engagement: 'Create engaging content that encourages comments and shares',
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { selectedPlatforms, contentType, topic, additionalContext } = body

    if (!selectedPlatforms?.length || !contentType || !topic) {
      return NextResponse.json(
        { error: 'Platforms, content type, and topic are required' },
        { status: 400 }
      )
    }

    const platformInstructions = selectedPlatforms
      .map((p: string) => {
        const platform = platforms[p]
        if (!platform) return null
        return `${platform.name}:
- Max length: ${platform.maxLength} characters
- Style: ${platform.style}`
      })
      .filter(Boolean)
      .join('\n\n')

    const prompt = `You are a social media marketing expert for Masters Marketing Agency, a digital marketing agency that specializes in SEO, reputation management, chat & lead capture, SMS marketing, and AI automation.

Create social media content for the following platforms:

${platformInstructions}

Content Type: ${contentTypes[contentType] || contentType}

Topic/Context: ${topic}

${additionalContext ? `Additional Instructions: ${additionalContext}` : ''}

Generate engaging, on-brand content for each platform. The agency's brand voice is:
- Confident and results-driven
- Approachable but professional
- Action-oriented with clear CTAs
- Focused on helping businesses grow

For each platform, provide:
1. The main caption/post content
2. A list of relevant hashtags (where appropriate for the platform)

Format your response as JSON with this structure:
{
  "posts": {
    "platform_name": {
      "content": "The post content here",
      "hashtags": ["hashtag1", "hashtag2"]
    }
  }
}

Only include the platforms that were requested. Make sure the content is unique and tailored to each platform's audience and format.`

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    })

    // Extract the text content
    const textContent = response.content.find((c) => c.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from AI')
    }

    // Parse the JSON from the response
    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Could not parse AI response')
    }

    const generatedContent = JSON.parse(jsonMatch[0])

    return NextResponse.json(generatedContent)
  } catch (error) {
    console.error('Error generating social content:', error)
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    )
  }
}
