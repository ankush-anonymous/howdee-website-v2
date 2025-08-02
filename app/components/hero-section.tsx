import Link from 'next/link';
import React, { useState, useEffect } from 'react';

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
            className="group relative px-8 py-4 text-lg font-bold text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
            style={{ backgroundColor: "#ff6b6b" }}
          >
            {/* Hover effect background */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Button text */}
            <span className="relative z-10 group-hover:text-white transition-colors duration-300">
              Try Now for Free!!
            </span>
            
            {/* Animated sparkle effect */}
            <div className="absolute top-1/2 right-4 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </div>
            
            {/* Ripple effect on hover */}
            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 group-hover:animate-ping bg-white" />
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
