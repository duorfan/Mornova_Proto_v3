import React, { useState, useEffect, createContext, useContext } from 'react';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Badge } from './components/ui/badge';
// import { RadioGroup, RadioGroupItem } from './components/ui/radio-group';
import { Label } from './components/ui/label';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './components/ui/dialog';
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner';
import { ArrowLeft, Plus, Clock, Shield, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import lampImage from './assets/4db511e48f510a8bcb756dd7d246aa8b5c88b734.png';
import { TomorrowMorningPanel } from './components/TomorrowMorningPanel';

// Theme Context
const ThemeContext = createContext({
  isNightMode: true,
  toggleMode: () => {}
});

// Wavy Background Component
const WavyBackground = () => {
  const { isNightMode } = useContext(ThemeContext);
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            {isNightMode ? (
              <>
                <stop offset="0%" stopColor="rgba(246, 230, 217, 0.03)" />
                <stop offset="50%" stopColor="rgba(237, 231, 246, 0.03)" />
                <stop offset="100%" stopColor="rgba(246, 230, 217, 0.03)" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="rgba(255, 178, 122, 0.15)" />
                <stop offset="50%" stopColor="rgba(255, 200, 127, 0.12)" />
                <stop offset="100%" stopColor="rgba(255, 178, 122, 0.08)" />
              </>
            )}
          </linearGradient>
        </defs>
        <path
          d="M0,20 Q25,5 50,20 T100,20 L100,40 Q75,25 50,40 T0,40 Z"
          fill="url(#waveGradient)"
          opacity="0.8"
        />
        <path
          d="M0,60 Q25,45 50,60 T100,60 L100,80 Q75,65 50,80 T0,80 Z"
          fill="url(#waveGradient)"
          opacity="0.6"
        />
      </svg>
    </div>
  );
};

// Glass Card Component
const GlassCard = ({ children, className = '', ...props }: { children?: React.ReactNode; className?: string; [key: string]: any }) => {
  const { isNightMode } = useContext(ThemeContext);
  
  const cardStyle = isNightMode ? {
    backgroundColor: '#FFFFFF0D',
    border: '1px solid #FFFFFF1A',
    borderRadius: '24px',
    backdropFilter: 'blur(16px)',
    boxShadow: '0 8px 24px -6px rgba(0, 0, 0, 0.4), 0 2px 8px 0 rgba(0, 0, 0, 0.2)'
  } : {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    border: '1px solid rgba(0, 0, 0, 0.06)',
    borderRadius: '24px',
    backdropFilter: 'blur(16px)',
    boxShadow: '0 8px 24px -6px rgba(0, 0, 0, 0.1), 0 2px 8px 0 rgba(0, 0, 0, 0.05)'
  };
    
  return (
    <Card className={`${className}`} style={cardStyle} {...props}>
      {children}
    </Card>
  );
};

