"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Camera, Upload, ArrowLeft, Play, Download, Loader2, Video } from 'lucide-react';

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
  const [isAnimating, setIsAnimating] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordingIntervalRef = useRef(null);
  const audioChunksRef = useRef([]);
  const BACKEND_API_URL = "http://localhost:5000"; // Replace with your actual backend URL

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

  // Load transcript from localStorage on mount
  useEffect(() => {
    const savedTranscript = localStorage.getItem('transcript');
    if (savedTranscript) {
      setInputText(savedTranscript);
    }
    setInputText("")
    localStorage.removeItem('transcript');
  }, []);

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
      audioFile,
      transcriptText
    };
    setMessages(prev => [...prev, newMessage]);
    
    if (type === "user") {
      if (mediaType === "image") {
        setUploadedImage(true);
        setTimeout(() => {
          addMessage("bot", "Great! I can see your image. Now please provide instructions by typing a message or recording a voice note about what you'd like me to do with this image! 🎤✍️");
        }, 1000);
        return;
      }
      
      if (mediaType === "audio") {
        return;
      }
      
      if (mediaType === null && content.trim()) {
        setHasVoiceOrText(true);
        return;
      }
      
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
    if (inputText.trim() && uploadedImage && imageFile) {
      addMessage("user", inputText.trim());
      setIsProcessing(true);
      sendImageAndPromptToBackend(inputText.trim(), imageFile);
      setInputText('');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageFile(file);
      addMessage("user", "I've uploaded an image", "image", url);
    }
    event.target.value = '';
  };

  const handleCameraCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageFile(file);
      addMessage("user", "I've captured an image", "image", url);
    }
    event.target.value = '';
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const audioFile = new File([audioBlob], `recording-${Date.now()}.webm`, {
          type: 'audio/webm',
          lastModified: Date.now()
        });
        
        console.log("🎙️ Audio file created:", {
          name: audioFile.name,
          type: audioFile.type,
          size: audioFile.size
        });
        
        addMessage("user", "Voice message", "audio", audioUrl, audioFile);
        sendAudioToBackend(audioFile);
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

  const sendAudioToBackend = async (audioFile) => {
    try {
      console.log("📤 Sending audio to backend...");
      
      const formData = new FormData();
      formData.append('audio', audioFile);
      
      console.log("📋 FormData prepared:", {
        fileName: audioFile.name,
        fileType: audioFile.type,
        fileSize: audioFile.size
      });
      
      const response = await fetch(`${BACKEND_API_URL}/api/v1/whisper/transcribe`, {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log("✅ Backend response:", result);
        localStorage.setItem('transcript', result.transcript || '');
        setInputText(result.transcript || '');
      } else {
        console.error("❌ Backend error:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("❌ Error sending audio to backend:", error);
    }
  };

  const sendImageAndPromptToBackend = async (prompt, imageFile) => {
    try {
      console.log("📤 Sending image and prompt to backend...");
      
      const formData = new FormData();
      formData.append('prompt', prompt);
      formData.append('selfie', imageFile);
      
      console.log("📋 FormData prepared:", {
        prompt,
        imageName: imageFile.name,
        imageType: imageFile.type,
        imageSize: imageFile.size
      });
      
      const response = await fetch(`${BACKEND_API_URL}/api/v1/image/generate-image`, {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log("✅ Backend response:", result);
        
        if (result.success && result.generatedImage) {
          localStorage.setItem('generatedImage', result.generatedImage);
          addMessage("bot", "Here's your generated image!", "fusion", result.generatedImage);
        } else {
          addMessage("bot", "Sorry, something went wrong while generating the image.");
        }
      } else {
        console.error("❌ Backend error:", response.status, response.statusText);
        addMessage("bot", "Failed to generate image. Please try again.");
      }
      setImageFile(null);
      setUploadedImage(false);
      setHasVoiceOrText(false);
    } catch (error) {
      console.error("❌ Error sending image and prompt to backend:", error);
      addMessage("bot", "An error occurred while processing your request.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAnimateImage = async () => {
    const generatedImage = localStorage.getItem('generatedImage');
    
    if (!generatedImage) {
      addMessage("bot", "No generated image found to animate. Please generate an image first!");
      return;
    }

    setIsAnimating(true);
    addMessage("bot", "✨ Animating your image... This may take a moment!");

    try {
      console.log("🎬 Sending image for animation...");
      
      const animationData = {
        imageUrl: generatedImage,
        prompt: "give a very slight animation to blink her eyes, make her hair seem like getting a slight blow due to flowing air and show blowing effect on diya as well"
      };

      const response = await fetch(`${BACKEND_API_URL}/api/v1/video/generate-professional-video`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(animationData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Animation response:", result);
        
        if (result.success && result.videoUrl) {
          addMessage("bot", "🎬 Your animated video is ready!", "video", result.videoUrl);
          localStorage.setItem('animatedVideo', result.videoUrl);
        } else {
          addMessage("bot", "Sorry, something went wrong while animating the image.");
        }
      } else {
        console.error("❌ Animation error:", response.status, response.statusText);
        addMessage("bot", "Failed to animate image. Please try again.");
      }
    } catch (error) {
      console.error("❌ Error animating image:", error);
      addMessage("bot", "An error occurred while animating your image.");
    } finally {
      setIsAnimating(false);
    }
  };

  const handleTranscriptConfirmation = (isConfirmed, transcriptText) => {
    if (isConfirmed) {
      console.log("✅ User confirmed transcript:", transcriptText);
      setHasVoiceOrText(true);
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

  const downloadVideo = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'animated-video.mp4';
    link.click();
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
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={() => downloadImage(message.mediaUrl)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    >
                      <Download className="w-4 h-4 mr-2 inline" />
                      Download Image
                    </button>
                    <button
                      onClick={handleAnimateImage}
                      disabled={isAnimating}
                      className="flex-1 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Video className="w-4 h-4 mr-2 inline" />
                      {isAnimating ? "Animating..." : "Animate"}
                    </button>
                  </div>
                </div>
              )}
              {message.mediaType === "video" && message.mediaUrl && (
                <div className="mb-2">
                  <video
                    src={message.mediaUrl}
                    controls
                    className="w-full h-48 object-cover rounded-lg"
                    poster=""
                  >
                    Your browser does not support the video element.
                  </video>
                  <button
                    onClick={() => downloadVideo(message.mediaUrl)}
                    className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    <Download className="w-4 h-4 mr-2 inline" />
                    Download Video
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

      {/* Processing Indicators */}
      {isProcessing && (
        <div className="mx-4 mb-4 flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-2 border-purple-200">
          <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
          <span className="text-purple-600 font-medium">Processing your content... ✨</span>
        </div>
      )}

      {isAnimating && (
        <div className="mx-4 mb-4 flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border-2 border-blue-200">
          <Video className="w-5 h-5 text-blue-600 animate-pulse" />
          <span className="text-blue-600 font-medium">Creating your animated video... 🎬</span>
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
          <div className="flex space-x-2">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing || isAnimating}
              className={`border-2 p-2 rounded transition-all duration-300 ${
                isRecording ? "bg-red-500 border-red-500 text-white hover:bg-red-600" : "hover:scale-105"
              } ${(isProcessing || isAnimating) ? "opacity-50 cursor-not-allowed" : ""}`}
              style={{
                borderColor: isRecording ? "#ef4444" : "#ff6b6b",
                color: isRecording ? "white" : "#ff6b6b",
              }}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isRecording || isProcessing || isAnimating}
              className="border-2 p-2 rounded hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderColor: "#ff6b6b", color: "#ff6b6b" }}
            >
              <Upload className="w-4 h-4" />
            </button>
            <button
              onClick={() => cameraInputRef.current?.click()}
              disabled={isRecording || isProcessing || isAnimating}
              className="border-2 p-2 rounded hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderColor: "#ff6b6b", color: "#ff6b6b" }}
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 flex space-x-2">
            <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendText()}
              placeholder={
                isProcessing 
                  ? "Processing content..." 
                  : isAnimating
                    ? "Creating animation..."
                    : isRecording 
                      ? "Recording..." 
                      : !uploadedImage
                        ? "Please upload an image first! 📸"
                        : "Now tell me what to do with your image..."
              }
              className="flex-1 border-2 rounded-xl p-3 focus:ring-2 transition-all duration-300"
              style={{
                borderColor: "rgba(255, 107, 107, 0.3)",
              }}
              disabled={isRecording || isProcessing || isAnimating}
            />
            <button
              onClick={handleSendText}
              disabled={!inputText.trim() || isRecording || isProcessing || isAnimating || !uploadedImage}
              className="text-white font-medium px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#ff6b6b" }}
            >
              <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
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