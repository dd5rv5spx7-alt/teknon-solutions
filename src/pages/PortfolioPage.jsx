import React from 'react';
import Seo from '../components/Seo.jsx';
import Navbar from '../components/Navbar.jsx';
import Experience from '../components/Experience.jsx';
import Education from '../components/Education.jsx';
import Footer from '../components/Footer.jsx';
import WhatsAppButton from '../components/WhatsAppButton.jsx';
import { ArrowLeft, Shield, Terminal, Award, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PROFILE_INFO } from '../data/portfolioData.js';

export default function PortfolioPage() {
  return (
    <div id="site-root" className="min-h-screen bg-[#080B11] text-white transition-colors duration-300">
      <Seo
        title="Mukesh Vasudhar | Executive Experience, Leadership & Education"
        description="Professional journey of Mukesh Vasudhar — Chief Technology Officer at A Teknon Solutions, Cybersecurity Engineering student at SRM University AP, and student body leader."
        path="/experience"
        ogTitle="Mukesh Vasudhar — Professional Experience & Leadership Record"
        ogDescription="Explore the verified technical leadership, executive management, and academic background of Mukesh Vasudhar."
      />
      <Navbar />

      <main>
        {/* Executive Profile Intro Header */}
        <section className="relative pt-36 pb-16 sm:pt-44 sm:pb-20 bg-gradient-to-b from-[#0B101D] to-[#080B11] border-b border-white/5 overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative container-px mx-auto max-w-6xl">
            <Link
              to="/#about"
              className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-emerald-400 transition-colors mb-6 py-1"
            >
              <ArrowLeft size={14} />
              <span>Back to Overview</span>
            </Link>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-xs font-mono text-emerald-400 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>VERIFIED PROFESSIONAL RECORD</span>
                </div>

                <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.08]">
                  {PROFILE_INFO.name}
                </h1>

                <p className="mt-3 text-lg sm:text-xl font-medium text-emerald-400 font-display">
                  {PROFILE_INFO.tagline}
                </p>

                <p className="mt-4 text-base sm:text-lg text-zinc-300 leading-relaxed font-sans max-w-2xl">
                  {PROFILE_INFO.bio}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm font-mono text-zinc-400">
                  <span className="inline-flex items-center gap-2">
                    <MapPin size={15} className="text-emerald-400" />
                    {PROFILE_INFO.location}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Shield size={15} className="text-blue-400" />
                    Specialization: Cybersecurity
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Terminal size={15} className="text-purple-400" />
                    Chief Technology Officer
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#experience"
                  className="btn-glow px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#080B11] font-semibold text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.35)]"
                >
                  View Experience Timeline
                </a>
                <a
                  href="#education"
                  className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-sm border border-white/10 transition-colors"
                >
                  Academic Background
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <Experience />

        {/* Education Section */}
        <Education />
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
