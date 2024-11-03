import { useEffect, useState, useRef } from "react";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [magneticElement, setMagneticElement] = useState<HTMLElement | null>(null);
  const [cursorVariant, setCursorVariant] = useState<'default' | 'text' | 'link' | 'button'>('default');
  const [magneticStrength, setMagneticStrength] = useState(0);
  const lastPosition = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef<number>();

  const calculateMagneticPull = (
    mouseX: number, 
    mouseY: number, 
    elementRect: DOMRect,
    strength: number = 0.5
  ) => {
    const elementCenterX = elementRect.left + elementRect.width / 2;
    const elementCenterY = elementRect.top + elementRect.height / 2;
    
    const deltaX = mouseX - elementCenterX;
    const deltaY = mouseY - elementCenterY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    const magneticRadius = Math.max(elementRect.width, elementRect.height) * 0.8;
    
    if (distance < magneticRadius) {
      const pullStrength = Math.pow(1 - (distance / magneticRadius), 1.5);
      setMagneticStrength(pullStrength);
      
      const boundedX = Math.max(elementRect.left, Math.min(elementRect.right, mouseX));
      const boundedY = Math.max(elementRect.top, Math.min(elementRect.bottom, mouseY));
      
      return {
        x: boundedX,
        y: boundedY,
        strength: pullStrength
      };
    }
    
    setMagneticStrength(0);
    return { x: mouseX, y: mouseY, strength: 0 };
  };

  useEffect(() => {
    const isTouchDevice = () => {
      return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        // @ts-ignore
        (navigator.msMaxTouchPoints > 0));
    };

    if (isTouchDevice()) {
      return;
    }

    document.documentElement.style.cursor = 'none';
    document.body.style.cursor = 'none';
    
    const handleMouseMove = (e: MouseEvent) => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }

      animationFrameId.current = requestAnimationFrame(() => {
        if (magneticElement) {
          const rect = magneticElement.getBoundingClientRect();
          const { x, y, strength } = calculateMagneticPull(e.clientX, e.clientY, rect);
          
          setPosition({ x, y });
        } else {
          setPosition({ x: e.clientX, y: e.clientY });
        }
        setIsVisible(true);
      });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      const magnetic = target.closest('[data-magnetic="true"]');
      if (magnetic instanceof HTMLElement) {
        setMagneticElement(magnetic);
        const rect = magnetic.getBoundingClientRect();
        const { x, y } = calculateMagneticPull(e.clientX, e.clientY, rect);
        setPosition({ x, y });
      } else {
        setMagneticElement(null);
      }

      if (target.closest('button, [role="button"]')) {
        setCursorVariant('button');
        setIsHovered(true);
      } else if (target.closest('a, [data-magnetic="true"]')) {
        setCursorVariant('link');
        setIsHovered(true);
      } else if (target.closest('p, h1, h2, h3, h4, h5, h6, span')) {
        setCursorVariant('text');
        setIsHovered(false);
      } else {
        setCursorVariant('default');
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setMagneticElement(null);
      setCursorVariant('default');
    };

    const handleMouseDown = () => {
      setIsHovered(true);
      setTimeout(() => setIsHovered(false), 150);
    };

    const preventDefaultCursor = (e: Event) => {
      const target = e.target as HTMLElement;
      target.style.cursor = 'none';
      e.preventDefault();
    };

    const style = document.createElement('style');
    style.textContent = `
      @media (hover: hover) and (pointer: fine) {
        a, button, [role="button"], select, input[type="submit"], input[type="reset"], input[type="button"],
        [data-hover-effect="true"], [data-interactive="true"], .interactive {
          cursor: none !important;
        }
        * {
          cursor: none !important;
        }
      }
    `;
    document.head.appendChild(style);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("dragstart", preventDefaultCursor);
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            node.style.cursor = 'none';
          }
        });
      });
    });

    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("dragstart", preventDefaultCursor);
      observer.disconnect();
      document.head.removeChild(style);
    };
  }, []);

  if (typeof window !== 'undefined' && (
    ('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    // @ts-ignore
    (navigator.msMaxTouchPoints > 0)
  )) {
    return null;
  }

  if (!isVisible) return null;

  return (
    <div
      className={`
        fixed pointer-events-none z-[9999] mix-blend-difference
        transform -translate-x-1/2 -translate-y-1/2 will-change-transform
        transition-all duration-150
        ${cursorVariant === 'default' ? 'w-2 h-2 rounded-full bg-white' : ''}
        ${cursorVariant === 'text' ? 'w-1.5 h-1.5 rounded-full bg-white' : ''}
        ${cursorVariant === 'link' ? 'w-3 h-3 rounded-full bg-white/90 blur-[0.5px]' : ''}
        ${cursorVariant === 'button' ? 'w-4 h-4 rounded-full bg-white/80 blur-[1px]' : ''}
        ${isHovered ? 'scale-[2] mix-blend-difference' : 'scale-100'}
      `}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transition: magneticElement ? 'none' : 'transform 0.2s ease-out',
        transform: `translate(-50%, -50%) scale(${1 + magneticStrength * 0.8})`,
        filter: magneticStrength > 0 ? `blur(${magneticStrength * 1.5}px)` : 'none',
      }}
    >
      {magneticStrength > 0 && (
        <>
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(255,255,255,0.9) 0%, transparent 70%)`,
              transform: `scale(${1 + magneticStrength * 1.2})`,
              opacity: magneticStrength * 0.6,
              animation: 'pulse 1.5s ease-in-out infinite'
            }}
          />
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              border: '1px solid rgba(255,255,255,0.3)',
              transform: `scale(${1 + magneticStrength * 1.5})`,
              opacity: magneticStrength * 0.3
            }}
          />
        </>
      )}
      
      {(cursorVariant === 'link' || cursorVariant === 'button') && (
        <div 
          className="absolute inset-0 rounded-full bg-white/20"
          style={{
            animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
            opacity: magneticStrength > 0 ? 0.3 : 0.2
          }}
        />
      )}
    </div>
  );
};

export default CustomCursor; 