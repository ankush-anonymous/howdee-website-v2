"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Camera, ArrowLeft, Loader2, Download, Video, Sparkles } from "lucide-react"
import Link from "next/link"

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content:
        "Hi! I'm Howdee AI 👋 Upload your photo and choose an occasion to create amazing personalized greetings!",
      timestamp: new Date(),
    },
  ])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)

  const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"

  const addMessage = (type, content, mediaType = null, mediaUrl = null) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type,
        content,
        timestamp: new Date(),
        mediaType,
        mediaUrl,
      },
    ])
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setImageFile(file)
      setImagePreview(url)
      addMessage("user", "I've uploaded an image", "image", url)
    }
  }

  const sendImageAndPromptToBackend = async (prompt) => {
    if (!imageFile) {
      addMessage("bot", "Please upload an image first 📸")
      return
    }
    setIsProcessing(true)

    try {
      const formData = new FormData()
      formData.append("prompt", prompt)
      formData.append("selfie", imageFile)

      const response = await fetch(`${BACKEND_API_URL}/api/v1/image/generate-image`, {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.generatedImage) {
          localStorage.setItem("generatedImage", result.generatedImage)
          localStorage.setItem("prompt", prompt)
          addMessage("bot", "Here's your generated image!", "fusion", result.generatedImage)
        } else {
          addMessage("bot", "Something went wrong while generating the image.")
        }
      } else {
        addMessage("bot", "Failed to generate image. Please try again.")
      }
    } catch (error) {
      console.error(error)
      addMessage("bot", "An error occurred while processing your request.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePromptClick = (prompt) => {
    addMessage("user", prompt)
    sendImageAndPromptToBackend(prompt)
  }

  const handleAnimateImage = async () => {
    const generatedImage = localStorage.getItem("generatedImage")
    const prompt = localStorage.getItem("prompt")
    if (!generatedImage) {
      addMessage("bot", "Please generate an image first.")
      return
    }

    setIsAnimating(true)
    addMessage("bot", "✨ Making your video...")

    try {
      const response = await fetch(`${BACKEND_API_URL}/api/v1/video/generate-professional-video`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: generatedImage, prompt }),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.videoUrl) {
          addMessage("bot", "🎬 Your animated video is ready!", "video", result.videoUrl)
        } else {
          addMessage("bot", "Something went wrong while animating the image.")
        }
      } else {
        addMessage("bot", "Failed to animate image.")
      }
    } catch (error) {
      console.error(error)
      addMessage("bot", "Error animating image.")
    } finally {
      setIsAnimating(false)
    }
  }

  const handleDownload = async (url, filename) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = objectUrl
      link.download = filename
      link.click()
      URL.revokeObjectURL(objectUrl)
    } catch {
      addMessage("bot", "Download failed.")
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#fbf5df", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <Link href="/">
          <Button
            variant="ghost"
            className="hover:bg-red-50 transition-colors duration-200 text-lg"
            style={{ color: "#ff6b6b" }}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
        </Link>

        <div className="flex items-center space-x-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
            style={{ backgroundColor: "#ff6b6b" }}
          >
            <img src="/logo2.png" alt="Howdee Logo" className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Howdee AI Studio</h1>
            <p className="text-sm text-gray-600">Create Amazing Greetings</p>
          </div>
        </div>

        <div className="w-32"></div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Welcome Message */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4" style={{ color: "#ff6b6b" }}>
            Create Your Perfect Greeting
          </h2>
          <p className="text-xl text-gray-700">Upload your photo and choose an occasion to get started</p>
        </div>

        {/* Image Upload Section */}
        <div className="mb-12">
          {imagePreview ? (
            <div className="flex justify-center mb-8">
              <div className="relative">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-48 h-48 object-cover rounded-2xl border-4 shadow-xl"
                  style={{ borderColor: "#ff6b6b" }}
                />
                <button
                  onClick={() => {
                    setImagePreview(null)
                    setImageFile(null)
                  }}
                  className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-lg hover:bg-red-600 shadow-lg"
                >
                  ×
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center mb-8">
              <div
                className="w-48 h-48 border-4 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-red-50 transition-all duration-300"
                style={{ borderColor: "#ff6b6b" }}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 mb-4" style={{ color: "#ff6b6b" }} />
                <p className="text-gray-600 text-center">
                  Click to upload
                  <br />
                  your photo
                </p>
              </div>
            </div>
          )}

          {/* Upload Buttons */}
          <div className="flex justify-center space-x-6">
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="px-8 py-4 bg-white border-3 font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              style={{ borderColor: "#ff6b6b", color: "#ff6b6b" }}
            >
              <Upload className="w-6 h-6 mr-3" />
              Upload from Device
            </Button>

            <Button
              onClick={() => cameraInputRef.current?.click()}
              className="px-8 py-4 bg-white border-3 font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              style={{ borderColor: "#ff6b6b", color: "#ff6b6b" }}
            >
              <Camera className="w-6 h-6 mr-3" />
              Take Photo
            </Button>
          </div>

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Occasion Selection */}
<div className="mb-12">
  <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">Choose Your Occasion</h3>
  <div className="flex justify-center space-x-8">
    <Button
      onClick={() => handlePromptClick("Happy Diwali")}
      disabled={!imageFile || isProcessing}
      className="group relative w-40 h-40 text-white font-bold text-xl rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden flex flex-col items-center justify-center"
      style={{ backgroundColor: "#ff6b6b" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10 text-center">
        <div className="text-5xl mb-3">🎆</div>
        <div className="text-lg">Happy Diwali</div>
      </div>
    </Button>

    <Button
      onClick={() => handlePromptClick("Happy Birthday")}
      disabled={!imageFile || isProcessing}
      className="group relative w-40 h-40 text-white font-bold text-xl rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden flex flex-col items-center justify-center"
      style={{ backgroundColor: "#ff6b6b" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10 text-center">
        <div className="text-5xl mb-3">🎂</div>
        <div className="text-lg">Happy Birthday</div>
      </div>
    </Button>
    <Button
      onClick={() => handlePromptClick("Happy Independence Day")}
      disabled={!imageFile || isProcessing}
      className="group relative w-40 h-40 text-white font-bold text-xl rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden flex flex-col items-center justify-center"
      style={{ backgroundColor: "#ff6b6b" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10 text-center">
        <div className="text-5xl mb-3">🎂</div>
        <div className="text-lg">Happy <br/> Independence</div>
      </div>
    </Button>
  </div>
</div>


        {/* Processing Indicators */}
        {isProcessing && (
          <div className="flex justify-center mb-8">
            <div
              className="bg-white px-8 py-4 rounded-2xl shadow-lg border-2"
              style={{ borderColor: "rgba(255, 107, 107, 0.2)" }}
            >
              <div className="flex items-center space-x-4">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#ff6b6b" }} />
                <span className="text-lg font-semibold text-gray-700">Creating your image...</span>
              </div>
            </div>
          </div>
        )}

        {isAnimating && (
          <div className="flex justify-center mb-8">
            <div
              className="bg-white px-8 py-4 rounded-2xl shadow-lg border-2"
              style={{ borderColor: "rgba(255, 107, 107, 0.2)" }}
            >
              <div className="flex items-center space-x-4">
                <Video className="w-8 h-8 animate-pulse" style={{ color: "#ff6b6b" }} />
                <span className="text-lg font-semibold text-gray-700">Adding animation magic...</span>
              </div>
            </div>
          </div>
        )}

        {/* Results Display */}
        <div className="space-y-6">
          {messages.slice(1).map((message) => (
            <div key={message.id} className="flex justify-center">
              <div className="max-w-md w-full">
                {message.mediaType === "image" && (
                  <div
                    className="bg-white rounded-2xl p-6 shadow-lg border-2"
                    style={{ borderColor: "rgba(255, 107, 107, 0.1)" }}
                  >
                    <img
                      src={message.mediaUrl || "/placeholder.svg"}
                      alt="Uploaded"
                      className="w-full h-64 object-cover rounded-xl mb-4"
                    />
                    <p className="text-center text-gray-700 font-medium">{message.content}</p>
                  </div>
                )}

                {message.mediaType === "fusion" && (
                  <div
                    className="bg-white rounded-2xl p-6 shadow-lg border-2"
                    style={{ borderColor: "rgba(255, 107, 107, 0.1)" }}
                  >
                    <img
                      src={message.mediaUrl || "/placeholder.svg"}
                      alt="Generated"
                      className="w-full h-64 object-cover rounded-xl mb-4"
                    />
                    <p className="text-center text-gray-700 font-medium mb-4">{message.content}</p>
                    <div className="flex space-x-3">
                      <Button
                        onClick={() => handleDownload(message.mediaUrl, `howdee-ai-image-${Date.now()}.png`)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Download Image
                      </Button>
                      <Button
                        onClick={handleAnimateImage}
                        disabled={isAnimating}
                        className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-xl disabled:opacity-50"
                      >
                        <Video className="w-5 h-5 mr-2" />
                        Create Video
                      </Button>
                    </div>
                  </div>
                )}

                {message.mediaType === "video" && (
                  <div
                    className="bg-white rounded-2xl p-6 shadow-lg border-2"
                    style={{ borderColor: "rgba(255, 107, 107, 0.1)" }}
                  >
                    <video src={message.mediaUrl} controls className="w-full h-64 object-cover rounded-xl mb-4" />
                    <p className="text-center text-gray-700 font-medium mb-4">{message.content}</p>
                    <Button
                      onClick={() => handleDownload(message.mediaUrl, "animated-video.mp4")}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download Video
                    </Button>
                  </div>
                )}

                {!message.mediaType && message.type === "bot" && (
                  <div
                    className="bg-white rounded-2xl p-6 shadow-lg border-2 text-center"
                    style={{ borderColor: "rgba(255, 107, 107, 0.1)" }}
                  >
                    <p className="text-gray-700 font-medium">{message.content}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-20 left-20 w-4 h-4 rounded-full opacity-20 animate-float"
          style={{ backgroundColor: "#ff6b6b" }}
        />
        <div
          className="absolute bottom-32 right-32 w-6 h-6 rounded-full opacity-15 animate-pulse"
          style={{ backgroundColor: "#ff6b6b" }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full opacity-25 animate-bounce"
          style={{ backgroundColor: "#ff6b6b" }}
        />
      </div>
    </div>
  )
}
