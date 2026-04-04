import BookingCalendar from "@/components/BookingCalendar";

export const metadata = {
  title: "Book a Consultation | Masters Marketing Agency",
  description: "Schedule a free consultation with our marketing experts. Let's discuss how we can grow your business.",
};

export default function BookingPage() {
  const services = [
    { name: "Free Strategy Consultation", duration: 30 },
    { name: "Marketing Audit", duration: 60 },
    { name: "Campaign Planning Session", duration: 45 },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Book Your Free Consultation
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ready to take your marketing to the next level? Schedule a call with our team
            and let&apos;s discuss how we can help grow your business.
          </p>
        </div>

        <BookingCalendar
          timezone="America/Los_Angeles"
          services={services}
        />

        <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
          <div className="p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Quick & Easy</h3>
            <p className="text-sm text-gray-600">Book in under a minute. Pick a time that works for you.</p>
          </div>
          <div className="p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">No Obligation</h3>
            <p className="text-sm text-gray-600">Get expert advice with zero pressure. We&apos;re here to help.</p>
          </div>
          <div className="p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Instant Confirmation</h3>
            <p className="text-sm text-gray-600">Receive immediate confirmation via email and text.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
