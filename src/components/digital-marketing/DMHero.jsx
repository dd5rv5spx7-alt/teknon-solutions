import React from 'react';
import { ArrowRight } from 'lucide-react';
import useInView from '../../hooks/useInView';

export default function DMHero() {
  const [ref, isInView] = useInView();

  return (
    <section className="relative overflow-hidden bg-grad-navy pt-32 pb-32 sm:pt-40 sm:pb-40">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-dot-grid opacity-40" />
      
      {/* Blurred gradient circles */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-royal/20 rounded-full blur-[128px] -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[128px] translate-y-1/2" />

      {/* Floating Badges */}
      <div className="absolute inset-0 max-w-7xl mx-auto hidden sm:block pointer-events-none">
        <div className="absolute top-1/4 left-10 lg:left-20 animate-float">
          <span className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium backdrop-blur-md shadow-glow-lg">
            Social Media
          </span>
        </div>
        <div className="absolute top-1/3 right-10 lg:right-20 animate-floatSlow">
          <span className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium backdrop-blur-md shadow-glow-lg">
            SEO
          </span>
        </div>
        <div className="absolute bottom-1/4 left-1/4 animate-floatSlow" style={{ animationDelay: '1s' }}>
          <span className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium backdrop-blur-md shadow-glow-lg">
            Branding
          </span>
        </div>
        <div className="absolute bottom-1/3 right-1/4 animate-float" style={{ animationDelay: '1.5s' }}>
          <span className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium backdrop-blur-md shadow-glow-lg">
            Websites
          </span>
        </div>
      </div>

      <div className="container-px mx-auto max-w-8xl relative z-10 text-center">
        <div 
          ref={ref} 
          className={`max-w-3xl mx-auto flex flex-col items-center reveal ${isInView ? 'in-view' : ''}`}
        >
          <span className="eyebrow text-accent mb-6 inline-block">// Digital Growth Services</span>
          
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white mb-6">
            Turn Your Business Into a <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-[#7DB8FF]">
              Digital Brand.
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-white/70 mb-10 max-w-2xl">
            Build a stronger online presence with social media, premium content, websites, branding and digital marketing — all under one team.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <a 
              href="#dm-enquiry"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-medium btn-glow bg-grad-primary transition-all hover:scale-105 w-full sm:w-auto"
            >
              Get a Free Consultation
              <ArrowRight className="w-5 h-5" />
            </a>
            <a 
              href="#dm-services"
              className="flex items-center justify-center px-8 py-4 rounded-xl text-white font-medium border border-white/20 hover:bg-white/5 transition-colors w-full sm:w-auto"
            >
              Explore Our Services
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
