import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { sendReviewRequest } from '@/lib/reviews'

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { clientName, clientEmail, personalMessage } = body

    if (!clientName || !clientEmail) {
      return NextResponse.json(
        { error: 'Client name and email are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(clientEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const result = await sendReviewRequest({
      clientName,
      clientEmail,
      personalMessage,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send review request' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Review request sent to ${clientEmail}`,
    })
  } catch (error) {
    console.error('Error sending review request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
