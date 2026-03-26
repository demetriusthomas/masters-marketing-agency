const caseStudies = [
  {
    industry: 'Home Services',
    metric: '312%',
    description: 'Increase in organic traffic',
    detail: 'A local plumbing company went from page 5 to #1 rankings for 47 keywords in just 6 months.',
  },
  {
    industry: 'Healthcare',
    metric: '89%',
    description: 'More appointment bookings',
    detail: 'Medical practice doubled their patient inquiries through optimized local SEO and reputation management.',
  },
  {
    industry: 'E-commerce',
    metric: '$2.4M',
    description: 'Revenue generated',
    detail: 'Online retailer saw 4x ROAS through our comprehensive digital marketing strategy.',
  },
  {
    industry: 'Real Estate',
    metric: '156',
    description: 'Leads per month',
    detail: 'Real estate agency increased monthly lead generation by 340% with chat automation.',
  },
]

export default function Results() {
  return (
    <section id="results" className="py-24 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#FF9700] font-semibold text-sm uppercase tracking-wider">
            Proven Results
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            Real Results for
            <span className="text-[#FF9700]"> Real Businesses</span>
          </h2>
          <p className="text-xl text-gray-400">
            We don&apos;t just promise results—we deliver them. Here&apos;s what our clients
            have achieved with our strategies.
          </p>
        </div>

        {/* Results Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {caseStudies.map((study, index) => (
            <div
              key={index}
              className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 hover:border-[#FF9700]/50 transition-colors"
            >
              <span className="text-xs font-semibold text-[#FF9700] uppercase tracking-wider">
                {study.industry}
              </span>
              <div className="text-5xl font-bold text-white my-4">{study.metric}</div>
              <div className="text-lg font-medium text-white mb-3">{study.description}</div>
              <p className="text-sm text-gray-400">{study.detail}</p>
            </div>
          ))}
        </div>

        {/* Guarantee Banner */}
        <div className="mt-16 bg-gradient-to-r from-[#FF9700]/20 to-[#FF9700]/10 rounded-2xl p-8 md:p-12 border border-[#FF9700]/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#FF9700] rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Results Guarantee</h3>
                <p className="text-gray-300">
                  If we don&apos;t improve your metrics in 90 days, we&apos;ll work for free until we do.
                </p>
              </div>
            </div>
            <a
              href="#contact"
              className="whitespace-nowrap inline-flex items-center justify-center px-8 py-4 bg-[#FF9700] text-white font-semibold rounded-full hover:bg-[#E68600] transition-all"
            >
              Claim Your Guarantee
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