// Enhanced Lamp Preview Component with Personality Animations
const LampPreview = ({ personality, hasPersonality = false, onTap }) => {
  const { isNightMode } = useContext(ThemeContext);
  const [sparkles, setSparkles] = useState<any[]>([]);
  const [ripples, setRipples] = useState<any[]>([]);
  const [showFlicker, setShowFlicker] = useState(false);
  
  // Accent glow colors per personality
  const getAccentGlow = (tone) => {
    switch (tone) {
      case 'Friendly': return '#FFB27A';
      case 'Calm': return '#C9C6FF';
      case 'Playful': return '#FF9AD5';
      case 'Direct': return '#8FF4E7';
      default: return '#6C7BFF';
    }
  };

  // Handle tap interactions with personality-based effects
  const handleTap = () => {
    if (onTap) onTap();
    
    if (!hasPersonality) return;
    
    switch (personality.tone) {
      case 'Playful':
        // Sparkles burst
        const newSparkles = Array.from({ length: 8 }, (_, i) => ({
          id: Date.now() + i,
          x: 20 + Math.random() * 60,
          y: 20 + Math.random() * 60,
          delay: i * 0.05
        }));
        setSparkles(newSparkles);
        setTimeout(() => setSparkles([]), 800);
        break;
        
      case 'Friendly':
        // Ripple effect
        const newRipple = {
          id: Date.now(),
          scale: 0
        };
        setRipples([newRipple]);
        setTimeout(() => setRipples([]), 1000);
        break;
        
      case 'Direct':
        // Brightness flicker
        setShowFlicker(true);
        setTimeout(() => setShowFlicker(false), 300);
        break;
        
      default:
        break;
    }
  };

  return (
    <div className="relative flex flex-col items-center py-16 my-8" style={{ transform: 'scale(1.3)' }}>
      {/* Smaller, more subtle glow ring */}
      {isNightMode && (
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: hasPersonality 
              ? `radial-gradient(circle, ${getAccentGlow(personality.tone)} 0%, transparent 70%)`
              : 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
            filter: 'blur(20px)',
            transform: 'scale(1.17)', // Reduced by 0.9
            opacity: hasPersonality ? 0.5 : 0.2 // Slightly more subtle
          }}
        />
      )}

      <div className="relative flex justify-center items-center">
        {/* Lamp image container with personality animations - scaled up 1.2x */}
        <motion.div 
          className="relative z-10 w-32 h-32 cursor-pointer"
          onClick={handleTap}
          initial={{ scale: 1.2 }}
          animate={hasPersonality ? { scale: 1.2 } : {
            scale: 1.2,
            opacity: [0.7, 1, 0.7]
          }}
          whileTap={{ scale: 1.14 }} // 1.2 * 0.95 = 1.14
          transition={hasPersonality ? { duration: 0.2 } : {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <img 
            src={lampImage} 
            alt="Mornova Lamp" 
            className="w-full h-full object-contain filter drop-shadow-lg"
            style={{ transform: 'scale(0.9)' }}
          />

          {/* Sparkles for Playful personality */}
          {sparkles.map(sparkle => (
            <motion.div
              key={sparkle.id}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                left: `${sparkle.x}%`,
                top: `${sparkle.y}%`,
                backgroundColor: '#FFD492',
                opacity: 0.8
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ 
                scale: [0, 1.2, 0], 
                opacity: [1, 1, 0],
                y: -20
              }}
              transition={{ 
                duration: 0.6, 
                delay: sparkle.delay,
                ease: "easeOut" 
              }}
            />
          ))}

          {/* Ripples for Friendly personality */}
          {ripples.map(ripple => (
            <motion.div
              key={ripple.id}
              className="absolute inset-0 border-2 rounded-full"
              style={{ borderColor: getAccentGlow(personality.tone) }}
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          ))}

          {/* Calm glow waves - continuous for Calm personality */}
          {hasPersonality && personality.tone === 'Calm' && (
            <>
              <motion.div
                className="absolute inset-0 border rounded-full"
                style={{ borderColor: getAccentGlow(personality.tone), opacity: 0.3 }}
                animate={{
                  scale: [1, 1.4],
                  opacity: [0.3, 0]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
              <motion.div
                className="absolute inset-0 border rounded-full"
                style={{ borderColor: getAccentGlow(personality.tone), opacity: 0.2 }}
                animate={{
                  scale: [1, 1.7],
                  opacity: [0.2, 0]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: 0.6,
                  ease: "easeOut"
                }}
              />
            </>
          )}

          {/* Direct brightness flicker */}
          {showFlicker && (
            <motion.div
              className="absolute inset-0 bg-white rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.4, 0, 0.3, 0] }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          )}
        </motion.div>
      </div>


    </div>
  );
};

// Simplified Home Screen with Tinder-style Cards
const HomeScreen = ({ onNavigate, personality, setPersonality }) => {
  const [cardOrder, setCardOrder] = useState([0, 1, 2, 3]); // Track card order for infinite scrolling
  const [selectedResponse, setSelectedResponse] = useState<any>(null);
  const [cardHistory, setCardHistory] = useState<any[]>([]);

  // Initialize selectedResponse from existing personality when component mounts
  useEffect(() => {
    if (personality && personality.tone && !selectedResponse) {
      const responses = [
        {
          text: "No worries! 5 more minutes of peace",
          effect: 'dim',
          tone: 'Calm',
          icon: '����',
          description: "Gentle wake-ups & mindful reminders"
        },
        {
          text: "Okay, but this is the LAST one!",
          effect: 'flash',
          tone: 'Direct',
          icon: '⚡',
          description: "Clear boundaries & firm nudges"
        },
        {
          text: "Come on! Adventure is waiting!",
          effect: 'swirl',
          tone: 'Playful',
          icon: '🌀',
          description: "Fun energy & creative encouragement"
        },
        {
          text: "[Silent mode] Lamp just brightens gradually",
          effect: 'brighten',
          tone: 'Friendly',
          icon: '☀️',
          description: "Warm support & caring guidance"
        }
      ];
      
      const matchingResponse = responses.find(r => r.tone === personality.tone);
      if (matchingResponse) {
        setSelectedResponse(matchingResponse);
      }
    }
  }, [personality?.tone]); // Fixed dependency to prevent infinite loop
  
  const responses = [
    {
      text: "No worries!<br />5 more minutes of peace",
      effect: 'dim',
      tone: 'Calm',
      icon: '🌙',
      description: "Gentle wake-ups & mindful reminders"
    },
    {
      text: "Okay, but this is the LAST one!",
      effect: 'flash',
      tone: 'Direct',
      icon: '⚡',
      description: "Clear boundaries & firm nudges"
    },
    {
      text: "Come on! Adventure is waiting!",
      effect: 'swirl',
      tone: 'Playful',
      icon: '🌀',
      description: "Fun energy & creative encouragement"
    },
    {
      text: "[Silent mode] Lamp just brightens gradually",
      effect: 'brighten',
      tone: 'Friendly',
      icon: '☀️',
      description: "Warm support & caring guidance"
    }
  ];

  const ctaButtonStyle = {
    background: 'linear-gradient(90deg, #FFB27A 0%, #FFC87F 100%)',
    color: '#111827',
    border: 'none',
    borderRadius: '9999px',
    padding: '16px 24px',
    transition: 'all 120ms ease',
  };
  
  const secondaryButtonStyle = {
    backgroundColor: '#FFFFFF0D',
    border: '1px solid #FFFFFF1A',
    borderRadius: '24px',
    backdropFilter: 'blur(16px)',
    color: '#F3F4F6',
    transition: 'all 120ms ease',
  };

  // Removed unused style variables

  const getAccentColor = (tone) => {
    switch (tone) {
      case 'Friendly': return 'linear-gradient(135deg, #FFB27A 0%, #FFD59E 100%)';
      case 'Calm': return 'linear-gradient(135deg, #C9C6FF 0%, #A6E3FF 100%)';
      case 'Playful': return 'linear-gradient(135deg, #FF9AD5 0%, #FFCF8B 100%)';
      case 'Direct': return 'linear-gradient(135deg, #8FF4E7 0%, #7AA8FF 100%)';
      default: return 'linear-gradient(135deg, #6C7BFF 0%, #3B82F6 100%)';
    }
  };

  const handleSkip = () => {
    // Move current card to bottom of deck (circular scrolling)
    setCardHistory([...cardHistory, { order: [...cardOrder], selected: selectedResponse }]);
    const newOrder = [...cardOrder.slice(1), cardOrder[0]];
    setCardOrder(newOrder);
  };

  const handleChoose = (response) => {
    // If this response is already selected, unselect it
    if (selectedResponse?.tone === response.tone) {
      setSelectedResponse(null);
      setPersonality({ tone: '', traits: [] });
    } else {
      // Otherwise, select this response
      setSelectedResponse(response);
      setPersonality({ tone: response.tone, traits: [] });
    }
    // Keep the same card order, just toggle selection state
  };

  const handleBack = () => {
    if (cardHistory.length > 0) {
      const lastState = cardHistory[cardHistory.length - 1];
      setCardHistory(cardHistory.slice(0, -1));
      setCardOrder(lastState.order);
      setSelectedResponse(lastState.selected);
    }
  };

  // Get current card based on card order
  const getCurrentCard = () => responses[cardOrder[0]];

  return (
    <div className="space-y-6 pt-[30px] pr-[20px] pb-[60px] pl-[20px]">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Sparkles style={{ color: '#D4D4D8' }} size={24} />
        <h1 style={{ color: '#F3F4F6' }}>Mornova</h1>
      </div>

      {/* Header Text */}
      <div className="text-left" style={{ marginBottom: '10vh' }}>
        <h1 style={{ color: '#F3F4F6', fontFamily: 'Futura, sans-serif', fontSize: 'calc(1.5rem * 1.3)' }} className="mb-2 mt-1">Good Evening</h1>
        
        {/* Status line - text content and live indicator */}
        <div className="flex items-center justify-between mt-[-5px] mr-[0px] mb-[0px] ml-[0px]">
          <p 
            style={{ color: '#A1A1AA', fontFamily: 'Futura, sans-serif', }}
            className="text-base"
          >
            {(selectedResponse || personality.tone) 
              ? `I'm Your ${selectedResponse?.tone || personality.tone} Mornova`
              : "Waiting for your vibe..."
            }
          </p>
          
          {/* Live indicator - aligned to right */}
          <div 
            className="flex items-center gap-1 rounded-full px-3 py-1"
            style={{
              backgroundColor: '#FFFFFF0D',
              backdropFilter: 'blur(8px)'
            }}
          >
            <motion.div 
              className="w-2 h-2 rounded-full"
              style={{
                background: 'linear-gradient(90deg, #FFB27A 0%, #FFC87F 100%)'
              }}
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <span 
              className="text-xs"
              style={{ color: '#A1A1AA' }}
            >
              Live
            </span>
          </div>
        </div>
      </div>

      {/* Lamp Preview - Moved up as hero element */}
      <LampPreview 
        personality={personality} 
        hasPersonality={!!(selectedResponse || personality.tone)}
        onTap={() => {}}
      />

      {/* Tomorrow Morning Weather Panel */}
      <div className="w-full mb-8">
        <TomorrowMorningPanel />
      </div>

      {/* Personality Setup Header */}
      <div className="text-left mb-6">

      </div>

      {/* Scenario Question - Styled to match header */}
      <div className="text-left mb-6 px-0">
        <h2 style={{ color: '#F3F4F6', fontFamily: 'Futura, sans-serif', fontSize: 'calc(1.25rem * 1.3 * 0.9)' }} className="mb-3 mt-8">
          You hit snooze once.<br />
          Mornova says…
        </h2>
      </div>

      {/* Tinder-Style Swipeable Card Stack - No dot indicators */}
      <div className="relative h-64 m-[0px] max-w-md mx-auto" style={{ zIndex: 1 }}>
        {cardOrder.map((responseIndex, stackIndex) => {
          if (stackIndex > 3) return null; // Only show top 4 cards
          
          const response = responses[responseIndex];
          const isActive = stackIndex === 0;
          const isSelected = selectedResponse?.tone === response.tone;
          
          // Progressive right offset to show card edges
          const xOffsets = [0, 20, 40, 60];
          const yOffsets = [0, 4, 8, 12];
          const scales = [1, 0.95, 0.90, 0.85];
          const opacities = [1, 0.85, 0.7, 0.55];
          
          return (
            <motion.div
              key={`${response.tone}-${responseIndex}-${stackIndex}`}
              className="absolute cursor-pointer select-none"
              style={{
                backgroundColor: isSelected ? 'rgba(255, 178, 122, 0.15)' : '#FFFFFF0D',
                border: `1px solid ${isSelected ? 'rgba(255, 178, 122, 0.4)' : stackIndex === 0 ? '#FFFFFF26' : '#FFFFFF1A'}`,
                borderRadius: '24px',
                backdropFilter: 'blur(16px)',
                zIndex: responses.length - stackIndex,
                width: '320px',
                height: '220px',
                left: stackIndex === 0 ? '0px' : '0px',
                top: '0px'
              }}
              initial={{ 
                scale: scales[stackIndex], 
                x: xOffsets[stackIndex], 
                y: yOffsets[stackIndex],
                opacity: opacities[stackIndex],
                rotate: 0
              }}
              animate={{ 
                scale: scales[stackIndex], 
                x: xOffsets[stackIndex], 
                y: yOffsets[stackIndex],
                opacity: opacities[stackIndex],
                rotate: 0
              }}
              drag={isActive ? "x" : false}
              dragConstraints={{ left: -200, right: 200 }}
              dragElastic={0.1}
              whileDrag={isActive ? {
                scale: 1.05,
                rotate: [0, 5, -5, 0],
                transition: { duration: 0.1 }
              } : {}}
              onDrag={(event, info) => {
                if (isActive) {
                  // Add rotation based on drag distance
                  const rotation = info.offset.x * 0.1; // Adjust rotation sensitivity
                  const target = event.target as HTMLElement;
                  if (target) {
                    target.style.transform = `rotate(${rotation}deg) scale(1.05)`;
                  }
                }
              }}
              onDragEnd={(event, info) => {
                if (isActive) {
                  const swipeThreshold = 100;
                  if (info.offset.x > swipeThreshold) {
                    // Swipe right - choose card
                    handleChoose(response);
                  } else if (info.offset.x < -swipeThreshold) {
                    // Swipe left - skip to next
                    handleSkip();
                  }
                  // Reset transform
                  const target = event.target as HTMLElement;
                  if (target) {
                    target.style.transform = '';
                  }
                }
              }}
              exit={{
                x: 500,
                rotate: 30,
                opacity: 0,
                scale: 0.8,
                transition: { duration: 0.3, ease: "easeInOut" }
              }}
              onClick={() => {
                if (isActive) {
                  handleChoose(response);
                } else if (stackIndex <= 2) {
                  // Navigate to this card - bring it to front
                  const newOrder = [...cardOrder];
                  const targetIndex = newOrder.indexOf(responseIndex);
                  const rotatedOrder = [...newOrder.slice(targetIndex), ...newOrder.slice(0, targetIndex)];
                  setCardHistory([...cardHistory, { order: [...cardOrder], selected: selectedResponse }]);
                  setCardOrder(rotatedOrder);
                }
              }}
              whileHover={isActive ? { 
                scale: 1.02,
                transition: { duration: 0.2 }
              } : stackIndex <= 2 ? { 
                scale: scales[stackIndex] * 1.02,
                transition: { duration: 0.2 }
              } : {}}
              whileTap={isActive ? { 
                scale: 0.98 
              } : {}}
            >
              <div className="flex flex-col items-center justify-center text-center h-full px-[26px] py-[8px]">
                {/* Mini Lamp Orb */}
                <div 
                  className="w-12 h-12 rounded-full mb-3 flex items-center justify-center relative transition-all duration-300"
                  style={{
                    background: getAccentColor(response.tone),
                    opacity: isActive ? 1 : 0.8,
                    transform: `scale(${isActive ? 1 : 0.9})`
                  }}
                >
                  <span className="text-lg">{response.icon}</span>
                </div>
                
                {/* Main Quote - larger text for readability */}
                <p 
                  style={{ color: isActive ? '#F3F4F6' : stackIndex <= 1 ? '#D4D4D8' : '#A1A1AA' }}
                  className={`${isActive ? 'text-base' : 'text-sm'} leading-tight mb-2 px-3`}
                  dangerouslySetInnerHTML={{ __html: response.text }}
                />
                
                {/* Persona Label */}
                <Badge 
                  className="mb-1 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: isSelected ? 'rgba(255, 178, 122, 0.4)' : isActive ? 'rgba(255, 178, 122, 0.3)' : stackIndex <= 1 ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                    color: isActive ? '#F3F4F6' : stackIndex <= 1 ? '#D4D4D8' : '#A1A1AA',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    fontSize: isActive ? '0.75rem' : '0.7rem'
                  }}
                >
                  {response.tone}
                </Badge>

                {/* Micro-description - only show on active card */}
                {isActive && (
                  <p 
                    style={{ color: '#A1A1AA' }}
                    className="text-xs"
                  >
                    {response.description}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div 
        className="flex justify-between items-center mb-[50px] p-[0px] mt-4 mr-[0px] ml-[0px] relative"
        style={{ zIndex: 10 }}
      >
        <button
          onClick={handleBack}
          disabled={cardHistory.length === 0}
          className="px-4 py-2 rounded-full text-sm transition-all relative"
          style={{
            backgroundColor: cardHistory.length > 0 ? '#FFFFFF0D' : 'transparent',
            color: cardHistory.length > 0 ? '#A1A1AA' : '#71717A',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            opacity: cardHistory.length > 0 ? 1 : 0.4,
            cursor: cardHistory.length > 0 ? 'pointer' : 'not-allowed',
            zIndex: 20
          }}
        >
          ← Back
        </button>
        
        <button
          onClick={() => handleChoose(getCurrentCard())}
          className="px-4 py-2 rounded-full text-sm transition-all relative"
          style={{
            backgroundColor: '#FFFFFF0D',
            color: '#A1A1AA',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            zIndex: 20
          }}
        >
          {selectedResponse ? 'Selected!' : '✓'}
        </button>
        
        <button
          onClick={handleSkip}
          className="px-4 py-2 rounded-full text-sm transition-all relative"
          style={{
            backgroundColor: '#FFFFFF0D',
            color: '#A1A1AA',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            zIndex: 20
          }}
        >
          Next →
        </button>
      </div>

      {/* Navigation Buttons */}
      <div className="space-y-4">
        <Button
          onClick={() => onNavigate('routine')}
          className="w-full h-auto justify-start"
          style={secondaryButtonStyle}
        >
          <div className="flex items-center gap-2 px-4 py-4">
            <Clock style={{ color: '#D4D4D8' }} size={24} />
            <div className="text-left flex-1">
              <div style={{ color: '#F3F4F6' }}>Routines</div>
              <div style={{ color: '#A1A1AA' }} className="text-sm">Schedule wake & sleep times</div>
            </div>
          </div>
        </Button>

        <Button
          onClick={() => onNavigate('rules')}
          className="w-full h-auto justify-start"
          style={secondaryButtonStyle}
        >
          <div className="flex items-center gap-2 px-4 py-4">
            <Shield style={{ color: '#D4D4D8' }} size={24} />
            <div className="text-left flex-1">
              <div style={{ color: '#F3F4F6' }}>Rules</div>
              <div style={{ color: '#A1A1AA' }} className="text-sm">Set gentle boundaries & nudges</div>
            </div>
          </div>
        </Button>

        <Button
          onClick={() => onNavigate('preview')}
          className="w-full"
          style={ctaButtonStyle}
        >
          Preview Tomorrow's Wake-Up
        </Button>
      </div>
    </div>
  );
};

// Routine Setup Screen
const RoutineScreen = ({ onBack, routine, setRoutine, personality }) => {
  const secondaryButtonStyle = {
    backgroundColor: '#FFFFFF0D',
    border: '1px solid #FFFFFF1A',
    borderRadius: '24px',
    backdropFilter: 'blur(16px)',
    color: '#F3F4F6',
    transition: 'all 120ms ease',
  };

  const inputStyle = {
    backgroundColor: '#FFFFFF0D',
    border: '1px solid #FFFFFF1A',
    borderRadius: '12px',
    color: '#F3F4F6',
    backdropFilter: 'blur(8px)',
  };

  const hasPersonality = personality && personality.tone;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          style={{ color: '#A1A1AA' }}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ color: '#F3F4F6' }}>Routine Setup</h1>
      </div>

      {/* Show lamp if personality is selected */}
      {hasPersonality && (
        <LampPreview 
          personality={personality} 
          hasPersonality={hasPersonality}
          onTap={() => {}}
        />
      )}

      <GlassCard className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label style={{ color: '#F3F4F6' }} className="mb-2 block">Wake Time</Label>
            <Input
              type="time"
              value={routine.wakeTime}
              onChange={(e) => setRoutine({...routine, wakeTime: e.target.value})}
              style={inputStyle}
            />
          </div>
          <div>
            <Label style={{ color: '#F3F4F6' }} className="mb-2 block">Sleep Time</Label>
            <Input
              type="time"
              value={routine.sleepTime}
              onChange={(e) => setRoutine({...routine, sleepTime: e.target.value})}
              style={inputStyle}
            />
          </div>
        </div>

        <div>
          <Label style={{ color: '#F3F4F6' }} className="mb-2 block">Classes/Meetings</Label>
          <Textarea
            placeholder="Add your schedule (e.g., Math class 8:00 AM Mon/Wed/Fri)"
            value={routine.schedule}
            onChange={(e) => setRoutine({...routine, schedule: e.target.value})}
            style={inputStyle}
            className="placeholder:text-zinc-400"
            rows={4}
          />
        </div>
      </GlassCard>

      <Button 
        onClick={onBack} 
        className="w-full"
        style={secondaryButtonStyle}
      >
        Save & Continue
      </Button>
    </div>
  );
};

// Rules Library Screen
const RulesScreen = ({ onBack, rules, setRules, personality }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customRuleText, setCustomRuleText] = useState('');
  
  const presetRules = [
    "Don't let me scroll TikTok before bed if I have an 8am class",
    "Remind me to wind down 30 minutes before sleep time",
    "Suggest putting phone away if it's past bedtime",
    "Encourage morning routine if wake time is early",
  ];

  const toggleRule = (rule) => {
    const newRules = rules.includes(rule)
      ? rules.filter(r => r !== rule)
      : [...rules, rule];
    setRules(newRules);
  };

  const handleSaveCustomRule = () => {
    if (customRuleText.trim()) {
      setRules([...rules, customRuleText.trim()]);
      setCustomRuleText('');
      setIsDialogOpen(false);
      toast.success("Custom rule added successfully!", {
        duration: 2000,
      });
    }
  };

  const handleCancelCustomRule = () => {
    setCustomRuleText('');
    setIsDialogOpen(false);
  };

  const secondaryButtonStyle = {
    backgroundColor: '#FFFFFF0D',
    border: '1px solid #FFFFFF1A',
    borderRadius: '24px',
    backdropFilter: 'blur(16px)',
    color: '#F3F4F6',
    transition: 'all 120ms ease',
  };

  const primaryButtonStyle = {
    background: 'linear-gradient(90deg, #6C7BFF 0%, #3B82F6 100%)',
    color: '#0B0B0F',
    border: 'none',
    borderRadius: '24px',
    padding: '12px 20px',
    transition: 'all 120ms ease',
  };

  const hasPersonality = personality && personality.tone;

  return (
    <div className="space-y-6 pt-[24px] pr-[24px] pb-[80px] pl-[24px]">
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          style={{ color: '#A1A1AA' }}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ color: '#F3F4F6' }}>Rules Library</h1>
      </div>

      {/* Show lamp if personality is selected */}
      {hasPersonality && (
        <LampPreview 
          personality={personality} 
          hasPersonality={hasPersonality}
          onTap={() => {}}
        />
      )}

      <GlassCard className="p-6 space-y-4">
        <h3 style={{ color: '#F3F4F6' }} className="mb-4">Preset Nudges</h3>
        {presetRules.map((rule, index) => (
          <div
            key={index}
            className="p-4 rounded-xl cursor-pointer transition-all"
            style={rules.includes(rule) ? {
              backgroundColor: 'rgba(108, 123, 255, 0.15)',
              border: '1px solid rgba(108, 123, 255, 0.3)'
            } : {
              backgroundColor: '#FFFFFF0D',
              border: '1px solid #FFFFFF1A'
            }}
            onClick={() => toggleRule(rule)}
          >
            <p style={{ color: '#F3F4F6' }}>{rule}</p>
          </div>
        ))}

        {/* Display Custom Rules */}
        {rules.filter(rule => !presetRules.includes(rule)).map((customRule, index) => (
          <div
            key={`custom-${index}`}
            className="p-4 rounded-xl cursor-pointer transition-all"
            style={{
              backgroundColor: 'rgba(108, 123, 255, 0.15)',
              border: '1px solid rgba(108, 123, 255, 0.3)'
            }}
            onClick={() => toggleRule(customRule)}
          >
            <div className="flex items-start justify-between">
              <p style={{ color: '#F3F4F6' }} className="flex-1">{customRule}</p>
              <Badge 
                className="text-xs ml-2 rounded-full"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#A1A1AA',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}
              >
                Custom
              </Badge>
            </div>
          </div>
        ))}
      </GlassCard>

      <Button 
        onClick={() => setIsDialogOpen(true)}
        className="w-full"
        style={primaryButtonStyle}
      >
        <Plus size={16} className="mr-2" />
        Add Custom Rule
      </Button>

      <Button 
        onClick={onBack} 
        className="w-full"
        style={secondaryButtonStyle}
      >
        Save & Continue
      </Button>

      {/* Custom Rule Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent 
          className="max-w-md mx-auto"
          style={{
            backgroundColor: '#FFFFFF0D',
            border: '1px solid #FFFFFF1A',
            borderRadius: '24px',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 8px 24px -6px rgba(0, 0, 0, 0.4), 0 2px 8px 0 rgba(0, 0, 0, 0.2)'
          }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: '#F3F4F6' }}>Create Custom Rule</DialogTitle>
            <DialogDescription style={{ color: '#A1A1AA' }}>
              Add a personalized boundary or nudge to help Mornova support your routine.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label style={{ color: '#F3F4F6' }} className="mb-2 block text-sm">Describe your custom rule or boundary</Label>
              <Textarea
                value={customRuleText}
                onChange={(e) => setCustomRuleText(e.target.value)}
                placeholder="e.g., Don't let me use social media after 10 PM on weekdays"
                style={{
                  backgroundColor: '#FFFFFF0D',
                  border: '1px solid #FFFFFF1A',
                  borderRadius: '12px',
                  color: '#F3F4F6',
                  backdropFilter: 'blur(8px)',
                }}
                className="placeholder:text-zinc-400 resize-none"
                rows={3}
              />
            </div>
            <p style={{ color: '#71717A' }} className="text-xs">
              Tip: Be specific about when and what you want Mornova to remind you about.
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button
              onClick={handleCancelCustomRule}
              style={secondaryButtonStyle}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveCustomRule}
              disabled={!customRuleText.trim()}
              style={{
                ...primaryButtonStyle,
                opacity: !customRuleText.trim() ? 0.5 : 1,
                cursor: !customRuleText.trim() ? 'not-allowed' : 'pointer'
              }}
            >
              Add Rule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Preview Screen
const PreviewScreen = ({ onBack, onActivate, personality, routine, rules }) => {
  
  const mockMessages = [
    { type: 'mornova', text: `Good morning! ${personality.tone === 'Playful' ? '🌟' : personality.tone === 'Calm' ? '🌅' : '☀️'} Ready to start your day?`, style: { fontFamily: 'Futura, sans-serif' } },
    { type: 'user', text: "Not really... 5 more minutes?" },
    { type: 'mornova', text: personality.tone === 'Playful' 
      ? "I hear you! But remember, you have that 8am class. How about we start with some gentle light?" 
      : personality.tone === 'Calm'
      ? "I understand. Let me gradually increase the light to help you wake naturally."
      : "Your 8am class starts soon. Time to get moving!"
    }
  ];

  const primaryCTAStyle = {
    background: 'linear-gradient(90deg, #FFB27A 0%, #FFC87F 100%)',
    color: '#111827',
    border: 'none',
    borderRadius: '9999px',
    padding: '16px 24px',
  };

  const hasPersonality = personality && personality.tone;

  return (
    <div className="space-y-6 pt-[24px] pr-[24px] pb-[80px] pl-[24px]">
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          style={{ color: '#A1A1AA' }}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ color: '#F3F4F6' }}>Preview & Review</h1>
      </div>

      {/* Show lamp if personality is selected */}
      {hasPersonality && (
        <LampPreview 
          personality={personality} 
          hasPersonality={hasPersonality}
          onTap={() => {}}
        />
      )}

      {/* Chat Preview with Sunrise Mode styling */}
      <div 
        className="p-6 rounded-3xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #FFF2E0 0%, #FCEBF8 50%, #EEF2FF 100%)',
          border: '1px solid rgba(255, 178, 122, 0.3)',
          boxShadow: '0 8px 24px -6px rgba(255, 178, 122, 0.2), 0 2px 8px 0 rgba(255, 178, 122, 0.1)'
        }}
      >
        <h3 style={{ color: '#0F172A' }} className="mb-4">Chat Preview</h3>
        <div className="space-y-3">
          {mockMessages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className="max-w-xs p-3 rounded-2xl"
                style={msg.type === 'user' ? {
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  color: '#0F172A'
                } : {
                  backgroundColor: 'rgba(255, 178, 122, 0.7)',
                  color: '#111827'
                }}
              >
                <p className="text-sm" style={msg.style}>{msg.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settings Summary */}
      <GlassCard className="p-6 space-y-4">
        <h3 style={{ color: '#F3F4F6' }} className="mb-4">Your Settings</h3>
        
        <div className="space-y-3">
          <div>
            <span style={{ color: '#A1A1AA' }}>Personality:</span>
            <span style={{ color: '#F3F4F6' }} className="ml-2">{personality.tone}</span>
          </div>
          
          <div>
            <span style={{ color: '#A1A1AA' }}>Schedule:</span>
            <span style={{ color: '#F3F4F6' }} className="ml-2">
              Wake {routine.wakeTime || '7:00'} • Sleep {routine.sleepTime || '22:30'}
            </span>
          </div>
          
          <div>
            <span style={{ color: '#A1A1AA' }}>Active Rules:</span>
            <span style={{ color: '#F3F4F6' }} className="ml-2">{rules.length} selected</span>
          </div>
        </div>
      </GlassCard>

      <Button
        onClick={onActivate}
        className="w-full"
        style={primaryCTAStyle}
      >
        ✨ Activate Mornova
      </Button>
    </div>
  );
};

