"use client";

import { useEffect, useRef } from "react";

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });
  const glowRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    // Config
    const dotSpacing = 17; // 16-18
    const dotRadiusBase = 1.3; // 1.2-1.4
    const waveAmplitude = 0.8; // 0.5-1 (very gentle)
    const cursorRadius = 350; // 300-400
    const cursorForce = 0.1; // 0.08-0.12
    const bulgeStrength = cursorRadius * cursorForce; // ~35
    const sparkle = false;

    interface Dot {
      bx: number; // base x
      by: number; // base y
      offset: number; // for wave phase
      speedOffset: number; // for slight parallax feel
    }

    let dots: Dot[] = [];

    const initDots = () => {
      dots = [];
      const cols = Math.ceil(w / dotSpacing) + 2;
      const rows = Math.ceil(h / dotSpacing) + 2;
      
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          dots.push({
            bx: i * dotSpacing - dotSpacing,
            by: j * dotSpacing - dotSpacing,
            offset: Math.random() * Math.PI * 2,
            speedOffset: 0.8 + Math.random() * 0.4, // slight parallax variation
          });
        }
      }
    };
    initDots();

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      initDots();
    };
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      if (glowRef.current.x === -1000) {
        glowRef.current.x = e.clientX;
        glowRef.current.y = e.clientY;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Initial mouse position centered if not moved
    mouseRef.current.targetX = w / 2;
    mouseRef.current.targetY = h / 2;
    mouseRef.current.x = w / 2;
    mouseRef.current.y = h / 2;
    glowRef.current.x = w / 2;
    glowRef.current.y = h / 2;

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, w, h);

      // Deep black base
      ctx.fillStyle = "#050508";
      ctx.fillRect(0, 0, w, h);

      // Lerp mouse (ultra smooth)
      const m = mouseRef.current;
      m.x += (m.targetX - m.x) * 0.04; // Increased smoothing (was 0.08)
      m.y += (m.targetY - m.y) * 0.04;

      // Lerp glow (delayed for premium trailing feel)
      const g = glowRef.current;
      g.x += (m.targetX - g.x) * 0.015; 
      g.y += (m.targetY - g.y) * 0.015;

      // Draw Localized Glow (Soft purple, strictly around cursor)
      const glowRadius = 200; // 160-220
      const grad = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, glowRadius);
      grad.addColorStop(0, "rgba(123, 44, 255, 0.15)"); // soft purple tone
      grad.addColorStop(0.4, "rgba(123, 44, 255, 0.06)");
      grad.addColorStop(1, "rgba(10, 10, 10, 0)"); // seamless fade
      
      ctx.globalCompositeOperation = "screen"; // beautiful soft blend
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over"; // reset

      // Draw Dots
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        
        let x = d.bx;
        let y = d.by;

        // Wave motion (slowed down, gentle)
        const timeOffset = tick * 0.005 * d.speedOffset;
        x += Math.sin(timeOffset + d.offset) * waveAmplitude;
        y += Math.cos(timeOffset + d.offset) * waveAmplitude;

        // Cursor bulge (smooth displacement)
        const dx = x - m.x;
        const dy = y - m.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < cursorRadius) {
          const force = Math.pow(1 - dist / cursorRadius, 3); // Cubic ease out for extreme smoothness
          x += (dx / dist) * force * bulgeStrength;
          y += (dy / dist) * force * bulgeStrength;
        }

        // Clean static alpha and size
        let alpha = 0.25; 
        let radius = dotRadiusBase;
        
        // Boost alpha and size softly near cursor glow
        if (dist < glowRadius) {
            const influence = 1 - dist / glowRadius;
            alpha += 0.3 * influence; // soft fade in
            radius += 0.5 * influence; // minimal size increase
        }

        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Vignette (Darker edges)
      const vignette = ctx.createRadialGradient(w/2, h/2, w*0.3, w/2, h/2, w*0.8);
      vignette.addColorStop(0, "rgba(5, 5, 8, 0)");
      vignette.addColorStop(1, "rgba(0, 0, 0, 0.8)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);

      // Very subtle noise/grain
      ctx.fillStyle = "rgba(255, 255, 255, 0.015)";
      for(let i=0; i < (w * h) / 4000; i++) {
        const nx = Math.random() * w;
        const ny = Math.random() * h;
        ctx.fillRect(nx, ny, 1, 1);
      }

      frameRef.current = requestAnimationFrame(render);
    };

    frameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, background: "#050508", pointerEvents: "none" }}>
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </div>
  );
}
