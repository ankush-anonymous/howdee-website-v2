"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Camera, Upload, ArrowLeft, Play, Download, Loader2 } from 'lucide-react';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: "Hello! I'm Howdee AI, your creative assistant. Please start by uploading an image first! 📸",
      timestamp: new Date(),
      mediaType: null,
      mediaUrl: null
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [uploadedImage, setUploadedImage] = useState(false);
  const [hasVoiceOrText, setHasVoiceOrText] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordingIntervalRef = useRef(null);
  const audioChunksRef = useRef([]);
    const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;


  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(recordingIntervalRef.current);
      setRecordingTime(0);
    }
    return () => clearInterval(recordingIntervalRef.current);
  }, [isRecording]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const addMessage = (type, content, mediaType = null, mediaUrl = null, audioFile = null, transcriptText = null) => {
    const newMessage = {
      id: Date.now(),
      type,
      content,
      timestamp: new Date(),
      mediaType,
      mediaUrl,
      audioFile, // Store the file for backend submission
      transcriptText // Store transcript for confirmation
    };
    setMessages(prev => [...prev, newMessage]);
    
    if (type === "user") {
      if (mediaType === "image") {
        setUploadedImage(true);
        // Bot prompts for next step after image upload
        setTimeout(() => {
          addMessage("bot", "Great! I can see your image. Now please provide instructions by typing a message or recording a voice note about what you'd like me to do with this image! 🎤✍️");
        }, 1000);
        return;
      }
      
      if (mediaType === "audio") {
        // For audio messages, we'll wait for transcription confirmation
        // Don't set hasVoiceOrText here, wait for user confirmation
        return;
      }
      
      if (mediaType === null && content.trim()) {
        setHasVoiceOrText(true);
        
        // Check if both conditions are met
        if (uploadedImage) {
          console.log("🚀 DEBUG: Both conditions met!");
          console.log("📸 Image uploaded:", uploadedImage);
          console.log("💬 Text provided:", content);
          console.log("🎯 Ready to process!");
          
          // Auto-process when both conditions are met
          setTimeout(() => {
            handleProcessContent();
          }, 1500);
        } else {
          setTimeout(() => {
            addMessage("bot", "I received your message, but I need an image first! Please upload an image and then I can help you with your request. 📸");
          }, 1000);
        }
        return;
      }
      
      // Default response for other cases
      setTimeout(() => {
        let botResponse = "I received your message! ";
        if (!uploadedImage) {
          botResponse = "Please upload an image first so I can help you! 📸";
        } else if (!hasVoiceOrText) {
          botResponse = "Now tell me what you'd like me to do with your image! 💬";
        }
        addMessage("bot", botResponse);
      }, 1000);
    }
  };

  const handleSendText = () => {
    if (inputText.trim()) {
      addMessage("user", inputText.trim());
      setInputText('');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      addMessage("user", "I've uploaded an image", "image", url);
    }
    event.target.value = '';
  };

  const handleCameraCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      addMessage("user", "I've captured an image", "image", url);
    }
    event.target.value = '';
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus' // Use webm format which is widely supported
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Create a proper File object for backend compatibility
        const audioFile = new File([audioBlob], `recording-${Date.now()}.webm`, {
          type: 'audio/webm',
          lastModified: Date.now()
        });
        
        // Store the file for backend submission
        console.log("🎙️ Audio file created:", {
          name: audioFile.name,
          type: audioFile.type,
          size: audioFile.size
        });
        
        addMessage("user", "Voice message", "audio", audioUrl, audioFile);
        
        // Send to backend for transcription
        sendAudioToBackend(audioFile);
        
        // Stop all tracks to turn off microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleProcessContent = () => {
    console.log("🎯 Processing content...");
    console.log("📸 Image status:", uploadedImage);
    console.log("💬 Voice/Text status:", hasVoiceOrText);
    
    if (uploadedImage && hasVoiceOrText) {
      setIsProcessing(true);
      
      addMessage("bot", "Perfect! I have both your image and instructions. Processing now... ✨");
      
      setTimeout(() => {
        addMessage("bot", "Here's your processed content! I've created something amazing based on your image and instructions. 🎨", "fusion", "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZnVzaW9uR3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZmY2YjZiO3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZjk5OTk7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0idXJsKCNmdXNpb25HcmFkaWVudCkiIHJ4PSIxNSIvPgogIDx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+4pyoIFByb2Nlc3NlZCEg4pyoPC90ZXh0Pgo8L3N2Zz4=");
        setIsProcessing(false);
        
        console.log("✅ Processing completed successfully!");
      }, 2000);
    } else {
      console.log("❌ Cannot process - missing requirements:");
      console.log("📸 Image:", uploadedImage);
      console.log("💬 Voice/Text:", hasVoiceOrText);
    }
  };

  // Function to handle transcript confirmation
  const handleTranscriptConfirmation = (isConfirmed, transcriptText) => {
    if (isConfirmed) {
      console.log("✅ User confirmed transcript:", transcriptText);
      setHasVoiceOrText(true);
      
      // Check if both conditions are met
      if (uploadedImage) {
        console.log("🚀 DEBUG: Both conditions met after confirmation!");
        console.log("📸 Image uploaded:", uploadedImage);
        console.log("💬 Voice confirmed:", transcriptText);
        console.log("🎯 Ready to process!");
        
        // Auto-process when both conditions are met
        setTimeout(() => {
          handleProcessContent();
        }, 1500);
      }
    } else {
      console.log("❌ User rejected transcript, asking for new input");
      setTimeout(() => {
        addMessage("bot", "No problem! Please try recording again or type your message instead. 🎤✍️");
      }, 500);
    }
  };

  const downloadImage = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'fusion-image.png';
    link.click();
  };

  // Function to send audio to backend
  const sendAudioToBackend = async (audioFile) => {
    try {
      console.log("📤 Sending audio to backend...");
      
      const formData = new FormData();
      formData.append('audio', audioFile); // Key 'audio' matches your backend expectation
      
      console.log("📋 FormData prepared:", {
        fileName: audioFile.name,
        fileType: audioFile.type,
        fileSize: audioFile.size
      });
      
      // Replace with your actual backend URL
      const response = await fetch(`${BACKEND_API_URL}/api/v1/whisper/transcribe`, {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log("✅ Backend response:", result);
        
        // You can handle the transcription result here
        // For example, add it as a bot message
        setTimeout(() => {
          addMessage("bot", `I heard: "${result.transcript || 'Audio processed successfully!'}" 🎙️`);
        }, 500);
      } else {
        console.error("❌ Backend error:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("❌ Error sending audio to backend:", error);
    }
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
                <span className="text-red-600 font-bold text-sm">AI</span>
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
                      <source src={message.mediaUrl} type="audio/webm" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                </div>
              )}

              {message.mediaType === "confirmation" && (
                <div className="mb-2 flex space-x-2">
                  <button
                    onClick={() => handleTranscriptConfirmation(true, message.transcriptText)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex-1"
                  >
                    ✅ Yes, that's correct
                  </button>
                  <button
                    onClick={() => handleTranscriptConfirmation(false, message.transcriptText)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex-1"
                  >
                    ❌ No, try again
                  </button>
                </div>
              )}

              {message.mediaType === "fusion" && message.mediaUrl && (
                <div className="mb-2">
                  <img
                    src={message.mediaUrl}
                    alt="Processed content"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => downloadImage(message.mediaUrl)}
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

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="mx-4 mb-4 flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-2 border-purple-200">
          <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
          <span className="text-purple-600 font-medium">Processing your content... ✨</span>
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
              disabled={isProcessing || !uploadedImage}
              className={`border-2 p-2 rounded transition-all duration-300 ${
                isRecording ? "bg-red-500 border-red-500 text-white hover:bg-red-600" : "hover:scale-105"
              } ${(isProcessing || !uploadedImage) ? "opacity-50 cursor-not-allowed" : ""}`}
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
              disabled={isRecording || isProcessing}
              className="border-2 p-2 rounded hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderColor: "#ff6b6b", color: "#ff6b6b" }}
            >
              <Upload className="w-4 h-4" />
            </button>

            {/* Camera */}
            <button
              onClick={() => cameraInputRef.current?.click()}
              disabled={isRecording || isProcessing}
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
                isProcessing 
                  ? "Processing content..." 
                  : isRecording 
                    ? "Recording..." 
                    : !uploadedImage
                      ? "Please upload an image first! 📸"
                      : !hasVoiceOrText
                        ? "Now tell me what to do with your image..."
                        : "Ready! Upload another image to start over..."
              }
              className="flex-1 border-2 rounded-xl p-3 focus:ring-2 transition-all duration-300"
              style={{
                borderColor: "rgba(255, 107, 107, 0.3)",
              }}
              disabled={isRecording || isProcessing || !uploadedImage}
            />

            <button
              onClick={handleSendText}
              disabled={!inputText.trim() || isRecording || isProcessing || !uploadedImage}
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
};

export default ChatInterface;