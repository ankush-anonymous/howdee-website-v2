import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Sparkles } from "lucide-react";


const HeroSection = () => {
  const languages = [
    { text: "Howdee", lang: "English" },
    { text: "हाउडी", lang: "Hindi" },
    { text: "ஹவுடி", lang: "Tamil" },
    { text: "హౌడీ", lang: "Telugu" },
    { text: "হাউডি", lang: "Bengali" },
    { text: "હાઉડી", lang: "Gujarati" },
    { text: "हाउडी", lang: "Marathi" },
  ];

  const [currentLanguage, setCurrentLanguage] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const currentLangText = languages[currentLanguage].text;

    if (isTyping) {
      if (displayText.length < currentLangText.length) {
        const timeout = setTimeout(() => {
          setDisplayText(currentLangText.slice(0, displayText.length + 1));
        }, 150);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
        return () => clearTimeout(timeout);
      }
    } else {
      if (displayText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 100);
        return () => clearTimeout(timeout);
      } else {
        setCurrentLanguage((prev) => (prev + 1) % languages.length);
        setIsTyping(true);
      }
    }
  }, [displayText, isTyping, currentLanguage, languages]);

  return (
    <div className="h-[30vh] flex items-center justify-center my-10">
      <div className="text-center space-y-6">
        {/* Typewriter Animation */}
        <div>
          <h1 className="text-8xl font-bold mb-4" style={{ color: "#ff6b6b" }}>
            {displayText}
            <span className="animate-pulse text-gray-400">|</span>
          </h1>
        </div>

        {/* Tagline */}
        <p className="text-2xl font-bold text-gray-700">
          Your Personal Marketing and Branding Agency
        </p>

         <div className="pt-4">
                  <Link href="/chat">

        <button
            className="group bg-white font-semibold px-12 py-4 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden"
            style={{ color: "#ff6b6b" }}
          >
            {/* Hover background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-50 to-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <span className="relative z-10 flex items-center">
              Create Now
              <Sparkles
                className="w-5 h-5 ml-3 group-hover:animate-spin transition-transform duration-300"
                style={{ color: "#ff6b6b" }}
              />
            </span>
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
