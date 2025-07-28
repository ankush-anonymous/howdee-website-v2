import React, { useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";

const greetingVideos = [
  {
    id: 1,
    video:
      "https://res.cloudinary.com/dqiqtx7er/video/upload/v1753731143/sample-vid-1_zdd469.mp4",
    alt: "Birthday Greeting Video",
  },
  {
    id: 2,
    video:
      "https://res.cloudinary.com/dqiqtx7er/video/upload/v1753731154/sample-vid-2_fnnihc.mp4",
    alt: "Anniversary Greeting Video",
  },
  {
    id: 3,
    video:
      "https://res.cloudinary.com/dqiqtx7er/video/upload/v1753731149/dbc4208f-4f17-48d6-bc90-64261b484710_watermark_wdq90r.mp4",
    alt: "Holiday Greeting Video",
  },
];

export default function WishWithLove() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardsRef = useRef(null);
  const buttonRef = useRef(null);

  return (
    <section
      ref={sectionRef}
      className="py-20 px-8 relative h-max"
      style={{
        backgroundColor: "#ff6b6b",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div className="max-w-6xl mx-auto text-center">
        {/* Title */}
        <h2 ref={titleRef} className="text-5xl font-bold mb-6 text-white">
          Wish with Love
        </h2>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-xl text-pink-100 mb-16 max-w-2xl mx-auto"
        >
          Make stunning AI greetings with just one voice command
        </p>

        {/* Videos Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {greetingVideos.map((item, index) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-105"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
                border: "2px solid rgba(255, 255, 255, 0.2)",
                animation: `float${index + 1} 3s ease-in-out infinite`,
                height: "530px", // set a fixed height for all cards
              }}
            >
              {/* Video Wrapper */}
              <div className="overflow-hidden relative w-full h-full">
                <div className="absolute top-[20px] bottom-[20px] left-0 right-0 overflow-hidden">
                  <video
                    src={item.video}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    autoPlay
                    loop
                    muted
                    playsInline
                    onError={(e) => {
                      console.log(`Error loading video: ${item.video}`);
                    }}
                  />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Sparkles */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Sparkles className="w-6 h-6 text-white drop-shadow-lg animate-pulse" />
                </div>

                {/* Play Pulse */}
                <div className="absolute top-4 left-4 bg-black/20 backdrop-blur-sm rounded-full p-2 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                </div>

                {/* Glow effect */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none"
                  style={{
                    boxShadow: `0 0 30px rgba(255, 255, 255, 0.5)`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Generate Button */}
        <div ref={buttonRef}>
          <button
            className="group bg-white font-semibold px-12 py-4 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden"
            style={{ color: "#ff6b6b" }}
          >
            {/* Hover background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-50 to-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <span className="relative z-10 flex items-center">
              Generate for Free
              <Sparkles
                className="w-5 h-5 ml-3 group-hover:animate-spin transition-transform duration-300"
                style={{ color: "#ff6b6b" }}
              />
            </span>
          </button>
        </div>

        {/* Decorative elements */}
        <div className="absolute left-10 top-1/2 w-4 h-4 rounded-full bg-white opacity-20 animate-pulse" />
        <div
          className="absolute right-10 top-1/3 w-3 h-3 rounded-full bg-white opacity-30 animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute left-1/4 bottom-10 w-2 h-2 rounded-full bg-white opacity-25 animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Floating animations */}
      <style jsx>{`
        @keyframes float1 {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-10px) rotate(1deg);
          }
          66% {
            transform: translateY(-5px) rotate(-1deg);
          }
        }

        @keyframes float2 {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-8px) rotate(-1deg);
          }
          66% {
            transform: translateY(-12px) rotate(1deg);
          }
        }

        @keyframes float3 {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-6px) rotate(1deg);
          }
          66% {
            transform: translateY(-10px) rotate(-1deg);
          }
        }
      `}</style>
    </section>
  );
}
