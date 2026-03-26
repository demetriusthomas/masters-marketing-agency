import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface ReviewRequestData {
  clientName: string
  clientEmail: string
  personalMessage?: string
}

export interface ReviewRequestLog {
  id: string
  clientName: string
  clientEmail: string
  sentAt: string
  status: 'sent' | 'failed'
}

export async function sendReviewRequest(data: ReviewRequestData): Promise<{ success: boolean; error?: string }> {
  const { clientName, clientEmail, personalMessage } = data

  const googleReviewUrl = process.env.GOOGLE_REVIEW_URL || 'https://g.page/review'
  const businessEmail = process.env.BUSINESS_EMAIL || 'info@mastersmarketingagency.com'

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); padding: 40px 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">Masters Marketing Agency</h1>
              <p style="margin: 10px 0 0; color: #9ca3af; font-size: 14px;">Your Digital Growth Partner</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #1f2937; font-size: 22px; font-weight: bold;">
                Hi ${clientName}! 👋
              </h2>

              <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Thank you for choosing Masters Marketing Agency! We hope our partnership has been valuable for your business.
              </p>

              ${personalMessage ? `
              <div style="background-color: #f9fafb; border-left: 4px solid #FF9700; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                <p style="margin: 0; color: #4b5563; font-size: 16px; line-height: 1.6; font-style: italic;">
                  "${personalMessage}"
                </p>
              </div>
              ` : ''}

              <p style="margin: 0 0 30px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Would you mind taking a moment to share your experience? Your feedback helps other businesses discover how we can help them grow.
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 30px auto;">
                <tr>
                  <td style="border-radius: 50px; background-color: #FF9700;">
                    <a href="${googleReviewUrl}" target="_blank" style="display: inline-block; padding: 16px 40px; font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none;">
                      ⭐ Leave a Review
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6; text-align: center;">
                It only takes a minute and means the world to us!
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                Questions? Reply to this email or reach us at
              </p>
              <a href="mailto:${businessEmail}" style="color: #FF9700; text-decoration: none; font-weight: 600;">
                ${businessEmail}
              </a>
              <p style="margin: 20px 0 0; color: #9ca3af; font-size: 12px;">
                © ${new Date().getFullYear()} Masters Marketing Agency. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

  try {
    const { error } = await resend.emails.send({
      from: 'Masters Marketing Agency <reviews@mastersmarketingagency.com>',
      to: clientEmail,
      subject: `${clientName}, we'd love your feedback!`,
      html: emailHtml,
      replyTo: businessEmail,
    })

    if (error) {
      console.error('Resend error:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Error sending review request:', error)
    return { success: false, error: 'Failed to send email' }
  }
}

export function generateEmailPreview(data: ReviewRequestData): string {
  const { clientName, personalMessage } = data
  const googleReviewUrl = process.env.GOOGLE_REVIEW_URL || 'https://g.page/review'

  return `
Subject: ${clientName}, we'd love your feedback!

Hi ${clientName}! 👋

Thank you for choosing Masters Marketing Agency! We hope our partnership has been valuable for your business.

${personalMessage ? `"${personalMessage}"\n\n` : ''}Would you mind taking a moment to share your experience? Your feedback helps other businesses discover how we can help them grow.

Leave a Review: ${googleReviewUrl}

It only takes a minute and means the world to us!

Best regards,
Masters Marketing Agency
`
}