// Main App Component
export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  
  // App State
  const [personality, setPersonality] = useState({
    tone: 'Friendly',
    traits: []
  });
  const [routine, setRoutine] = useState({
    wakeTime: '07:00',
    sleepTime: '22:30',
    schedule: ''
  });
  const [rules, setRules] = useState([]);

  const handleActivate = () => {
    toast.success("Mornova activated! Your settings have been saved.", {
      duration: 3000,
    });
    setCurrentScreen('home');
  };

  // All screens use Night Mode for consistency
  const isNightMode = true;
  const toggleMode = () => {}; // No-op since we control mode based on screen

  const renderScreen = () => {
    switch (currentScreen) {
      case 'routine':
        return <RoutineScreen onBack={() => setCurrentScreen('home')} routine={routine} setRoutine={setRoutine} personality={personality} />;
      case 'rules':
        return <RulesScreen onBack={() => setCurrentScreen('home')} rules={rules} setRules={setRules} personality={personality} />;
      case 'preview':
        return <PreviewScreen onBack={() => setCurrentScreen('home')} onActivate={handleActivate} personality={personality} routine={routine} rules={rules} />;
      default:
        return <HomeScreen onNavigate={setCurrentScreen} personality={personality} setPersonality={setPersonality} />;
    }
  };

  return (
    <ThemeContext.Provider value={{ isNightMode, toggleMode }}>
      <div 
        className="min-h-screen relative overflow-hidden"
        style={{
          backgroundColor: '#0A0A0E'
        }}
      >
        {/* Night mode gradient layers */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 50%, #12121A 0%, #08080C 100%)',
            zIndex: 1
          }}
        />
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, #F6E6D9 0%, #EDE7F6 100%)',
            opacity: 0.03,
            mixBlendMode: 'overlay',
            zIndex: 2
          }}
        />
        
        <WavyBackground />
        <div className="relative z-10 max-w-sm mx-auto min-h-screen">
          {renderScreen()}
        </div>
        <Toaster />
      </div>
    </ThemeContext.Provider>
  );
}
