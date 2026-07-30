import React, { useState } from 'react';
import Seo from '../components/Seo.jsx';
import Navbar from '../components/Navbar.jsx';
import ChooserModal from '../components/ChooserModal.jsx';
import Hero from '../components/Hero.jsx';
import Stats from '../components/Stats.jsx';
import About from '../components/About.jsx';
import WhyChooseUs from '../components/WhyChooseUs.jsx';
import Programs from '../components/Programs.jsx';
import Technologies from '../components/Technologies.jsx';
import Process from '../components/Process.jsx';
import Courses from '../components/Courses.jsx';
import Benefits from '../components/Benefits.jsx';
import Testimonials from '../components/Testimonials.jsx';
import Gallery from '../components/Gallery.jsx';
import Pricing from '../components/Pricing.jsx';
import FAQ from '../components/FAQ.jsx';
import CTA from '../components/CTA.jsx';
import Contact from '../components/Contact.jsx';
import Footer from '../components/Footer.jsx';
import WhatsAppButton from '../components/WhatsAppButton.jsx';

export default function MarketingSite() {
  const [chooserOpen, setChooserOpen] = useState(true);

  return (
    <div id="site-root" className="min-h-screen bg-white dark:bg-navy transition-colors duration-300">
      {chooserOpen && <ChooserModal onClose={() => setChooserOpen(false)} />}
      <Seo
        title="A Teknon Solutions | IT Internship & Training Institute, Rajahmundry"
        description="IT internships & training in Python, Full Stack, Java, AI, and Cybersecurity — live projects, mentorship, certification, placement help. Rajahmundry."
        ogTitle="A Teknon Solutions | Learn. Build. Grow."
        ogDescription="Industry-oriented IT internships & training — live projects, expert mentorship, certification and placement assistance. Online & offline classes in Rajahmundry."
        path="/"
      />
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <About />
        <WhyChooseUs />
        <Programs />
        <Technologies />
        <Process />
        <Courses />
        <Benefits />
        <Testimonials />
        <Gallery />
        <Pricing />
        <FAQ />
        <CTA />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
