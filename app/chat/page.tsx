"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Camera, Upload, ArrowLeft, Play, Download, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  mediaType?: "text" | "image" | "audio" | "fusion";
  mediaUrl?: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content:
        "Hi there! 👋 I'm Howdee, your AI creative assistant. To create amazing personalized greetings, I need two things:\n\n1️⃣ Upload your selfie photo 📸\n2️⃣ Tell me what you want (voice or text) 🎤\n\nOnce I have both, I'll create a magical fusion image for you!",
      timestamp: new Date(),
      mediaType: "text",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isCreatingFusion, setIsCreatingFusion] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [currentAudioBlob, setCurrentAudioBlob] = useState<Blob | null>(null);
  const [uploadedSelfie, setUploadedSelfie] = useState<File | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [hasVoiceOrText, setHasVoiceOrText] = useState(false);
  const [userTextInput, setUserTextInput] = useState<string>("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isRecording && recordingInterval.current === null) {
      recordingInterval.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else if (!isRecording && recordingInterval.current) {
      clearInterval(recordingInterval.current);
      recordingInterval.current = null;
      setRecordingTime(0);
    }

    return () => {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const sendMessage = (content: string, mediaType: "text" | "image" | "audio" | "fusion" = "text", mediaUrl?: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
      mediaType,
      mediaUrl,
    };

    setMessages((prev) => [...prev, newMessage]);

    // Bot response based on current state
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: getBotResponse(mediaType),
        timestamp: new Date(),
        mediaType: "text",
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);

    setInputText("");
  };

  const getBotResponse = (mediaType: string) => {
    if (mediaType === "image") {
      if (!hasVoiceOrText) {
        return "Perfect! ✨ I got your selfie. Now tell me what kind of greeting you want to create - use voice 🎤 or type your message! 💬";
      } else {
        return "Great! I have both your selfie and your request. Ready to create something amazing! 🎨";
      }
    }
    
    if (mediaType === "audio" || mediaType === "text") {
      if (!uploadedSelfie) {
        return "Awesome request! 🎯 Now I need your selfie photo to create the perfect fusion. Upload or take a photo! 📸";
      } else {
        return "Perfect! I have everything I need. Ready to create your personalized greeting! ✨";
      }
    }

    if (mediaType === "fusion") {
      return "🎉 Amazing! Your personalized greeting is ready! You can download it and share it with everyone. Want to create another one? Just upload a new selfie or give me a new prompt!";
    }

    return "I'm here to help you create something amazing! Upload your selfie and tell me what you want. 🌟";
  };


const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);

    // Create a temporary array to collect chunks
    const chunks: Blob[] = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
        console.log("Audio chunk received:", event.data.size, "bytes");
      }
    };

    recorder.onstop = () => {
      console.log("Recording stopped. Total chunks:", chunks.length);
      
      if (chunks.length > 0) {
        const audioBlob = new Blob(chunks, { type: "audio/wav" });
        console.log("Audio blob created:", audioBlob, "Size:", audioBlob.size, "bytes");
        
        setCurrentAudioBlob(audioBlob);
        
        const audioUrl = URL.createObjectURL(audioBlob);
        sendMessage("Voice message recorded", "audio", audioUrl);
        setHasVoiceOrText(true);
        
        // Auto-create fusion if we have both selfie and audio
        if (uploadedSelfie) {
          console.log("Both selfie and audio available, creating fusion...");
          setTimeout(() => createFusionImage(), 2000); // No parameter needed for audio
        }
      } else {
        console.error("No audio chunks collected!");
        alert("Recording failed - no audio data captured. Please try again.");
      }
      
      stream.getTracks().forEach((track) => track.stop());
    };

    recorder.start();
    setMediaRecorder(recorder);
    setIsRecording(true);
    console.log("Recording started...");
    
  } catch (error) {
    console.error("Error accessing microphone:", error);
    alert("Could not access microphone. Please check permissions.");
  }
};


const handleSendText = () => {
  if (inputText.trim()) {
    const textInput = inputText.trim(); // Store in local variable
    
    setUserTextInput(textInput); // This won't update immediately due to React batching
    sendMessage(textInput, "text");
    setHasVoiceOrText(true);
    
    console.log("Text input set:", textInput);
    
    // Auto-create fusion if we have both selfie and text
    if (uploadedSelfie) {
      // Pass the text directly as parameter to avoid state timing issues
      setTimeout(() => {
        console.log("About to create fusion with text:", textInput);
        createFusionImage(textInput); // Pass text as parameter
      }, 2000);
    }
    
    // Clear input field AFTER we've used the value
    setInputText("");
  }
};

