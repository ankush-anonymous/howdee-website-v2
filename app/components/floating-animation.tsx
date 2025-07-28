import React, { useState, useRef, useEffect } from 'react';

const FloatingElement = ({ style, children, delay = 0 }) => {
  const [ripples, setRipples] = useState([]);
  const elementRef = useRef(null);

  const createRipple = (e) => {
    const rect = elementRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = {
      id: Date.now(),
      x,
      y,
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  };

  return (
    <div
      ref={elementRef}
      className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center cursor-pointer overflow-hidden animate-bounce hover:scale-110 transition-transform duration-300"
      style={{
        ...style,
        animationDelay: `${delay}s`,
        boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
      }}
      onMouseMove={createRipple}
    >
      {/* Content (SVG goes here) */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Ripple effects */}
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="absolute pointer-events-none"
          style={{
            left: ripple.x - 20,
            top: ripple.y - 20,
            width: 40,
            height: 40,
          }}
        >
          <div className="w-full h-full rounded-full bg-gradient-to-r from-red-400/30 to-pink-400/30 animate-ping" />
        </div>
      ))}
    </div>
  );
};

const FloatingRippleElements = () => {
  // Sample SVG icons
  const HeartIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="#ff6b6b"/>
    </svg>
  );

  const StarIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="#ff8e8e"/>
    </svg>
  );

  const SparkleIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0l3 9h9l-7.5 5.5L19 24l-7-5-7 5 2.5-9.5L0 9h9l3-9z" fill="#ffb3b3"/>
    </svg>
  );

  const DiamondIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 3h12l4 6-10 12L2 9l4-6z" fill="#ff9999"/>
    </svg>
  );

  const CircleIcon = () => (
    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-red-300 to-pink-400" />
  );

  const TriangleIcon = () => (
    <div className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-l-transparent border-r-transparent border-b-red-400" />
  );

  return (
    <div className="w-1/2 flex items-center justify-center relative min-h-96">
      <div className="relative">
        {/* Main pulsing circles */}
        <div className="w-72 h-72 rounded-full bg-gradient-to-br from-red-100 to-pink-100 opacity-20 animate-pulse" />
        <div className="absolute inset-0 w-60 h-60 m-auto rounded-full bg-gradient-to-br from-red-200 to-pink-200 opacity-30 animate-pulse" style={{ animationDelay: "0.5s" }} />
        <div className="absolute inset-0 w-48 h-48 m-auto rounded-full bg-gradient-to-br from-red-300 to-pink-300 opacity-40 animate-pulse" style={{ animationDelay: "1s" }} />
        
        {/* Original bouncing dots */}
        <div className="absolute top-10 right-10 w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: "#ff6b6b" }} />
        <div className="absolute bottom-20 left-10 w-2.5 h-2.5 rounded-full animate-bounce" style={{ backgroundColor: "#ff6b6b", animationDelay: "0.5s" }} />
        <div className="absolute top-1/2 right-20 w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: "#ff6b6b", animationDelay: "1s" }} />
        
        {/* New floating elements with SVGs */}
        <FloatingElement 
          style={{ top: '20px', left: '50px' }} 
          delay={0.2}
        >
          <HeartIcon />
        </FloatingElement>
        
        <FloatingElement 
          style={{ top: '80px', right: '40px' }} 
          delay={0.8}
        >
          <StarIcon />
        </FloatingElement>
        
        <FloatingElement 
          style={{ bottom: '60px', left: '30px' }} 
          delay={1.2}
        >
          <SparkleIcon />
        </FloatingElement>
        
        <FloatingElement 
          style={{ bottom: '30px', right: '60px' }} 
          delay={0.4}
        >
          <DiamondIcon />
        </FloatingElement>
        
        <FloatingElement 
          style={{ top: '50%', left: '20px' }} 
          delay={1.5}
        >
          <CircleIcon />
        </FloatingElement>
        
        <FloatingElement 
          style={{ top: '30%', right: '80px' }} 
          delay={0.7}
        >
          <TriangleIcon />
        </FloatingElement>
        
        <FloatingElement 
          style={{ bottom: '40%', left: '60px' }} 
          delay={1.1}
        >
          <SparkleIcon />
        </FloatingElement>
        
        <FloatingElement 
          style={{ top: '70%', right: '30px' }} 
          delay={0.3}
        >
          <HeartIcon />
        </FloatingElement>
      </div>
    </div>
  );
};

export default FloatingRippleElements;
