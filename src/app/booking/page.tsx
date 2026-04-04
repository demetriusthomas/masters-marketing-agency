import BookingCalendar from "@/components/BookingCalendar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF9700' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF9700]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FF9700]/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white/90 text-sm font-medium">Free Consultation</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Book Your <span className="text-[#FF9700]">Strategy Call</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Ready to dominate your market? Let&apos;s discuss how we can grow your business.
            </p>
          </div>

          <BookingCalendar
            timezone="America/Los_Angeles"
            services={services}
          />

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-gray-400">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>No Obligation</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Expert Advice</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Instant Confirmation</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
