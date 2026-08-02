import { useState, useCallback } from 'react';
import './GlitchText.css';

interface GlitchTextProps {
  text: string;
  className?: string;
  triggerOnHover?: boolean;
}

export default function GlitchText({
  text,
  className = '',
  triggerOnHover = true
}: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);

  const triggerGlitch = useCallback(() => {
    if (isGlitching) return;
    setIsGlitching(true);
    setTimeout(() => {
      setIsGlitching(false);
    }, 450);
  }, [isGlitching]);

  return (
    <span
      className={`glitch-text-wrapper ${isGlitching ? 'is-glitching' : ''} ${className}`}
      onMouseEnter={triggerOnHover ? triggerGlitch : undefined}
      data-text={text}
    >
      {text}
    </span>
  );
}
