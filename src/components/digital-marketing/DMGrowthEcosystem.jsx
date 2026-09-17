import React from 'react';
import SectionHeading from '../SectionHeading.jsx';
import useInView from '../../hooks/useInView.js';
import { DM_GROWTH_ECOSYSTEM } from '../../data/digitalMarketingData.js';
import { ArrowDown } from 'lucide-react';

const DMGrowthEcosystem = () => {
  const [ref, isInView] = useInView();

  return (
    <section id="dm-ecosystem" className="py-28 sm:py-32 bg-grad-navy relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-grid opacity-10 pointer-events-none"></div>
      
      <div className="container-px mx-auto max-w-4xl relative z-10">
        <SectionHeading 
          label="Ecosystem"
          title="One Team. One Digital Ecosystem."
          subtitle="Every capability connects to form a complete growth engine for your business."
          align="center"
          light={true}
        />

        <div ref={ref} className={`mt-20 flex flex-col items-center gap-4 sm:gap-6 reveal ${isInView ? 'in-view' : ''}`}>
          {DM_GROWTH_ECOSYSTEM.map((step, idx) => {
            const isLast = idx === DM_GROWTH_ECOSYSTEM.length - 1;
            
            return (
              <React.Fragment key={idx}>
                {/* Node */}
                <div 
                  className={`relative w-full max-w-lg transition-all duration-700`}
                  style={{
                    transitionDelay: `${idx * 150}ms`,
                    opacity: isInView ? 1 : 0,
                    transform: isInView ? 'translateY(0)' : 'translateY(2rem)'
                  }}
                >
                  <div className={`rounded-2xl border ${isLast ? 'border-accent/40 bg-accent/10 shadow-glow-lg' : 'border-white/10 bg-white/[0.06]'} p-6 flex items-center gap-5`}>
                    <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center ${isLast ? 'bg-accent text-white' : 'bg-white/10 text-white/80'}`}>
                      <step.icon size={28} strokeWidth={isLast ? 2.5 : 2} />
                    </div>
                    <div>
                      <h3 className={`font-display font-bold ${isLast ? 'text-2xl text-white' : 'text-xl text-white/90'}`}>
                        {step.title}
                      </h3>
                      {step.description && (
                        <p className="mt-1 text-white/70 text-sm">
                          {step.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Connector */}
                {!isLast && (
                  <div 
                    className={`flex flex-col items-center justify-center transition-all duration-700`}
                    style={{
                      transitionDelay: `${idx * 150 + 75}ms`,
                      opacity: isInView ? 1 : 0
                    }}
                  >
                    {/* Desktop Connector (dotted line) */}
                    <div className="hidden sm:block h-8 border-l-2 border-dashed border-white/20"></div>
                    {/* Mobile Connector (arrow) */}
                    <div className="sm:hidden text-white/30 py-2">
                      <ArrowDown size={24} />
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DMGrowthEcosystem;
