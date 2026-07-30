import React from 'react';
import Seo from '../components/Seo.jsx';
import Navbar from '../components/Navbar.jsx';
import SolutionsHero from '../components/solutions/SolutionsHero.jsx';
import ServiceGrid from '../components/solutions/ServiceGrid.jsx';
import SolutionsProcess from '../components/solutions/SolutionsProcess.jsx';
import TechStackStrip from '../components/solutions/TechStackStrip.jsx';
import SolutionsTrust from '../components/solutions/SolutionsTrust.jsx';
import SolutionsCaseStudies from '../components/solutions/SolutionsCaseStudies.jsx';
import SolutionsFAQ from '../components/solutions/SolutionsFAQ.jsx';
import QuoteForm from '../components/solutions/QuoteForm.jsx';
import Footer from '../components/Footer.jsx';
import WhatsAppButton from '../components/WhatsAppButton.jsx';
import { SOLUTIONS_SERVICES } from '../data/solutionsData.js';

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://www.ateknonsolutions.com/#organization',
  name: 'A Teknon Solutions',
  url: 'https://www.ateknonsolutions.com/it-solutions',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'IT Solutions Services',
    itemListElement: SOLUTIONS_SERVICES.map((s) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: s.name, description: s.description, areaServed: 'IN' },
    })),
  },
};

export default function ITSolutions() {
  return (
    <div id="site-root" className="min-h-screen bg-white dark:bg-navy transition-colors duration-300">
      <Seo
        title="IT Solutions & Cybersecurity Services | A Teknon Solutions"
        description="Website & software development, cybersecurity consulting, penetration testing, malware analysis, and cloud/DevOps for businesses — request a quote from A Teknon Solutions."
        path="/it-solutions"
        ogTitle="A Teknon Solutions — IT Solutions for Growing Businesses"
        ogDescription="Custom software, cybersecurity audits, penetration testing, and cloud engineering, delivered by the team behind A Teknon Solutions' own training programs."
        jsonLd={JSON_LD}
      />
      <Navbar />
      <main>
        <SolutionsHero />
        <ServiceGrid />
        <SolutionsProcess />
        <TechStackStrip />
        <SolutionsTrust />
        <SolutionsCaseStudies />
        <SolutionsFAQ />
        <QuoteForm />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
