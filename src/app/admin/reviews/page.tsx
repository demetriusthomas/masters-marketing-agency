'use client'

import { useState } from 'react'

interface SentRequest {
  id: string
  clientName: string
  clientEmail: string
  sentAt: string
}

export default function ReviewRequests() {
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [personalMessage, setPersonalMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [sentRequests, setSentRequests] = useState<SentRequest[]>([])
  const [showPreview, setShowPreview] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!clientName.trim()) {
      setError('Client name is required')
      return
    }
    if (!clientEmail.trim()) {
      setError('Client email is required')
      return
    }

    setError('')
    setSuccess('')
    setSending(true)

    try {
      const response = await fetch('/api/admin/reviews/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName,
          clientEmail,
          personalMessage,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to send review request')
        return
      }

      setSuccess(`Review request sent to ${clientEmail}!`)

      // Add to sent requests list
      setSentRequests((prev) => [
        {
          id: Date.now().toString(),
          clientName,
          clientEmail,
          sentAt: new Date().toISOString(),
        },
        ...prev,
      ])

      // Clear form
      setClientName('')
      setClientEmail('')
      setPersonalMessage('')
      setShowPreview(false)
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Review Requests</h1>
        <p className="text-gray-600 mt-1">Send review request emails to happy clients</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-6">Send Review Request</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Client Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9700] focus:border-transparent"
                  placeholder="John Smith"
                />
              </div>

              {/* Client Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9700] focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>

              {/* Personal Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Personal Message (optional)
                </label>
                <textarea
                  value={personalMessage}
                  onChange={(e) => setPersonalMessage(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9700] focus:border-transparent resize-none"
                  placeholder="Add a personal touch to your request..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will be included in the email to make it more personal.
                </p>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-600 text-sm flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {success}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  disabled={!clientName.trim()}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {showPreview ? 'Hide Preview' : 'Preview Email'}
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="flex-1 py-3 bg-[#FF9700] text-white font-medium rounded-lg hover:bg-[#E68600] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Send Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Email Preview */}
          {showPreview && clientName && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Email Preview</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Subject</p>
                  <p className="font-medium text-gray-900">{clientName}, we&apos;d love your feedback!</p>
                </div>
                <hr className="border-gray-200" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Body</p>
                  <div className="text-sm text-gray-700 space-y-3">
                    <p>Hi {clientName}! 👋</p>
                    <p>Thank you for choosing Masters Marketing Agency! We hope our partnership has been valuable for your business.</p>
                    {personalMessage && (
                      <p className="italic text-gray-600 bg-white p-3 rounded border-l-4 border-[#FF9700]">
                        &ldquo;{personalMessage}&rdquo;
                      </p>
                    )}
                    <p>Would you mind taking a moment to share your experience? Your feedback helps other businesses discover how we can help them grow.</p>
                    <div className="py-4">
                      <span className="inline-block bg-[#FF9700] text-white px-6 py-2 rounded-full font-medium">
                        ⭐ Leave a Review
                      </span>
                    </div>
                    <p className="text-gray-500">It only takes a minute and means the world to us!</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sent Requests Section */}
        <div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-6">Recent Requests</h2>

            {sentRequests.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-500">No requests sent yet this session</p>
                <p className="text-sm text-gray-400 mt-1">Sent requests will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sentRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{request.clientName}</p>
                      <p className="text-sm text-gray-500">{request.clientEmail}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Sent
                      </span>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(request.sentAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tips Card */}
          <div className="mt-6 bg-gradient-to-r from-[#FF9700]/10 to-[#FF9700]/5 rounded-xl p-6 border border-[#FF9700]/20">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#FF9700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Tips for Better Reviews
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-[#FF9700] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Send requests shortly after completing successful work</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-[#FF9700] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Personalize the message with specific results you achieved</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-[#FF9700] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Follow up in person or by phone for higher response rates</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
