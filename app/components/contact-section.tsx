"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send, Calendar, Phone, Mail, User, MessageCircle, Sparkles } from "lucide-react"

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
  }

  return (
    <section
      className="py-20 px-4 md:px-8 relative overflow-hidden"
      style={{ backgroundColor: "#fbf5df", fontFamily: "Arial, sans-serif" }}
    >
      {/* Subtle background decorations */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full" style={{ backgroundColor: "#ff6b6b" }}></div>
        <div
          className="absolute bottom-32 right-32 w-24 h-24 rounded-full"
          style={{ backgroundColor: "#ff6b6b" }}
        ></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full" style={{ backgroundColor: "#ff6b6b" }}></div>
      </div>

      {/* Floating elements */}
      <div
        className="absolute top-10 right-10 w-3 h-3 rounded-full opacity-20 animate-float"
        style={{ backgroundColor: "#ff6b6b" }}
      />
      <div
        className="absolute bottom-20 left-10 w-4 h-4 rounded-full opacity-15 animate-pulse"
        style={{ backgroundColor: "#ff6b6b" }}
      />
      <div
        className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full opacity-25 animate-bounce"
        style={{ backgroundColor: "#ff6b6b" }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight" style={{ color: "#ff6b6b" }}>
            Have Questions or Ideas? Let's Talk.
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Whether you're a curious user or a business partner, we'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left side - Contact Form */}
          <div className="relative">
            <div
              className="bg-white rounded-3xl p-8 shadow-lg border-2 hover:shadow-xl transition-all duration-300"
              style={{ borderColor: "rgba(255, 107, 107, 0.1)" }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div className="relative">
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" style={{ color: "#ff6b6b" }} />
                    Full Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300"
                    style={{
                      borderColor: "rgba(255, 107, 107, 0.2)",
                      focusRingColor: "#ff6b6b",
                    }}
                    required
                  />
                </div>

                {/* Email Field */}
                <div className="relative">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" style={{ color: "#ff6b6b" }} />
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300"
                    style={{
                      borderColor: "rgba(255, 107, 107, 0.2)",
                      focusRingColor: "#ff6b6b",
                    }}
                    required
                  />
                </div>

                {/* Phone Field */}
                <div className="relative">
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" style={{ color: "#ff6b6b" }} />
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300"
                    style={{
                      borderColor: "rgba(255, 107, 107, 0.2)",
                      focusRingColor: "#ff6b6b",
                    }}
                  />
                </div>

                {/* Message Field */}
                <div className="relative">
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    <MessageCircle className="w-4 h-4 inline mr-2" style={{ color: "#ff6b6b" }} />
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us about your ideas or questions..."
                    rows={5}
                    className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 resize-none"
                    style={{
                      borderColor: "rgba(255, 107, 107, 0.2)",
                      focusRingColor: "#ff6b6b",
                    }}
                    required
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                  style={{ backgroundColor: "#ff6b6b" }}
                >
                  <Send className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform duration-300" />
                  Send Message
                  <Sparkles className="w-4 h-4 ml-3 group-hover:animate-spin transition-transform duration-300" />
                </Button>
              </form>
            </div>
          </div>

          {/* Right side - Additional Info & CTA */}
          <div className="space-y-8">
            {/* Quick Contact Info */}
            <div
              className="bg-white rounded-3xl p-8 shadow-lg border-2"
              style={{ borderColor: "rgba(255, 107, 107, 0.1)" }}
            >
              <h3 className="text-2xl font-bold mb-6" style={{ color: "#ff6b6b" }}>
                Get in Touch
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "rgba(255, 107, 107, 0.1)" }}
                  >
                    <Mail className="w-6 h-6" style={{ color: "#ff6b6b" }} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Email Us</p>
                    <p className="text-gray-600">hello@howdee.ai</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "rgba(255, 107, 107, 0.1)" }}
                  >
                    <Phone className="w-6 h-6" style={{ color: "#ff6b6b" }} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Call Us</p>
                    <p className="text-gray-600">+91 98765 43210</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule Demo CTA */}
            <div
              className="bg-gradient-to-br from-red-50 to-pink-50 rounded-3xl p-8 border-2"
              style={{ borderColor: "rgba(255, 107, 107, 0.1)" }}
            >
              <h3 className="text-2xl font-bold mb-4" style={{ color: "#ff6b6b" }}>
                Want a Live Demo?
              </h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                See Howdee in action! Schedule a personalized demo and discover how our AI can transform your creative
                workflow.
              </p>
              <Button
                className="w-full text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                style={{ backgroundColor: "#ff6b6b" }}
              >
                <Calendar className="w-5 h-5 mr-3 group-hover:bounce transition-transform duration-300" />
                Schedule a Demo
                <Sparkles className="w-4 h-4 ml-3 group-hover:animate-pulse transition-transform duration-300" />
              </Button>
            </div>

            {/* Fun Stats */}
            <div
              className="bg-white rounded-3xl p-8 shadow-lg border-2"
              style={{ borderColor: "rgba(255, 107, 107, 0.1)" }}
            >
              <h3 className="text-xl font-bold mb-6" style={{ color: "#ff6b6b" }}>
                Why Choose Howdee?
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: "#ff6b6b" }}>
                    24/7
                  </div>
                  <div className="text-sm text-gray-600">Support</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: "#ff6b6b" }}>
                    99.9%
                  </div>
                  <div className="text-sm text-gray-600">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: "#ff6b6b" }}>
                    24h
                  </div>
                  <div className="text-sm text-gray-600">Response</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: "#ff6b6b" }}>
                    100%
                  </div>
                  <div className="text-sm text-gray-600">Secure</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
