import { useEffect, useRef, useCallback, useState } from 'react';
import { useTheme } from 'next-themes';

interface Star {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
}

interface AntigravityStarsProps {
  starCount?: number;
  repulsionRadius?: number;
  repulsionForce?: number;
  returnSpeed?: number;
  maxConnectionDistance?: number;
  showConnections?: boolean;
}

export function AntigravityStars({
  starCount = 150,
  repulsionRadius = 300,
  repulsionForce = 50,
  returnSpeed = 0.03,
  maxConnectionDistance = 120,
  showConnections = true,
}: AntigravityStarsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number>(0);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Wait for theme to be available
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get theme-aware colors
  const getStarColor = useCallback((alpha: number) => {
    const isDark = resolvedTheme === 'dark';
    if (isDark) {
      return `rgba(255, 255, 255, ${alpha})`;
    } else {
      return `rgba(0, 0, 0, ${alpha * 0.7})`;
    }
  }, [resolvedTheme]);

  const getConnectionColor = useCallback((opacity: number) => {
    const isDark = resolvedTheme === 'dark';
    if (isDark) {
      return `rgba(255, 255, 255, ${opacity})`;
    } else {
      return `rgba(0, 0, 0, ${opacity * 0.5})`;
    }
  }, [resolvedTheme]);

  // Initialize stars
  const initStars = useCallback((width: number, height: number) => {
    const stars: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      stars.push({
        x,
        y,
        originalX: x,
        originalY: y,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.4,
      });
    }
    starsRef.current = stars;
  }, [starCount]);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    const mouse = mouseRef.current;
    const stars = starsRef.current;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Update and draw stars
    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];

      // Calculate distance from mouse
      const dx = star.x - mouse.x;
      const dy = star.y - mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Apply strong repulsion force if mouse is nearby
      if (distance < repulsionRadius && distance > 0) {
        const force = (repulsionRadius - distance) / repulsionRadius;
        const angle = Math.atan2(dy, dx);
        // Strong repulsion - multiply force significantly
        star.vx += Math.cos(angle) * force * repulsionForce * 0.15;
        star.vy += Math.sin(angle) * force * repulsionForce * 0.15;
      }

      // Apply elastic return to original position
      const returnDx = star.originalX - star.x;
      const returnDy = star.originalY - star.y;
      star.vx += returnDx * returnSpeed;
      star.vy += returnDy * returnSpeed;

      // Apply friction
      star.vx *= 0.92;
      star.vy *= 0.92;

      // Update position
      star.x += star.vx;
      star.y += star.vy;

      // Keep stars within bounds (with wrapping for original positions)
      if (star.x < 0) star.x = 0;
      if (star.x > width) star.x = width;
      if (star.y < 0) star.y = 0;
      if (star.y > height) star.y = height;

      // Draw star with theme-aware color
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = getStarColor(star.alpha);
      ctx.fill();
    }

    // Draw connections between nearby stars
    if (showConnections) {
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const star1 = stars[i];
          const star2 = stars[j];
          const dx = star1.x - star2.x;
          const dy = star1.y - star2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxConnectionDistance) {
            const opacity = (1 - distance / maxConnectionDistance) * 0.2;
            ctx.beginPath();
            ctx.moveTo(star1.x, star1.y);
            ctx.lineTo(star2.x, star2.y);
            ctx.strokeStyle = getConnectionColor(opacity);
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [repulsionRadius, repulsionForce, returnSpeed, maxConnectionDistance, showConnections, getStarColor, getConnectionColor]);

  // Handle resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use window dimensions for fixed canvas
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    canvas.width = width;
    canvas.height = height;

    // Reinitialize stars if needed
    if (starsRef.current.length === 0) {
      initStars(width, height);
    }
  }, [initStars]);

  // Handle mouse move - attached to window for global tracking
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = {
      x: e.clientX,
      y: e.clientY,
    };
  }, []);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -1000, y: -1000 };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !mounted) return;

    // Initial setup
    handleResize();
    initStars(window.innerWidth, window.innerHeight);

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    // Event listeners - attach to window for global mouse tracking
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [animate, handleResize, handleMouseMove, handleMouseLeave, initStars, mounted]);

  if (!mounted) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        // DEBUG: Remove this border after confirming it renders
        // border: '2px solid red',
      }}
    />
  );
}