const createFusionImage = async (textPrompt?: string) => {
  console.log("=== Creating fusion image ===");
  console.log("Uploaded selfie:", uploadedSelfie);
  console.log("Current audio blob:", currentAudioBlob);
  console.log("Text prompt parameter:", textPrompt);
  console.log("User text input state:", userTextInput);
  console.log("Has voice or text:", hasVoiceOrText);

  if (!uploadedSelfie) {
    alert("Please upload a selfie first!");
    return;
  }

  // More detailed check for audio/text
  const hasAudio = currentAudioBlob && currentAudioBlob.size > 0;
  // Use parameter first, then fall back to state
  const finalTextPrompt = textPrompt || userTextInput;
  const hasText = finalTextPrompt && finalTextPrompt.trim().length > 0;
  
  console.log("Has audio:", hasAudio, "Audio size:", currentAudioBlob?.size);
  console.log("Has text:", hasText, "Final text content:", finalTextPrompt);

  if (!hasAudio && !hasText) {
    console.error("No valid audio or text input found!");
    console.log("Current states - textPrompt param:", textPrompt, "userTextInput:", userTextInput, "currentAudioBlob:", currentAudioBlob);
    alert("Please provide voice input or text message first!");
    return;
  }

  setIsCreatingFusion(true);

  try {
    // Get server URL from environment or use default
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
    
    // Create FormData to send multipart/form-data
    const formData = new FormData();
    
    // Add selfie file
    formData.append('selfie', uploadedSelfie);
    
    // Add audio file OR text prompt
    if (hasAudio) {
      console.log("Adding audio file to form data...");
      const audioFile = new File([currentAudioBlob!], 'voice_message.wav', {
        type: 'audio/wav'
      });
      formData.append('audio', audioFile);
      console.log("Audio file added:", audioFile.size, "bytes");
    } else if (hasText) {
      console.log("Adding text prompt to form data:", finalTextPrompt);
      formData.append('prompt', finalTextPrompt.trim());
    }

    console.log("Sending request to:", `${serverUrl}/create_fusion`);
    
    // Log FormData contents for debugging
    for (let [key, value] of formData.entries()) {
      console.log(`FormData - ${key}:`, value);
    }

    // Send request to Flask backend
    const response = await fetch(`${serverUrl}/create_fusion`, {
      method: 'POST',
      body: formData,
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    // Get the image blob from response
    const imageBlob = await response.blob();
    const imageUrl = URL.createObjectURL(imageBlob);

    console.log("Fusion image created successfully");

    // Add fusion image message
    const fusionMessage: Message = {
      id: Date.now().toString(),
      type: "bot",
      content: "Here's your personalized greeting! 🎉✨",
      timestamp: new Date(),
      mediaType: "fusion",
      mediaUrl: imageUrl,
    };

    setMessages((prev) => [...prev, fusionMessage]);

    // Reset states
    setCurrentAudioBlob(null);
    setHasVoiceOrText(false);
    setUserTextInput("");
    setInputText("");

  } catch (error) {
    console.error('Error creating fusion:', error);
    
    let errorMessage = 'Failed to create fusion image. ';
    if (error instanceof Error) {
      errorMessage += error.message;
    } else {
      errorMessage += 'Please check your connection and try again!';
    }
    
    alert(errorMessage);
    
    const errorMsg: Message = {
      id: Date.now().toString(),
      type: "bot",
      content: `❌ Sorry, there was an error creating your fusion: ${errorMessage}`,
      timestamp: new Date(),
      mediaType: "text",
    };
    setMessages((prev) => [...prev, errorMsg]);
    
  } finally {
    setIsCreatingFusion(false);
  }
};

// Alternative approach - you can also modify createFusionImage to accept parameters:

const createFusionImageWithParams = async (textPrompt?: string) => {
  console.log("=== Creating fusion image with params ===");
  console.log("Uploaded selfie:", uploadedSelfie);
  console.log("Current audio blob:", currentAudioBlob);
  console.log("Text prompt param:", textPrompt);
  console.log("User text input state:", userTextInput);

  if (!uploadedSelfie) {
    alert("Please upload a selfie first!");
    return;
  }

  const hasAudio = currentAudioBlob && currentAudioBlob.size > 0;
  const hasText = textPrompt || (userTextInput && userTextInput.trim().length > 0);
  const finalTextPrompt = textPrompt || userTextInput;
  
  console.log("Has audio:", hasAudio);
  console.log("Has text:", hasText, "Final text:", finalTextPrompt);

  if (!hasAudio && !hasText) {
    console.error("No valid audio or text input found!");
    alert("Please provide voice input or text message first!");
    return;
  }

  setIsCreatingFusion(true);

  try {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
    const formData = new FormData();
    
    formData.append('selfie', uploadedSelfie);
    
    if (hasAudio) {
      const audioFile = new File([currentAudioBlob!], 'voice_message.wav', {
        type: 'audio/wav'
      });
      formData.append('audio', audioFile);
    } else if (hasText) {
      formData.append('prompt', finalTextPrompt.trim());
    }

    const response = await fetch(`${serverUrl}/create_fusion`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const imageBlob = await response.blob();
    const imageUrl = URL.createObjectURL(imageBlob);

    const fusionMessage: Message = {
      id: Date.now().toString(),
      type: "bot",
      content: "Here's your personalized greeting! 🎉✨",
      timestamp: new Date(),
      mediaType: "fusion",
      mediaUrl: imageUrl,
    };

    setMessages((prev) => [...prev, fusionMessage]);
    
    setCurrentAudioBlob(null);
    setHasVoiceOrText(false);
    setUserTextInput("");
    setInputText("");

  } catch (error) {
    console.error('Error creating fusion:', error);
    alert(`Failed to create fusion image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    setIsCreatingFusion(false);
  }
};

 const handleManualFusionClick = () => {
  // When manually clicked, use current state values
  createFusionImage(userTextInput || undefined);
};
     

// Updated handleSendText to use the new function:
const handleSendTextWithParams = () => {
  if (inputText.trim()) {
    const textInput = inputText.trim();
    
    setUserTextInput(textInput);
    sendMessage(textInput, "text");
    setHasVoiceOrText(true);
    
    if (uploadedSelfie) {
      setTimeout(() => createFusionImageWithParams(textInput), 2000);
    }
    
    setInputText("");
  }
};

  

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file && file.type.startsWith("image/")) {
    console.log("Selfie uploaded:", file);
    setUploadedSelfie(file);
    const imageUrl = URL.createObjectURL(file);
    setSelfiePreview(imageUrl);
    sendMessage("Selfie uploaded", "image", imageUrl);
    
    // Auto-create fusion if we have both selfie and voice/text
    if (hasVoiceOrText || currentAudioBlob || userTextInput.trim()) {
      setTimeout(() => createFusionImage(userTextInput), 2000);
    }
  }
};
  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      console.log("Photo captured:", file);
      setUploadedSelfie(file);
      const imageUrl = URL.createObjectURL(file);
      setSelfiePreview(imageUrl);
      sendMessage("Photo captured", "image", imageUrl);
      
      // Auto-create fusion if we have both selfie and voice/text
      if (hasVoiceOrText || currentAudioBlob || userTextInput.trim()) {
        setTimeout(() => createFusionImage(), 2000);
      }
    }
  };

  const downloadFusionImage = (imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `howdee-greeting-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#fbf5df", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 shadow-lg border-b-2"
        style={{ backgroundColor: "#ff6b6b", borderColor: "rgba(255, 255, 255, 0.2)" }}
      >
        <div className="flex items-center space-x-4">
          <button className="text-white hover:bg-white/10 transition-colors duration-300 p-2 rounded">
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border-2 border-white/20">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-200 to-pink-200 flex items-center justify-center">
                <span className="text-red-600 font-bold text-sm">
                    <img src="/logo2.png" alt="Logo" className="w-6 h-6 rounded-full" />
                </span>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Howdee AI</h1>
              <p className="text-sm text-pink-100">Your Creative Assistant</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-white">Online</span>
        </div>
      </div>

      {/* Status Bar */}
      <div className="p-3 bg-white/80 border-b flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 ${uploadedSelfie ? 'text-green-600' : 'text-gray-500'}`}>
            <div className={`w-3 h-3 rounded-full ${uploadedSelfie ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className="text-sm font-medium">Selfie {uploadedSelfie ? '✅' : '❌'}</span>
          </div>
          <div className={`flex items-center space-x-2 ${hasVoiceOrText ? 'text-green-600' : 'text-gray-500'}`}>
            <div className={`w-3 h-3 rounded-full ${hasVoiceOrText ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className="text-sm font-medium">Voice/Text {hasVoiceOrText ? '✅' : '❌'}</span>
          </div>
        </div>

          
        {uploadedSelfie && hasVoiceOrText && (
  <button
    onClick={handleManualFusionClick}
    disabled={isCreatingFusion}
    className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded disabled:opacity-50"
  >
    {isCreatingFusion ? (
      <>
        <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
        Creating Magic...
      </>
    ) : (
      "✨ Create Fusion"
    )}
  </button>
)}
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-280px)]">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg ${
                message.type === "user" ? "text-white rounded-br-sm" : "bg-white text-gray-800 rounded-bl-sm border-2"
              }`}
              style={{
                backgroundColor: message.type === "user" ? "#ff6b6b" : "white",
                borderColor: message.type === "bot" ? "rgba(255, 107, 107, 0.1)" : "transparent",
              }}
            >
              {message.mediaType === "image" && message.mediaUrl && (
                <div className="mb-2">
                  <img
                    src={message.mediaUrl}
                    alt="Uploaded content"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}

              {message.mediaType === "audio" && message.mediaUrl && (
                <div className="mb-2 flex items-center space-x-2 bg-black/10 rounded-lg p-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: message.type === "user" ? "rgba(255,255,255,0.2)" : "#ff6b6b" }}
                  >
                    <Play className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs opacity-75">Voice Message</div>
                    <audio controls className="w-full h-6">
                      <source src={message.mediaUrl} type="audio/wav" />
                    </audio>
                  </div>
                </div>
              )}

              {message.mediaType === "fusion" && message.mediaUrl && (
                <div className="mb-2">
                  <img
                    src={message.mediaUrl}
                    alt="Fusion greeting"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => downloadFusionImage(message.mediaUrl!)}
                    className="mt-2 w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                  >
                    <Download className="w-4 h-4 mr-2 inline" />
                    Download Image
                  </button>
                </div>
              )}

              <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
              <p className={`text-xs mt-2 ${message.type === "user" ? "text-pink-100" : "text-gray-500"}`}>
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Creating Fusion Indicator */}
      {isCreatingFusion && (
        <div className="mx-4 mb-4 flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-2 border-purple-200">
          <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
          <span className="text-purple-600 font-medium">Creating your magical fusion image... ✨</span>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t-2" style={{ borderColor: "rgba(255, 107, 107, 0.1)" }}>
        {/* Recording Indicator */}
        {isRecording && (
          <div className="mb-4 flex items-center justify-center space-x-3 bg-red-50 rounded-lg p-3 border-2 border-red-200">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-600 font-medium">Recording... {formatTime(recordingTime)}</span>
            <button onClick={stopRecording} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
              <MicOff className="w-4 h-4 mr-1 inline" />
              Stop
            </button>
          </div>
        )}

        <div className="flex items-end space-x-3">
          {/* Media Buttons */}
          <div className="flex space-x-2">
            {/* Voice Recording */}
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isCreatingFusion}
              className={`border-2 p-2 rounded transition-all duration-300 ${
                isRecording ? "bg-red-500 border-red-500 text-white hover:bg-red-600" : "hover:scale-105"
              } ${isCreatingFusion ? "opacity-50 cursor-not-allowed" : ""}`}
              style={{
                borderColor: isRecording ? "#ef4444" : "#ff6b6b",
                color: isRecording ? "white" : "#ff6b6b",
              }}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* File Upload */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isRecording || isCreatingFusion}
              className="border-2 p-2 rounded hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderColor: "#ff6b6b", color: "#ff6b6b" }}
            >
              <Upload className="w-4 h-4" />
            </button>

            {/* Camera */}
            <button
              onClick={() => cameraInputRef.current?.click()}
              disabled={isRecording || isCreatingFusion}
              className="border-2 p-2 rounded hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderColor: "#ff6b6b", color: "#ff6b6b" }}
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Text Input */}
          <div className="flex-1 flex space-x-2">
            <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendText()}
              placeholder={
                isCreatingFusion 
                  ? "Creating fusion..." 
                  : isRecording 
                    ? "Recording..." 
                    : !uploadedSelfie
                      ? "First upload your selfie, then tell me what you want..."
                      : !hasVoiceOrText
                        ? "Now tell me what kind of greeting to create..."
                        : "Ready to create! Or give me a new request..."
              }
              className="flex-1 border-2 rounded-xl p-3 focus:ring-2 transition-all duration-300"
              style={{
                borderColor: "rgba(255, 107, 107, 0.3)",
              }}
              disabled={isRecording || isCreatingFusion}
            />

            <button
              onClick={handleSendText}
              disabled={!inputText.trim() || isRecording || isCreatingFusion}
              className="text-white font-medium px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#ff6b6b" }}
            >
              <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Hidden File Inputs */}
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleCameraCapture}
          className="hidden"
        />
      </div>
    </div>
  );
}