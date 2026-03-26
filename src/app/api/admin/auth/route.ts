import { NextRequest, NextResponse } from 'next/server'

const SESSION_COOKIE_NAME = 'mma_admin_session'
const SESSION_DURATION = 60 * 60 * 24 * 7 // 7 days in seconds

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    const adminPassword = process.env.ADMIN_PASSWORD
    if (!adminPassword || password !== adminPassword) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    // Generate session token
    const sessionToken = Date.now().toString(36) + Math.random().toString(36).substring(2)

    // Build cookie string
    const cookieParts = [
      `${SESSION_COOKIE_NAME}=${sessionToken}`,
      'Path=/',
      'HttpOnly',
      'SameSite=Lax',
      `Max-Age=${SESSION_DURATION}`,
    ]
    const cookieString = cookieParts.join('; ')

    const response = NextResponse.json({ success: true })
    response.headers.set('Set-Cookie', cookieString)
    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    const cookieParts = [
      `${SESSION_COOKIE_NAME}=`,
      'Path=/',
      'HttpOnly',
      'SameSite=Lax',
      'Max-Age=0',
    ]
    const cookieString = cookieParts.join('; ')

    const response = NextResponse.json({ success: true })
    response.headers.set('Set-Cookie', cookieString)
    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
