"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const greetingCards = [
  {
    id: 1,
    image: "/placeholder.svg?height=300&width=400",
    alt: "Birthday Greeting Card",
  },
  {
    id: 2,
    image: "/placeholder.svg?height=300&width=400",
    alt: "Anniversary Greeting Card",
  },
  {
    id: 3,
    image: "/placeholder.svg?height=300&width=400",
    alt: "Holiday Greeting Card",
  },
]

export default function WishWithLove() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        },
      )

      // Subtitle animation
      gsap.fromTo(
        subtitleRef.current,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: subtitleRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        },
      )

      // Cards animation
      const cards = cardsRef.current?.children
      if (cards) {
        gsap.fromTo(
          cards,
          {
            opacity: 0,
            y: 60,
            scale: 0.8,
            rotationY: 15,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationY: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
            },
          },
        )

        // Hover animations for cards
        Array.from(cards).forEach((card) => {
          const cardElement = card as HTMLElement

          cardElement.addEventListener("mouseenter", () => {
            gsap.to(cardElement, {
              scale: 1.05,
              rotationY: -5,
              z: 50,
              duration: 0.3,
              ease: "power2.out",
            })
          })

          cardElement.addEventListener("mouseleave", () => {
            gsap.to(cardElement, {
              scale: 1,
              rotationY: 0,
              z: 0,
              duration: 0.3,
              ease: "power2.out",
            })
          })
        })
      }

      // Button animation
      gsap.fromTo(
        buttonRef.current,
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: buttonRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        },
      )

      // Floating animation for cards
      if (cards) {
        Array.from(cards).forEach((card, index) => {
          gsap.to(card, {
            y: "+=10",
            duration: 2 + index * 0.5,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut",
            delay: index * 0.3,
          })
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-20 px-8"
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
        <p ref={subtitleRef} className="text-xl text-pink-100 mb-16 max-w-2xl mx-auto">
          Make stunning AI greetings with just one voice command
        </p>

        {/* Cards Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {greetingCards.map((card) => (
            <div
              key={card.id}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
                border: "2px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={card.image || "/placeholder.svg"}
                  alt={card.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Overlay effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Sparkle effect */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Sparkles className="w-6 h-6 text-white drop-shadow-lg animate-pulse" />
              </div>

              {/* Glow effect */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none"
                style={{
                  boxShadow: `0 0 30px rgba(255, 255, 255, 0.5)`,
                }}
              />
            </div>
          ))}
        </div>

        {/* Generate Button */}
        <div ref={buttonRef}>
          <Button
            size="lg"
            className="bg-white font-semibold px-12 py-4 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
            style={{ color: "#ff6b6b" }}
          >
            Generate for Free
            <Sparkles
              className="w-5 h-5 ml-3 group-hover:animate-spin transition-transform duration-300"
              style={{ color: "#ff6b6b" }}
            />
          </Button>
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
    </section>
  )
}
