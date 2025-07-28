"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Camera, Video, Film, Palette, Target, Sparkles } from "lucide-react"
import FloatingElement from "./floating-animation"

const HeroSection = () => {
  const languages = [
    { text: "Howdee", lang: "English" },
    { text: "हाउडी", lang: "Hindi" },
    { text: "ஹவுடி", lang: "Tamil" },
    { text: "హౌడీ", lang: "Telugu" },
    { text: "হাউডি", lang: "Bengali" },
    { text: "હાઉડી", lang: "Gujarati" },
    { text: "हाउडी", lang: "Marathi" },
  ]

  const services = [
    { name: "Photographer", icon: Camera },
    { name: "Videographer", icon: Video },
    { name: "Cinematographer", icon: Film },
    { name: "Graphic Designer", icon: Palette },
    { name: "Strategist", icon: Target },
  ]

  const [currentLanguage, setCurrentLanguage] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    const currentLangText = languages[currentLanguage].text

    if (isTyping) {
      if (displayText.length < currentLangText.length) {
        const timeout = setTimeout(() => {
          setDisplayText(currentLangText.slice(0, displayText.length + 1))
        }, 150)
        return () => clearTimeout(timeout)
      } else {
        const timeout = setTimeout(() => {
          setIsTyping(false)
        }, 2000)
        return () => clearTimeout(timeout)
      }
    } else {
      if (displayText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1))
        }, 100)
        return () => clearTimeout(timeout)
      } else {
        setCurrentLanguage((prev) => (prev + 1) % languages.length)
        setIsTyping(true)
      }
    }
  }, [displayText, isTyping, currentLanguage])

  return (
    <div className="min-h-[calc(100vh-100px)] px-8 flex items-center">
      {/* Left Column */}
      <div className="w-1/2 flex flex-col justify-start pt-12 space-y-6">
        {/* Typewriter */}
        <div>
          <h1 className="text-7xl font-bold" style={{ color: "#ff6b6b" }}>
            {displayText}
            <span className="animate-pulse">|</span>
          </h1>
        </div>

        {/* Tagline */}
        <p className="text-sm text-gray-600 font-medium">Your personal Marketing and branding agency</p>

        {/* Services */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-gray-600 mb-1">AI-Powered Services</h3>
          <div className="grid grid-cols-2 gap-2">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <Button
                  key={service.name}
                  variant="outline"
                  className="group relative overflow-hidden border text-left justify-start space-x-1 h-8 text-xs hover:scale-105 transition-all bg-transparent"
                  style={{
                    borderColor: "#ff6b6b",
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent group-hover:from-red-50 group-hover:to-pink-50 transition-all duration-500" />
                  <Icon className="w-3 h-3 relative z-10" style={{ color: "#ff6b6b" }} />
                  <span className="relative z-10 text-gray-700 group-hover:text-gray-800">{service.name}</span>
                  <Sparkles
                    className="w-2 h-2 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ color: "#ff6b6b" }}
                  />
                </Button>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="pt-2">
          <Button
            size="sm"
            className="text-white font-medium px-4 py-2 text-sm rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: "#ff6b6b" }}
          >
            Get Started with AI
            <Sparkles className="w-3 h-3 ml-2" />
          </Button>
        </div>
      </div>

     <FloatingElement/>
    </div>
  )
}

export default HeroSection
