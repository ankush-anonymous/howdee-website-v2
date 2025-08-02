"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Mic, Sparkles } from "lucide-react";
import React from "react";

const steps = [
  {
    title: "Step 1",
    description: "Upload your selfie",
    icon: Upload,
    placeholder: "Drop your beautiful selfie here! ✨",
  },
  {
    title: "Step 2",
    description: "Say the name of the festival or occasion",
    icon: Mic,
    placeholder: "Tell us about your special moment! 🎤",
  },
  {
    title: "Result",
    description: "Get your AI-generated image",
    icon: Sparkles,
    placeholder: "Your magical creation awaits! 🎨",
  },
];

export default function PersonalizedCreativeFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-step"));
            setCurrentStep(index);
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className="flex w-full min-h-screen font-sans"
      style={{ backgroundColor: "#fbf5df" }}
    >
      {/* Left Sticky Side */}
      <div className="w-1/2 sticky top-0 h-screen flex items-center justify-center relative overflow-hidden">
        <div
          className="absolute top-10 left-10 w-16 h-16 rounded-full opacity-10 animate-pulse"
          style={{ backgroundColor: "#ff6b6b" }}
        ></div>
        <div
          className="absolute bottom-20 right-10 w-12 h-12 rounded-full opacity-15 animate-pulse"
          style={{ backgroundColor: "#ff6b6b", animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/3 right-20 w-8 h-8 rounded-full opacity-20 animate-pulse"
          style={{ backgroundColor: "#ff6b6b", animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/4 left-1/4 w-6 h-6 rounded-full opacity-15 animate-float"
          style={{ backgroundColor: "#ff6b6b" }}
        ></div>

        <div className="text-center space-y-6 z-10 px-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8 text-center"
          >
            <h2 className="text-5xl font-bold mb-4 text-[#ff6b6b] flex flex-wrap items-center justify-center gap-2">
              Flow of
              <span className="flex items-center">
                {/* Replace "H" with logo image */}
                <img
                  src="/logo2.png"
                  alt="H logo"
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
                />
                <span>owdee</span>
              </span>
            </h2>

            <p className="text-xl text-gray-700 font-medium">
              Follow the steps to get your Howdee creative
            </p>
          </motion.div>

          <div className="flex justify-center gap-4 py-6">
            {steps.map((_, index) => (
              <motion.div
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  index === currentStep ? "scale-125 shadow-lg" : "bg-gray-300"
                }`}
                style={{
                  backgroundColor:
                    index === currentStep ? "#ff6b6b" : "#d1d5db",
                }}
                whileHover={{ scale: 1.3 }}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mt-10 rounded-3xl p-8 shadow-xl border-2"
              style={{
                backgroundColor: "#fbf5df",
                borderColor: "rgba(255, 107, 107, 0.2)",
              }}
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                {React.createElement(steps[currentStep].icon, {
                  className: "w-8 h-8",
                  style: { color: "#ff6b6b" },
                })}
                <h3 className="text-2xl font-bold" style={{ color: "#ff6b6b" }}>
                  {steps[currentStep].title}
                </h3>
              </div>
              <p className="text-gray-700 text-lg font-medium">
                {steps[currentStep].description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Right Panel - Scrollable with Page */}
      <div className="w-1/2 flex flex-col">
        {steps.map((step, index) => (
          <div
            key={index}
            data-step={index}
            ref={(el) => (sectionsRef.current[index] = el)}
            className="h-screen flex items-center justify-center relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, #fbf5df 0%, rgba(255, 107, 107, 0.05) 100%)`,
            }}
          >
            <motion.div
              className="absolute top-20 left-10 w-6 h-6 rounded-full opacity-20"
              style={{ backgroundColor: "#ff6b6b" }}
              animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-32 right-16 w-4 h-4 rounded-full opacity-25"
              style={{ backgroundColor: "#ff6b6b" }}
              animate={{ y: [0, 15, 0], x: [0, 10, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
            <motion.div
              className="absolute top-1/3 left-1/4 w-3 h-3 rounded-full opacity-30"
              style={{ backgroundColor: "#ff6b6b" }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center p-8 bg-white rounded-3xl shadow-xl w-4/5 max-w-md border-2 hover:shadow-2xl transition-all duration-300"
              style={{ borderColor: "rgba(255, 107, 107, 0.1)" }}
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                {React.createElement(step.icon, {
                  className: "w-10 h-10",
                  style: { color: "#ff6b6b" },
                })}
                <h4 className="text-2xl font-bold text-gray-800">
                  {step.title}
                </h4>
              </div>
              <p className="text-gray-600 text-lg mb-6 font-medium">
                {step.description}
              </p>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="w-full h-48 rounded-2xl flex flex-col items-center justify-center text-gray-500 border-2 border-dashed cursor-pointer transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, #fbf5df 0%, rgba(255, 107, 107, 0.1) 100%)`,
                  borderColor: "rgba(255, 107, 107, 0.3)",
                }}
              >
                {React.createElement(step.icon, {
                  className: "w-12 h-12 mb-3",
                  style: { color: "rgba(255, 107, 107, 0.6)" },
                })}
                <p className="text-sm font-medium text-center px-4">
                  {step.placeholder}
                </p>
              </motion.div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
