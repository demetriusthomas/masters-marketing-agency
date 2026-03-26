'use client'

import { useState } from 'react'

const faqs = [
  {
    question: 'How long does it take to see results?',
    answer: 'Most clients start seeing measurable improvements within 30-60 days. SEO typically takes 3-6 months for significant organic ranking improvements, while paid advertising and reputation management can show results much faster. We set realistic expectations during your strategy call and provide monthly progress reports.',
  },
  {
    question: 'Do you require long-term contracts?',
    answer: 'No, we don\'t lock you into long-term contracts. We offer month-to-month agreements because we believe in earning your business every month through results. Most clients stay with us for years because of the ROI we deliver, not because they\'re contractually obligated.',
  },
  {
    question: 'How much does your service cost?',
    answer: 'Our pricing varies based on your specific needs, goals, and current online presence. We offer packages starting from $1,500/month for small businesses up to custom enterprise solutions. During your free strategy call, we\'ll provide a detailed quote tailored to your situation.',
  },
  {
    question: 'What industries do you work with?',
    answer: 'We\'ve successfully worked with businesses across many industries including healthcare, home services, real estate, legal, e-commerce, restaurants, and professional services. Our strategies are customized for each industry\'s unique challenges and opportunities.',
  },
  {
    question: 'How do you measure and report results?',
    answer: 'We provide comprehensive monthly reports that track key metrics including website traffic, search rankings, lead generation, conversion rates, and ROI. You\'ll have access to a real-time dashboard, and we schedule monthly review calls to discuss progress and strategy adjustments.',
  },
  {
    question: 'What makes you different from other agencies?',
    answer: 'Three things set us apart: 1) We\'re results-focused with a 90-day guarantee, 2) We provide complete transparency with no hidden fees or confusing reports, and 3) We treat your business like our own with dedicated account managers who know your business inside and out.',
  },
  {
    question: 'Can you help with my existing website?',
    answer: 'Absolutely. We can optimize your existing website for better performance, or if needed, recommend improvements. Many of our clients see significant results just from optimizing their current assets without a complete redesign.',
  },
  {
    question: 'Do you offer a guarantee?',
    answer: 'Yes! We offer a 90-day results guarantee. If we don\'t improve your key metrics within 90 days, we\'ll continue working for free until we do. We\'re confident in our process because it\'s worked for hundreds of businesses just like yours.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#FF9700] font-semibold text-sm uppercase tracking-wider">
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6">
            Questions? We&apos;ve Got
            <span className="text-[#FF9700]"> Answers</span>
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about working with us.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                className="w-full px-6 py-5 flex items-center justify-between text-left bg-white hover:bg-gray-50 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-[#FF9700] flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="mt-12 text-center p-8 bg-gray-50 rounded-2xl">
          <h3 className="text-xl font-bold text-gray-900 mb-3">Still have questions?</h3>
          <p className="text-gray-600 mb-6">
            Can&apos;t find the answer you&apos;re looking for? Our team is here to help.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#FF9700] text-white font-semibold rounded-full hover:bg-[#E68600] transition-all"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  )
}
