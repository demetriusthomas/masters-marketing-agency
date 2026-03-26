export default function SocialProof() {
  const stats = [
    { value: '100+', label: 'Businesses Served' },
    { value: '100K+', label: 'Leads Generated' },
    { value: '95%', label: 'Client Retention' },
    { value: '4.9★', label: 'Average Rating' },
  ]

  const logos = [
    'Fortune 500 Experience',
    'Google Partner',
    'Meta Business Partner',
    'Yelp Advertising Partner',
  ]

  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#FF9700] mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Partner Logos */}
        <div className="border-t border-gray-100 pt-12">
          <p className="text-center text-gray-500 text-sm uppercase tracking-wider mb-8">
            Trusted Partners & Certifications
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {logos.map((logo, index) => (
              <div
                key={index}
                className="px-6 py-3 bg-gray-50 rounded-lg text-gray-600 font-medium text-sm"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
