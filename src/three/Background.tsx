"use client";

import { useEffect, useRef } from "react";

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });
  const scrollRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    // Particles
    interface BgParticle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      speed: number;
      drift: number;
    }

    const particles: BgParticle[] = [];
    const PARTICLE_COUNT = 80;

    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        particles.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.1 - 0.05,
          size: 0.5 + Math.random() * 1.5,
          alpha: 0.05 + Math.random() * 0.2,
          speed: 0.3 + Math.random() * 0.5,
          drift: Math.random() * Math.PI * 2,
        });
      }
    };
    initParticles();

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      initParticles();
    };
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX / w;
      mouseRef.current.targetY = e.clientY / h;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, w, h);

      // Lerp mouse
      const m = mouseRef.current;
      m.x += (m.targetX - m.x) * 0.02;
      m.y += (m.targetY - m.y) * 0.02;

      // ---- LAYER 1: Animated gradient ----
      const scrollPct = Math.min(scrollRef.current / (document.body.scrollHeight - h), 1);
      const gradPhase = tick * 0.001 + scrollPct * 2;

      // Subtle shift with mouse
      const gradX = w * (0.3 + m.x * 0.4);
      const gradY = h * (0.2 + m.y * 0.3 + Math.sin(gradPhase) * 0.1);

      const grad = ctx.createRadialGradient(gradX, gradY, 0, gradX, gradY, Math.max(w, h) * 0.8);
      grad.addColorStop(0, "rgba(25, 15, 45, 0.5)");
      grad.addColorStop(0.35, "rgba(12, 8, 24, 0.3)");
      grad.addColorStop(0.7, "rgba(5, 5, 8, 0.1)");
      grad.addColorStop(1, "rgba(5, 5, 8, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Secondary soft glow that follows mouse
      const glow2 = ctx.createRadialGradient(
        w * m.x, h * m.y, 0,
        w * m.x, h * m.y, 300
      );
      glow2.addColorStop(0, "rgba(160, 140, 255, 0.03)");
      glow2.addColorStop(1, "rgba(160, 140, 255, 0)");
      ctx.fillStyle = glow2;
      ctx.fillRect(0, 0, w, h);

      // ---- LAYER 2: Particles ----
      const scrollOffset = scrollRef.current * 0.05;
      particles.forEach((p) => {
        p.drift += 0.003;
        p.x += p.vx + Math.sin(p.drift) * 0.1;
        p.y += p.vy - scrollOffset * 0.001;

        // Mouse influence (very subtle)
        const mdx = (m.x - 0.5) * 15;
        const mdy = (m.y - 0.5) * 15;
        p.x += mdx * 0.002;
        p.y += mdy * 0.002;

        // Wrap around
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        const twinkle = 0.6 + 0.4 * Math.sin(tick * 0.02 + p.drift * 5);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 190, 255, ${p.alpha * twinkle})`;
        ctx.fill();
      });

      frameRef.current = requestAnimationFrame(render);
    };

    frameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />
      {/* Layer 3: Noise overlay */}
      <div className="noise" />
    </div>
  );
}
