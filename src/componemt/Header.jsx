import React from "react";
import { ShieldCheck, Lock } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full bg-gray-50 border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 py-3">
        
        {/* Left: Logo + Trust Badges */}
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center text-white font-bold">
              L
            </div>
            <span className="font-semibold text-gray-800">Legal Aid</span>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center space-x-4 text-xs text-gray-600">
            <span className="px-2 py-1 bg-gray-100 rounded">BBB Accredited</span>
            <span className="px-2 py-1 bg-gray-100 rounded">Free, No Obligation</span>
            <span className="flex items-center px-2 py-1 bg-gray-100 rounded space-x-1">
              <Lock className="w-3 h-3" />
              <span>Secure SSL</span>
            </span>
          </div>
        </div>

        {/* Right: CTA or Icons (optional) */}
          {/* Right: CTA or Icons (optional) */}
          <div className="mt-3 md:mt-0 flex space-x-3">
            {/* Button removed */}
          </div>
      </div>

      {/* Headline + Subheadline */}
      <div className="max-w-3xl mx-auto text-center px-4 py-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          AFFF Foam Cancer Lawsuit – Check Eligibility
        </h1>
        <p className="mt-2 text-gray-600 text-sm md:text-base">
          Answer a few quick questions to see if you qualify. Takes less than 2 minutes.
        </p>
      </div>
    </header>
  );
}
