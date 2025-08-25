// src/components/CTA.tsx
// ─────────────────────────────────────────────────────────────
// “Schedule a Demo” now navigates with React Router instead of
// onNavigate().  No props required.

import React from 'react';
import { Link } from 'react-router-dom';

const CTA: React.FC = () => (
  <section id="contact-cta" className="py-24 sm:py-32">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative isolate overflow-hidden bg-gradient-to-br from-indigo-700 to-slate-900 px-6 py-24 text-center shadow-xl shadow-indigo-900/10 rounded-3xl sm:px-16">
        <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Ready to Revolutionize Your Business?
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-100">
          Schedule a free, no-obligation demo with me to discover how Asorbit can tailor
          a solution for your unique needs.
        </p>

        {/* ─── Button that changes the URL to /contact-v2 ─── */}
        <div className="mt-10 flex items-center justify-center">
          <Link
            to="/contact-v2"
            className="rounded-lg bg-white px-8 py-3.5 text-base font-semibold text-indigo-600 shadow-lg hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-300 transform hover:scale-105"
          >
            Schedule&nbsp;a&nbsp;Demo
          </Link>
        </div>

        {/* background decoration (unchanged) */}
        <svg
          viewBox="0 0 1024 1024"
          className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
          aria-hidden="true"
        >
          <circle cx="512" cy="512" r="512" fill="url(#gradient-cta)" fillOpacity="0.7" />
          <defs>
            <radialGradient id="gradient-cta">
              <stop stopColor="#4F46E5" />
              <stop offset="1" stopColor="#06B6D4" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </div>
  </section>
);

export default CTA;
