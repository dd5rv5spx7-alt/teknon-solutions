import React from 'react';
import Seo from '../components/Seo.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import WhatsAppButton from '../components/WhatsAppButton.jsx';

import DMHero from '../components/digital-marketing/DMHero.jsx';
import DMIntro from '../components/digital-marketing/DMIntro.jsx';
import DMServices from '../components/digital-marketing/DMServices.jsx';
import DMSocialMedia from '../components/digital-marketing/DMSocialMedia.jsx';
import DMInstagram from '../components/digital-marketing/DMInstagram.jsx';
import DMContent from '../components/digital-marketing/DMContent.jsx';
import DMWebDev from '../components/digital-marketing/DMWebDev.jsx';
import DMSeoGoogle from '../components/digital-marketing/DMSeoGoogle.jsx';
import DMGrowthEcosystem from '../components/digital-marketing/DMGrowthEcosystem.jsx';
import DMPackages from '../components/digital-marketing/DMPackages.jsx';
import DMWhyTeknon from '../components/digital-marketing/DMWhyTeknon.jsx';
import DMProcess from '../components/digital-marketing/DMProcess.jsx';
import DMCaseStudies from '../components/digital-marketing/DMCaseStudies.jsx';
import DMTestimonials from '../components/digital-marketing/DMTestimonials.jsx';
import DMFinalCTA from '../components/digital-marketing/DMFinalCTA.jsx';
import DMEnquiryForm from '../components/digital-marketing/DMEnquiryForm.jsx';

import { DM_SERVICES, DM_SEO } from '../data/digitalMarketingData.js';

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://www.ateknonsolutions.com/#organization',
  name: 'A Teknon Solutions',
  url: 'https://www.ateknonsolutions.com/digital-marketing',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Digital Marketing Services',
    itemListElement: DM_SERVICES.map((s) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: s.name,
        description: s.description,
        areaServed: 'IN',
      },
    })),
  },
};

export default function DigitalMarketing() {
  return (
    <div id="site-root" className="min-h-screen bg-white dark:bg-navy transition-colors duration-300">
      <Seo
        title={DM_SEO.title}
        description={DM_SEO.description}
        path="/digital-marketing"
        ogTitle={DM_SEO.ogTitle}
        ogDescription={DM_SEO.ogDescription}
        jsonLd={JSON_LD}
      />
      <Navbar />
      <main>
        <DMHero />
        <DMIntro />
        <DMServices />
        <DMSocialMedia />
        <DMInstagram />
        <DMContent />
        <DMWebDev />
        <DMSeoGoogle />
        <DMGrowthEcosystem />
        <DMPackages />
        <DMWhyTeknon />
        <DMProcess />
        <DMCaseStudies />
        <DMTestimonials />
        <DMFinalCTA />
        <DMEnquiryForm />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
