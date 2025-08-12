import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { Analytics } from "@vercel/analytics/next"


export const metadata: Metadata = {
  title: "Howdee – AI Greetings, Wishes & Creative Generation",
  description:
    "Create stunning personalized greetings, wishes, images, and videos with Howdee. AI-powered tools to make birthdays, festivals, and special moments unforgettable. Wish better with Howdee!",
  keywords: [
    "Howdee",
    "AI greetings",
    "AI wishes",
    "personalized wishes",
    "AI image generation",
    "AI video generation",
    "custom greetings",
    "digital wishes",
    "birthday wishes",
    "festival greetings",
    "wish better",
    "AI creative platform",
    "photo to greeting",
    "video greetings",
    "wish generator",
    "Howdee app",
  ],
  openGraph: {
    title: "Howdee – AI Greetings, Wishes & Creative Generation",
    description:
      "Wish better with Howdee! Generate personalized AI-powered images, videos, and greetings for birthdays, festivals, and special moments.",
    url: "https://howdee.in",
    siteName: "Howdee",
    images: [
      {
        url: "https://res.cloudinary.com/dqiqtx7er/image/upload/v1754995355/logo2_kyvkst.png", // Replace with your OG image
        width: 1200,
        height: 630,
        alt: "Howdee – AI Greetings and Wishes",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Howdee – AI Greetings, Wishes & Creative Generation",
    description:
      "AI-powered greetings and wishes for every occasion. Create stunning personalized images and videos with Howdee. Wish better!",
    images: ["https://res.cloudinary.com/dqiqtx7er/image/upload/v1754995355/logo2_kyvkst.png"], 
    creator: "@howdee.app", 
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
       
      </head>
      <body>
        <Analytics/>
        {children}</body>
    </html>
  )
}
