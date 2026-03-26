export default function SchemaMarkup() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://mastersmarketingagency.com/#business",
    "name": "Masters Marketing Agency",
    "image": "https://mastersmarketingagency.com/logo-bw.png",
    "description": "Digital marketing agency specializing in SEO, reputation management, lead generation, and SMS marketing. Serving Las Vegas and nationwide.",
    "url": "https://mastersmarketingagency.com",
    "telephone": "+1-888-897-4758",
    "email": "info@mastersmarketingagency.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "304 S. Jones Blvd., Suite #5977",
      "addressLocality": "Las Vegas",
      "addressRegion": "NV",
      "postalCode": "89107",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 36.1699,
      "longitude": -115.1398
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "09:00",
        "closes": "18:00"
      }
    ],
    "priceRange": "$$",
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    },
    "serviceType": [
      "Search Engine Optimization",
      "Reputation Management",
      "Lead Generation",
      "SMS Marketing",
      "Digital Marketing"
    ],
    "sameAs": [
      "https://www.facebook.com/mastersmarketingagency",
      "https://www.linkedin.com/company/mastersmarketingagency",
      "https://www.instagram.com/mastersmarketingagency"
    ]
  }

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Masters Marketing Agency",
    "url": "https://mastersmarketingagency.com",
    "logo": "https://mastersmarketingagency.com/logo-bw.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-888-897-4758",
      "contactType": "sales",
      "availableLanguage": "English"
    }
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How long does it take to see results?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most clients start seeing measurable improvements within 30-60 days. SEO typically takes 3-6 months for significant organic ranking improvements, while paid advertising and reputation management can show results much faster."
        }
      },
      {
        "@type": "Question",
        "name": "Do you require long-term contracts?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No, we don't lock you into long-term contracts. We offer month-to-month agreements because we believe in earning your business every month through results."
        }
      },
      {
        "@type": "Question",
        "name": "How much does your service cost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our pricing varies based on your specific needs, goals, and current online presence. We offer packages starting from $1,500/month for small businesses up to custom enterprise solutions."
        }
      },
      {
        "@type": "Question",
        "name": "What industries do you work with?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We've successfully worked with businesses across many industries including healthcare, home services, real estate, legal, e-commerce, restaurants, and professional services."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer a guarantee?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! We offer a 90-day results guarantee. If we don't improve your key metrics within 90 days, we'll continue working for free until we do."
        }
      }
    ]
  }

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Digital Marketing Services",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Masters Marketing Agency"
    },
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Digital Marketing Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Search Engine Optimization (SEO)",
            "description": "Dominate Google search results and drive organic traffic that converts with proven white-hat SEO strategies."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Reputation Management",
            "description": "Build trust and credibility with a stellar online reputation through review generation and brand monitoring."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Chat & Lead Capture",
            "description": "Never miss a lead with smart chat widgets and automation tools that capture and nurture prospects 24/7."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "SMS & MMS Marketing",
            "description": "Reach customers instantly with text message marketing featuring 98% open rates."
          }
        }
      ]
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
    </>
  )
}
