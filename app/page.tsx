"use client"

import { Button } from "@/components/ui/button"
import WishWithLove from "./components/wish-with-love"
import PersonalizedCreativeFlow from "./components/creative-flow"
import HeroSection from "./components/hero-section"
import TestimonialsSection from "./components/testimonials"
import ContactSection from "./components/contact-section"
import Footer from "./components/footer"
import Link from "next/link"


export default function HomePage() {
  return (
    <div className="min-h-screen font-arial" style={{ backgroundColor: "#fbf5df", fontFamily: "Arial, sans-serif" }}>
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 relative z-10">
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
            style={{ backgroundColor: "#ff6b6b" }}
          >
            <img src="/logo2.png" alt="Logo" className="w-8 h-8" />
          </div>
          <span className="text-2xl font-bold text-gray-800">Howdee</span>
        </div>
        <Link href="/chat">
        <Button
          variant="outline"
          className="border-2 hover:bg-opacity-10 transition-all duration-300 font-semibold px-6 bg-transparent"
          style={{
            borderColor: "#ff6b6b",
            color: "#ff6b6b",
          }}
        >
          Try Now
        </Button>
        <Button
          variant="outline"
          className="border-2 hover:bg-opacity-10 transition-all duration-300 font-semibold px-6 bg-transparent ml-2"
          style={{
            borderColor: "#ff6b6b",
            color: "#ff6b6b",
          }}
        >
         Login
        </Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <HeroSection />

      {/* Wish with Love Section */}
      <WishWithLove />

      {/* Creative Flow Section */}
      <PersonalizedCreativeFlow />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer />

      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-20 left-20 w-2 h-2 rounded-full opacity-30 animate-float"
          style={{ backgroundColor: "#ff6b6b" }}
        />
        <div
          className="absolute top-40 right-40 w-3 h-3 rounded-full opacity-20 animate-float"
          style={{ backgroundColor: "#ff6b6b", animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-40 left-40 w-1 h-1 rounded-full opacity-40 animate-float"
          style={{ backgroundColor: "#ff6b6b", animationDelay: "4s" }}
        />
        <div
          className="absolute bottom-20 right-20 w-2 h-2 rounded-full opacity-25 animate-float"
          style={{ backgroundColor: "#ff6b6b", animationDelay: "6s" }}
        />
      </div>
    </div>
  )
}
