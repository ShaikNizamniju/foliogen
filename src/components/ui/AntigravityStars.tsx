import { useEffect, useRef, useCallback } from 'react';

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
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.3,
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

      // Apply repulsion force if mouse is nearby
      if (distance < repulsionRadius && distance > 0) {
        const force = (repulsionRadius - distance) / repulsionRadius;
        const angle = Math.atan2(dy, dx);
        star.vx += Math.cos(angle) * force * repulsionForce * 0.1;
        star.vy += Math.sin(angle) * force * repulsionForce * 0.1;
      }

      // Apply elastic return to original position
      const returnDx = star.originalX - star.x;
      const returnDy = star.originalY - star.y;
      star.vx += returnDx * returnSpeed;
      star.vy += returnDy * returnSpeed;

      // Apply friction
      star.vx *= 0.95;
      star.vy *= 0.95;

      // Update position
      star.x += star.vx;
      star.y += star.vy;

      // Keep stars within bounds (with wrapping for original positions)
      if (star.x < 0) star.x = 0;
      if (star.x > width) star.x = width;
      if (star.y < 0) star.y = 0;
      if (star.y > height) star.y = height;

      // Draw star
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
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
            const opacity = (1 - distance / maxConnectionDistance) * 0.15;
            ctx.beginPath();
            ctx.moveTo(star1.x, star1.y);
            ctx.lineTo(star2.x, star2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [repulsionRadius, repulsionForce, returnSpeed, maxConnectionDistance, showConnections]);

  // Handle resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const { width, height } = parent.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;

    // Reinitialize stars if dimensions changed significantly
    if (starsRef.current.length === 0) {
      initStars(width, height);
    } else {
      // Update original positions proportionally
      const scaleX = width / (canvas.width || width);
      const scaleY = height / (canvas.height || height);
      starsRef.current.forEach(star => {
        star.originalX = Math.min(star.originalX * scaleX, width);
        star.originalY = Math.min(star.originalY * scaleY, height);
      });
    }
  }, [initStars]);

  // Handle mouse move
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -1000, y: -1000 };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initial setup
    handleResize();
    initStars(canvas.width, canvas.height);

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    // Event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [animate, handleResize, handleMouseMove, handleMouseLeave, initStars]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ background: 'transparent', pointerEvents: 'none' }}
    />
  );
}
