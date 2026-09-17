import React from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import useInView from '../../hooks/useInView';

export default function DMFinalCTA() {
  const [ref, isInView] = useInView();

  return (
    <section id="dm-cta" className="py-28 sm:py-32 bg-grad-navy relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-dot-grid opacity-40"></div>
      
      {/* Blurred gradient circles */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-royal/30 rounded-full blur-[100px] -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px] translate-y-1/2"></div>

      <div className="container-px mx-auto max-w-8xl relative z-10">
        <div ref={ref} className={`reveal max-w-3xl mx-auto text-center ${isInView ? 'in-view' : ''}`}>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white mb-6">
            Ready to Build Your Digital Future?
          </h2>
          <p className="text-xl text-white/70 font-sans mb-10">
            Let's create a digital presence that reflects the quality of your business.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="#dm-enquiry" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white btn-glow bg-grad-primary hover:scale-[1.02] transition-all"
            >
              Book a Free Consultation
              <ArrowRight className="w-5 h-5" />
            </a>
            
            <a 
              href="https://wa.me/918897571616?text=Hi,%20I'd%20like%20to%20discuss%20digital%20marketing%20services%20for%20my%20business.%20Can%20we%20schedule%20a%20consultation?" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white border border-white/25 hover:border-white/50 transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              Talk to Us on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
