"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Quote, Star } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    name: "Meera N.",
    location: "Mumbai",
    content: "I just uploaded my selfie and voice and Howdee made an amazing Diwali greeting with it. Mind blown!",
    rating: 5,
    avatar: "/placeholder.svg?height=50&width=50&text=MN",
    position: "top-0 left-0",
  },
  {
    name: "Ravi S.",
    location: "Bengaluru",
    content:
      "It was my friend's birthday. I made a custom greeting with her photo and shared it on WhatsApp in minutes.",
    rating: 5,
    avatar: "/placeholder.svg?height=50&width=50&text=RS",
    position: "top-20 right-0",
  },
  {
    name: "Tanya P.",
    location: "Delhi",
    content: "The personalization level is insane. It looks like I spent hours editing, but it took me 3 minutes!",
    rating: 5,
    avatar: "/placeholder.svg?height=50&width=50&text=TP",
    position: "bottom-0 left-10",
  },
]

export default function TestimonialsSection() {
  return (
    <section
      className="py-20 relative overflow-hidden min-h-screen bg-no-repeat bg-cover bg-center"
      style={{
        backgroundColor: "#ff6b6b",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Background overlay with Howdee theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/30 via-pink-600/20 to-orange-600/30 z-0" />

      {/* Background pattern with white circles */}
      <div className="absolute inset-0 opacity-10 hidden lg:block">
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-white rounded-full"></div>
        <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-white rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/6 w-28 h-28 bg-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white rounded-full"></div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-10 left-10 w-4 h-4 bg-white rounded-full opacity-20 animate-float" />
      <div className="absolute bottom-20 right-20 w-6 h-6 bg-white rounded-full opacity-15 animate-pulse" />
      <div className="absolute top-1/3 left-1/3 w-3 h-3 bg-white rounded-full opacity-25 animate-bounce" />

      <div className="container mx-auto px-4 relative lg:px-32 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px]">
          {/* Left side - Testimonial cards */}
          <div className="relative">
            {/* Mobile: Stack testimonials vertically */}
            <div className="lg:hidden space-y-6">
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-2 hover:scale-105"
                  style={{ borderColor: "rgba(255, 255, 255, 0.3)" }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                        <Quote className="w-5 h-5" style={{ color: "#ff6b6b" }} />
                      </div>
                      <Image
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        width={50}
                        height={50}
                        className="rounded-full border-2 border-white shadow-lg"
                      />
                    </div>
                    {/* Star Rating */}
                    <div className="flex items-center mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                      ))}
                    </div>
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 text-lg">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500 mb-1">{testimonial.location}</p>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{testimonial.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Desktop: Floating testimonial cards */}
            <div className="hidden lg:block relative h-96 lg:h-[550px]">
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  className={`absolute w-72 bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-2 hover:scale-105 ${testimonial.position}`}
                  style={{ borderColor: "rgba(255, 255, 255, 0.3)" }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                        <Quote className="w-5 h-5" style={{ color: "#ff6b6b" }} />
                      </div>
                      <Image
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        width={50}
                        height={50}
                        className="rounded-full border-2 border-white shadow-lg"
                      />
                    </div>
                    {/* Star Rating */}
                    <div className="flex items-center mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                      ))}
                    </div>
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 text-lg">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500 mb-1">{testimonial.location}</p>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{testimonial.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right side - Content */}
          <div className="text-white lg:pl-12 text-center lg:text-left">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 lg:mb-8 leading-tight text-white">
              India Wishes<br />
              with Howdee
            </h2>
            <p className="text-lg text-pink-100 mb-8 leading-relaxed max-w-md mx-auto lg:mx-0">
              Hear from our amazing users who have created stunning personalized greetings with Howdee's AI magic.
            </p>

            {/* Stats - Howdee themed */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="text-center lg:text-left">
                <div className="text-2xl lg:text-3xl font-bold text-white">10K+</div>
                <div className="text-sm text-pink-100">Happy Users</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl lg:text-3xl font-bold text-white">50K+</div>
                <div className="text-sm text-pink-100">Greetings Created</div>
              </div>
            </div>

            {/* Additional stats row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center lg:text-left">
                <div className="text-2xl lg:text-3xl font-bold text-white">4.9★</div>
                <div className="text-sm text-pink-100">User Rating</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl lg:text-3xl font-bold text-white">3min</div>
                <div className="text-sm text-pink-100">Avg Creation Time</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
