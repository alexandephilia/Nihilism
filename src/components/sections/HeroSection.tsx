import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/statusbadge";
import { SiCardano } from "react-icons/si";
import { motion } from "framer-motion";
import { Linkedin, Mail, User } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useEffect, useCallback, useRef } from "react";

interface SocialLink {
  href: string;
  icon: React.ReactNode;
  label: string;
}

interface HeroSectionProps {
  name: string;
  title: React.ReactNode;
  subtitle: string;
  profileImage: string;
  socialLinks?: SocialLink[];
}

type MotionStyle = {
  width?: string;
  height?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  transform?: string;
  backfaceVisibility?: 'visible' | 'hidden';
  WebkitBackfaceVisibility?: 'visible' | 'hidden';
  willChange?: string;
  pointerEvents?: 'none' | 'auto';
  cursor?: string;
  isolation?: 'auto' | 'isolate';
  perspective?: string;
};

export const HeroSection = ({
  name,
  title,
  subtitle,
  profileImage,
  socialLinks = [
    {
      href: "https://linkedin.com/in/your-profile",
      icon: <Linkedin className="h-5 w-5" />,
      label: "LinkedIn"
    },
    {
      href: "mailto:0xnihilist@gmail.com",
      icon: <Mail className="h-5 w-5" />,
      label: "Email"
    },
    {
      href: "resume.pdf",
      icon: <User className="h-5 w-5" />,
      label: "Resume"
    }
  ]
}: HeroSectionProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleImageClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBlurred(prev => !prev);
  }, []);

  useEffect(() => {
    if (!isBlurred) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (imageRef.current && !imageRef.current.contains(e.target as Node)) {
        setIsBlurred(false);
      }
    };

    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [isBlurred]);

  // Enhanced image variants with smoother transitions
  const imageContainerVariants = {
    initial: {
      opacity: 0,
      scale: 0.1,
      filter: "blur(20px)",
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 1.2,
        ease: [0.34, 1.56, 0.64, 1],
        scale: {
          type: "spring",
          damping: 15,
          stiffness: 70,
          restDelta: 0.001
        },
        opacity: {
          duration: 0.8
        },
        filter: {
          duration: 0.8
        }
      }
    }
  };

  // Separate transition config for hover effects
  const hoverTransition = {
    type: "spring",
    stiffness: 300,
    damping: 25,
    mass: 0.5,
    restDelta: 0.001
  };

  const imageStyle: MotionStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    willChange: 'transform, filter',
    pointerEvents: 'none'
  };

  return (
    <section className="container min-h-[70vh] pt-24 md:pt-32 pb-12 relative flex flex-col items-center justify-between">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,hsl(var(--foreground))_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.15] blur-[0.5px]" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent opacity-90" />
      <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-background to-transparent opacity-90" />
      <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-background to-transparent opacity-90" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center text-center space-y-8">
        <div className="flex items-center gap-2 mb-2 opacity-0 animate-[fadeInBlur_0.8s_ease_forwards] [animation-delay:300ms]">
          <StatusBadge 
            status="Working on"
            icon={<SiCardano className="h-4 w-4" />}
            text="Existence"
          />
        </div>
        
        <div className="relative">
          <motion.div 
            className="absolute -inset-0.5 bg-gradient-to-r from-zinc-800 to-zinc-800 dark:from-[#f97316] dark:via-[#654127] dark:to-[#0ea5e9] rounded-full blur opacity-75 transition duration-1000 animate-tilt"
            animate={{
              scale: isHovered ? 1.1 : 1,
              opacity: isHovered ? 0.85 : 0.75
            }}
            transition={hoverTransition}
            style={{
              willChange: 'transform, opacity',
              backfaceVisibility: 'hidden'
            }}
          />
          <motion.div
            ref={imageRef}
            className="relative w-28 h-28 overflow-hidden rounded-full"
            variants={imageContainerVariants}
            initial="initial"
            animate="animate"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleImageClick}
            style={{
              cursor: 'pointer',
              willChange: 'transform, filter',
              isolation: 'isolate',
              transform: 'translateZ(0)',
              perspective: '1000px',
              backfaceVisibility: 'hidden'
            }}
          >
            <motion.div 
              style={imageStyle}
              animate={{ 
                scale: isBlurred ? 1.1 : isHovered ? 1.05 : 1,
                filter: isBlurred ? "blur(3px)" : isHovered ? "blur(2px)" : "blur(0px)"
              }}
              transition={{
                ...hoverTransition,
                filter: {
                  type: "tween",
                  duration: 0.2,
                  ease: "easeInOut"
                }
              }}
            >
              <img 
                src={profileImage}
                alt="Profile memoji"
                className="w-full h-full object-cover"
                draggable={false}
              />
            </motion.div>
          </motion.div>
        </div>
        
        <div className="space-y-4">
        <h1 className="text-[2rem] md:text-[3.3rem] font-bold group hover:blur-[2px] transition-all duration-300 -mb-3">
            {typeof name === 'string' ? name.split("").map((letter, index) => (
              <span 
                key={index}
                className="font-bold font-mono inline-block hover:animate-wave transition-all duration-300 group-hover:animate-wave touch-none"
                style={{ 
                  animationDelay: `${index * 0.05}s`,
                  animationFillMode: "forwards"
                }}
              >
                {letter === " " ? "\u00A0" : letter}
              </span>
            )) : name}
          </h1>
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground max-w-[650px] animate-fade-in-up opacity-0 [animation-delay:400ms] [animation-fill-mode:forwards]">
            {title}<br />
            {subtitle}
          </p>
        </div>

        <div className="flex gap-5 animate-fade-in-up opacity-0 [animation-delay:600ms] [animation-fill-mode:forwards]">
          {socialLinks.map((link, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-11 w-11 hover:blur-[2px] transition-all duration-300 bg-background/20"
                    onClick={() => window.open(link.href, '_blank', 'noopener,noreferrer')}
                  >
                    {link.icon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-sm">{link.label}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
     {/* Scroll indicator - now positioned below buttons */}
     <div className="mt-16 animate-bounce opacity-50 pointer-events-none">
          <div className="w-6 h-10 border-2 border-foreground/20 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-foreground/20 rounded-full mt-2"></div>
          </div>
        </div>
    </section>
  );
}; 