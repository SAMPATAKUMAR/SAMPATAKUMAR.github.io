import { useEffect, useState, useRef } from 'react';
import './CustomCursor.css';

export default function CustomCursor() {
  const [isPointerFine, setIsPointerFine] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isTextHovered, setIsTextHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)');
    const checkPointer = () => setIsPointerFine(mediaQuery.matches);
    checkPointer();

    mediaQuery.addEventListener('change', checkPointer);
    return () => mediaQuery.removeEventListener('change', checkPointer);
  }, []);

  useEffect(() => {
    if (!isPointerFine) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = !!target.closest(
          'a, button, input, textarea, select, label, [role="button"], .neomorph-btn, .neomorph-pill, .neomorph-card-hover, .cursor-pointer, [data-interactive="true"]'
        );
        const isText = !isClickable && !!target.closest('p, h1, h2, h3, h4, h5, h6, span, .text-type');

        setIsHovered(isClickable);
        setIsTextHovered(isText);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    let animId: number;
    const render = () => {
      // Smooth lerp physics for trailing outer ring
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.2;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.2;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isPointerFine, isVisible]);

  if (!isPointerFine) return null;

  return (
    <div className={`custom-cursor-container ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Outer Glowing Ring */}
      <div
        ref={ringRef}
        className={`custom-cursor-ring ${isHovered ? 'custom-cursor-ring--hover' : ''} ${
          isClicking ? 'custom-cursor-ring--clicking' : ''
        } ${isTextHovered ? 'custom-cursor-ring--text' : ''}`}
      />

      {/* Inner Glowing Pointer Dot */}
      <div
        ref={dotRef}
        className={`custom-cursor-dot ${isHovered ? 'custom-cursor-dot--hover' : ''} ${
          isClicking ? 'custom-cursor-dot--clicking' : ''
        }`}
      />
    </div>
  );
}
