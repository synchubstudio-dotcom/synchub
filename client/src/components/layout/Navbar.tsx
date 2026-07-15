"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useExperienceStore } from "@/store/useExperienceStore";

// Reset the Zustand store state immediately on module load to prevent any hot-reload leaks
if (typeof window !== "undefined") {
  useExperienceStore.getState().setIntroComplete(false);
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isIntroComplete = useExperienceStore((state) => state.isIntroComplete);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isHeaderVisible = mounted && (isIntroComplete || menuOpen);

  // Stagger variants for nav items
  const menuContainerVariants = {
    hidden: { 
      scale: 0, 
      opacity: 0, 
      transition: { 
        type: "spring" as const, 
        stiffness: 380, 
        damping: 35, 
        duration: 0.4 
      } 
    },
    visible: { 
      scale: 1, 
      opacity: 1, 
      transition: { 
        type: "spring" as const, 
        stiffness: 380, 
        damping: 30, 
        duration: 0.4 
      } 
    },
  };

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
  };

  return (
    <>
      {/* Top Header Bar */}
      <header className={`fixed top-0 left-0 w-full z-40 pointer-events-auto h-[98px] px-[28px] flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        menuOpen ? "bg-transparent" : "bg-gradient-to-b from-[#0a0a0a]/40 to-transparent"
      } ${
        isHeaderVisible ? "translate-y-0" : "-translate-y-full"
      }`}>
        {/* Left Side: Geometric Logo */}
        <div className="flex items-center gap-3 group select-none transition-opacity duration-300 opacity-100">
          <svg
            className={`w-7 h-7 transition-colors duration-300 ${
              menuOpen ? "text-neutral-900 sm:text-white" : "text-white"
            }`}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            className={`text-sm tracking-[0.2em] transition-colors duration-300 ${
              menuOpen ? "text-neutral-900 sm:text-white" : "text-white"
            }`}
            style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 300 }}
          >
            Sync<span style={{ fontWeight: 800 }}>HUB</span>&reg;
          </span>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-3 sm:gap-4 transition-opacity duration-300 opacity-100">
          {/* Let's Talk Button */}
          <button
            className={`h-[42px] px-6 rounded-full font-semibold text-xs tracking-wider transition-all duration-300 cursor-pointer ${
              menuOpen
                ? "bg-neutral-950 text-white hover:bg-neutral-800"
                : "bg-white text-neutral-950 hover:scale-105"
            }`}
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            LET'S TALK
          </button>

          {/* Menu Toggle Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`h-[42px] px-5 rounded-full font-semibold text-xs tracking-wider border transition-all duration-300 pointer-events-auto cursor-pointer flex items-center justify-center gap-1.5 ${
              menuOpen
                ? "border-neutral-300 text-neutral-900 bg-transparent hover:bg-neutral-100"
                : "border-white/10 text-white bg-transparent hover:bg-white/5"
            }`}
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            <span>MENU</span>
            <span>{menuOpen ? "\u2715" : "="}</span>
          </button>
        </div>
      </header>

      {/* Slide-out Menu Drawer Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuContainerVariants}
            style={{ transformOrigin: "top right" }}
            className="fixed top-4 right-4 bottom-4 w-[calc(100%-2rem)] sm:w-[380px] z-30 bg-white text-neutral-900 pointer-events-auto flex flex-col justify-between pt-[98px] px-8 pb-8 sm:pt-[98px] sm:px-12 sm:pb-12 shadow-2xl border border-neutral-200/80 rounded-[24px]"
          >
            {/* Navigation Links Group */}
            <motion.div variants={listVariants} className="mt-6 flex flex-col gap-6">
              {["Work", "Services", "About", "Contact"].map((item) => (
                <motion.div
                  key={item}
                  variants={itemVariants}
                  className="overflow-hidden group"
                >
                  <a
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setMenuOpen(false)}
                    className="inline-block text-[44px] sm:text-[50px] font-thin tracking-tight transition-transform duration-300 hover:translate-x-3 select-none"
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      fontWeight: 100,
                      lineHeight: 1.1,
                    }}
                  >
                    {item}
                  </a>
                </motion.div>
              ))}
            </motion.div>

            {/* Bottom Group (Enquiries, Socials, Story) */}
            <div className="flex flex-col gap-8">
              {/* Business Enquiry */}
              <div className="flex flex-col gap-2">
                <span
                  className="text-[10px] uppercase tracking-[0.2em] font-semibold text-neutral-400"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  BUSINESS ENQUIRY
                </span>
                <a
                  href="mailto:hello@synchub.com"
                  className="text-sm font-light hover:text-neutral-500 transition-colors"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  E. hello@synchub.com
                </a>
                <a
                  href="tel:+919824182099"
                  className="text-sm font-light hover:text-neutral-500 transition-colors"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  P. +91 98241 82099
                </a>
              </div>

              {/* Social Channels */}
              <div className="flex flex-col gap-3">
                <span
                  className="text-[10px] uppercase tracking-[0.2em] font-semibold text-neutral-400"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  SOCIAL
                </span>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm font-light">
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    className="hover:text-neutral-500 transition-colors"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    Linkedin
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    className="hover:text-neutral-500 transition-colors"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    Facebook
                  </a>
                  <a
                    href="https://dribbble.com"
                    target="_blank"
                    className="hover:text-neutral-500 transition-colors"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    Dribbble
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    className="hover:text-neutral-500 transition-colors"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    Instagram
                  </a>
                </div>
              </div>

              {/* Bottom Custom Button */}
              <button
                className="w-full h-12 rounded-full border border-neutral-300 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 flex items-center justify-center gap-2 text-xs tracking-wider transition-all duration-300 cursor-pointer"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                <span>&#10022;</span>
                <span>THE SYNCHUB STORY</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
