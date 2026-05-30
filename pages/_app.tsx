import Navbar from "@/components/navbar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react"
import { Footer } from "@/components/ui/footer";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.hairandmakeupbyanjali.com";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Anjali Bhutani - Best Makeup Artist in Chandigarh & Delhi | Bridal & Party Makeup</title>
        <meta name="google-site-verification" content="Zvu-78XubYkeGnVEN-4iaFlCWQvq-80WTF0OcD3D5Fg" />
        <meta name="description" content="Anjali Bhutani is the best makeup artist in Chandigarh and Delhi, offering professional bridal, party, and HD makeup services. Book your session at our premium makeup studio today!" />
        <meta name="keywords" content="Anjali Bhutani, best makeup artist in Chandigarh, best makeup artist in Delhi, best makeup studio in Chandigarh, best makeup studio in Delhi, bridal makeup, party makeup, HD makeup, professional makeup artist, wedding makeup, airbrush makeup, makeup studio, makeup services" />
        <meta name="author" content="Anjali Bhutani" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:site_name" content="Anjali Bhutani - Makeup Artist" />
        <meta property="og:title" content="Anjali Bhutani - Best Makeup Artist in Chandigarh & Delhi" />
        <meta property="og:description" content="Looking for the best bridal or party makeup in Chandigarh and Delhi? Anjali Bhutani offers professional makeup services at our premium makeup studio." />
        <meta property="og:image" content={`${BASE_URL}/og-image.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Anjali Bhutani - Professional Makeup Artist" />
        <meta property="og:url" content={`${BASE_URL}/`} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter / WhatsApp Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Anjali Bhutani - Best Makeup Artist in Chandigarh & Delhi" />
        <meta name="twitter:description" content="Looking for the best bridal or party makeup in Chandigarh and Delhi? Anjali Bhutani offers professional makeup services at our premium makeup studio." />
        <meta name="twitter:image" content={`${BASE_URL}/og-image.jpg`} />
        <meta name="twitter:image:alt" content="Anjali Bhutani - Professional Makeup Artist" />

        {/* JSON-LD Structured Data (SEO Optimization) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Anjali Bhutani",
              "jobTitle": "Professional Makeup Artist",
              "image": "https://www.hairandmakeupbyanjali.com/anjali.jpg",
              "sameAs": [
                "https://www.instagram.com/hairandmakeupbyanjali/",
                "https://www.linkedin.com/in/anjali-bhutani/"
              ],
              "description": "Anjali Bhutani is the best makeup artist in Chandigarh and Delhi, offering professional bridal, HD, and airbrush makeup services at our premium makeup studio.",
              "url": "https://www.hairandmakeupbyanjali.com/",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Chandigarh",
                "addressRegion": "Chandigarh",
                "addressCountry": "IN"
              },
              "areaServed": ["Chandigarh", "Delhi"],
              "keywords": ["best makeup artist in Chandigarh", "best makeup artist in Delhi", "best makeup studio in Chandigarh", "best makeup studio in Delhi", "bridal makeup", "party makeup", "HD makeup"]
            })
          }}
        />
        <link rel="canonical" href="https://www.hairandmakeupbyanjali.com/" />
      </Head>
      <div className="min-h-screen flex flex-col dark">
        <Navbar />
        {/* <Topbar /> */}
        <main className="flex-grow">
          <Component {...pageProps} />
          <Analytics />
        </main>
        <Footer />
      </div>
    </>
  );
}
