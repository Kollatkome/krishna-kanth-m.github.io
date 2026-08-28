import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [dotPosition, setDotPosition] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on desktop with mouse support
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      setDotPosition({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = Boolean(
          target.closest('button') ||
          target.closest('a') ||
          target.closest('[role="button"]') ||
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          window.getComputedStyle(target).cursor === 'pointer'
        );
        setIsPointer(isClickable);
      }
    };

    const onMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    let frameId: number;
    const followCursor = () => {
      setPosition(prev => ({
        x: prev.x + (dotPosition.x - prev.x) * 0.2,
        y: prev.y + (dotPosition.y - prev.y) * 0.2
      }));
      frameId = requestAnimationFrame(followCursor);
    };

    frameId = requestAnimationFrame(followCursor);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(frameId);
    };
  }, [dotPosition]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer ambient follower ring */}
      <div
        className="pointer-events-none fixed z-50 rounded-full transition-transform duration-100 ease-out hidden md:block"
        style={{
          transform: `translate3d(${position.x - (isPointer ? 24 : 16)}px, ${position.y - (isPointer ? 24 : 16)}px, 0)`,
          width: isPointer ? '48px' : '32px',
          height: isPointer ? '48px' : '32px',
          border: '1px solid rgba(139, 92, 246, 0.45)',
          backgroundColor: isPointer ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
          boxShadow: isPointer ? '0 0 15px rgba(139, 92, 246, 0.3)' : 'none',
        }}
      />
      {/* Center pinpoint */}
      <div
        className="pointer-events-none fixed z-50 rounded-full hidden md:block"
        style={{
          transform: `translate3d(${dotPosition.x - 3}px, ${dotPosition.y - 3}px, 0)`,
          width: '6px',
          height: '6px',
          backgroundColor: '#06b6d4',
          boxShadow: '0 0 8px #06b6d4',
        }}
      />
    </>
  );
};
