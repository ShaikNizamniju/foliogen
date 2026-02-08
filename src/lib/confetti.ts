import confetti from 'canvas-confetti';

export function triggerCelebration() {
  // First burst
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#10b981', '#22c55e', '#84cc16', '#fbbf24', '#f59e0b'],
  });

  // Second burst (delayed)
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#8b5cf6', '#a855f7', '#d946ef'],
    });
  }, 200);

  // Third burst (delayed)
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#3b82f6', '#06b6d4', '#14b8a6'],
    });
  }, 400);

  // Big finale
  setTimeout(() => {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.4 },
      startVelocity: 45,
      colors: ['#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#3b82f6'],
    });
  }, 600);
}
