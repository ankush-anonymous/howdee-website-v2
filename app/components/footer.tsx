"use client"

import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer
      className="py-16 px-4 md:px-8 relative overflow-hidden"
      style={{ backgroundColor: "#ff6b6b", fontFamily: "Arial, sans-serif" }}
    >
      {/* Subtle background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 bg-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white rounded-full"></div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-10 right-10 w-3 h-3 bg-white rounded-full opacity-20 animate-float" />
      <div className="absolute bottom-20 left-10 w-4 h-4 bg-white rounded-full opacity-15 animate-pulse" />
      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-white rounded-full opacity-25 animate-bounce" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* About Howdee */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold" style={{ color: "#ff6b6b" }}>
                  H
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white">Howdee</h3>
            </div>
            <h4 className="text-xl font-semibold text-white mb-4">About Howdee</h4>
            <p className="text-pink-100 leading-relaxed max-w-md">
              Howdee is India's most fun and fast way to make AI-powered greetings combining art, image, audio, and
              motion with personal touch.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold text-white mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="#home"
                  className="text-pink-100 hover:text-white transition-colors duration-300 hover:underline"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-pink-100 hover:text-white transition-colors duration-300 hover:underline"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-pink-100 hover:text-white transition-colors duration-300 hover:underline"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-pink-300/30 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Social Media */}
            <div className="flex items-center space-x-6">
              <span className="text-white font-semibold">Follow Us:</span>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110"
                >
                  <Instagram className="w-5 h-5 text-white" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110"
                >
                  <Facebook className="w-5 h-5 text-white" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110"
                >
                  <Linkedin className="w-5 h-5 text-white" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110"
                >
                  <Twitter className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-pink-100 text-sm">© 2024 Howdee. All rights reserved. Made with ❤️ in India.</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
