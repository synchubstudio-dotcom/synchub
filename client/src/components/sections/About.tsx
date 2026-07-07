"use client";

import React from "react";

interface AboutProps {
  opacity: number;
  translateY: number;
  isActive: boolean;
}

export default function About({ opacity, translateY, isActive }: AboutProps) {
  const capabilities = [
    {
      title: "Interactive 3D",
      subtitle: "WebGL & WebGPU",
      description: "Crafting fluid, physics-driven three-dimensional spaces, interactive shaders, and custom particle engines that run at 60+ FPS.",
      gradient: "from-sky-500/20 to-blue-600/5",
      icon: (
        <svg className="w-6 h-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      title: "Immersive Media",
      subtitle: "XR & Installations",
      description: "Bridging physical environments and digital interactions through immersive installations, custom projection mapping, and AR/VR ecosystems.",
      gradient: "from-purple-500/20 to-pink-600/5",
      icon: (
        <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
    {
      title: "Creative Coding",
      subtitle: "Performance UI",
      description: "Developing highly polished user interfaces with micro-animations, GSAP timelines, and modular layouts engineered for absolute fluid motion.",
      gradient: "from-emerald-500/20 to-teal-600/5",
      icon: (
        <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
    {
      title: "R&D Lab",
      subtitle: "Experimental Tech",
      description: "Constantly prototyping next-gen features, testing experimental APIs, and researching generative design systems to push the limits of the web.",
      gradient: "from-amber-500/20 to-orange-600/5",
      icon: (
        <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
    },
  ];

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        pointerEvents: isActive ? "auto" : "none",
        transition: "opacity 0.2s ease-out, transform 0.2s ease-out",
      }}
      className="absolute inset-0 z-30 flex flex-col justify-center items-center px-6 md:px-12 lg:px-24 overflow-y-auto select-none py-12"
    >
      <div className="max-w-6xl w-full flex flex-col items-center gap-12">
        
        {/* Header Block */}
        <div className="text-center flex flex-col items-center gap-4 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="h-px w-8 bg-neutral-700" />
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold">
              Creative Technology Studio
            </span>
            <span className="h-px w-8 bg-neutral-700" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white via-neutral-200 to-neutral-500 tracking-tight">
            SyncHub
          </h2>
          <p className="text-sm md:text-base text-neutral-400 leading-relaxed font-sans">
            We blend digital art, interactive 3D physics, and creative code to shape state-of-the-art web experiences that leave a lasting impression.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-4">
          {capabilities.map((cap, i) => (
            <div
              key={i}
              className={`group relative overflow-hidden rounded-2xl bg-neutral-950/40 border border-neutral-900/60 backdrop-blur-md p-6 md:p-8 transition-all duration-300 hover:border-neutral-800/80 hover:translate-y-[-2px] flex flex-col justify-between min-h-[180px]`}
            >
              {/* Radial gradient glow on card hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${cap.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}
              />
              
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800/50 group-hover:border-neutral-700/60 transition-colors">
                    {cap.icon}
                  </div>
                  <span className="text-xs font-mono text-neutral-500 font-medium group-hover:text-neutral-400 transition-colors">
                    {cap.subtitle}
                  </span>
                </div>
                
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-bold text-neutral-100 group-hover:text-white transition-colors">
                    {cap.title}
                  </h3>
                  <p className="text-xs md:text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors leading-relaxed font-sans font-light">
                    {cap.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer / CTA Block */}
        <div className="flex flex-col md:flex-row items-center justify-between w-full border-t border-neutral-900/60 pt-8 mt-4 gap-6">
          <div className="flex gap-6 text-xs text-neutral-500 font-mono">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-300 transition-colors">
              [ GitHub ]
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-300 transition-colors">
              [ Twitter ]
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-300 transition-colors">
              [ LinkedIn ]
            </a>
          </div>

          <a
            href="mailto:hello@synchub.co"
            className="group relative inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-neutral-950 border border-neutral-800/80 hover:border-neutral-700 text-xs font-semibold text-neutral-200 hover:text-white transition-all overflow-hidden"
          >
            {/* Glowing effect inside button */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-sky-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative flex items-center gap-1.5 font-sans">
              Let's Collaborate 
              <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </a>
        </div>

      </div>
    </div>
  );
}
