"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const nameContainerRef = useRef<HTMLDivElement>(null);
  const secondaryTextRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const frameRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  interface Particle {
    x: number;
    y: number;
    size: number;
    alpha: number;
    targetAlpha: number;
    angle: number;
    speed: number;
    orbit: number;
  }

  const createParticles = useCallback((cx: number, cy: number, count: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const orbit = 30 + Math.pow(Math.random(), 2) * 500; 
      const speed = (0.00015 + Math.random() * 0.0005);
      
      particles.push({
        x: cx,
        y: cy,
        size: 0.5 + Math.random() * 1.2,
        alpha: 0,
        targetAlpha: 0.05 + Math.random() * 0.25, // Start soft
        angle,
        speed,
        orbit,
      });
    }
    return particles; 
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const dotEl = dotRef.current;
    const contentEl = contentRef.current;
    const secondaryTextEl = secondaryTextRef.current;
    const nameChars = gsap.utils.toArray<HTMLElement>('.name-char');

    if (!container || !canvas || !dotEl || !contentEl || !secondaryTextEl) return;

    document.body.style.overflow = "hidden";
    const ctx = canvas.getContext("2d")!;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const cx = w / 2;
    const cy = h / 2;

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    particlesRef.current = createParticles(cx, cy, 200); // reduced slightly for performance with shadowBlur

    const state = {
      galaxyExpand: 0,
      cameraZoom: 1,
      rotation: 0,
      glowIntensity: 0.3, // Soft glow before SAMEER
      glowScale: 1,
      textScale: 1
    };

    // Initial states
    gsap.set(dotEl, { scale: 0, opacity: 0 });
    gsap.set(nameChars, { opacity: 0, filter: "blur(10px)", y: 20, scale: 0.8 });
    gsap.set(secondaryTextEl, { opacity: 0, filter: "blur(6px)", y: 20 });
    gsap.set(contentEl, { scale: 1, opacity: 1 });

    const tl = gsap.timeline({
      onComplete: () => {
        cancelAnimationFrame(frameRef.current);
        if (container) container.style.display = "none";
        document.body.style.overflow = "auto";
        window.dispatchEvent(new Event("preloaderComplete"));
      }
    });

    // STAGE 1: VOID (0s -> 1s)
    tl.to(dotEl, { scale: 1, opacity: 1, duration: 0.8, ease: "power4.out" }, 0);
    tl.to(dotEl, { scale: 1.3, duration: 0.5, yoyo: true, repeat: 1, ease: "power2.inOut" }, 0.2);

    // STAGE 2: GALAXY FORMATION (1s -> 2.8s)
    tl.to(dotEl, { scale: 60, opacity: 0, duration: 1.8, ease: "expo.out" }, 1);
    tl.to(state, { 
      galaxyExpand: 1, 
      duration: 1.8, 
      ease: "power4.out"
    }, 1);

    // STAGE 3: SAMEER POP-UP & GLOW BOOST (2.2s -> ...)
    // Synced perfectly with the midpoint of the galaxy expansion
    tl.to(nameChars, {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      scale: 1,
      duration: 1.5,
      stagger: 0.04, 
      ease: "power4.out"
    }, 2.2);

    // Boost glow intensity and scale smoothly after SAMEER appears
    tl.to(state, {
      glowIntensity: 1.0,
      glowScale: 1.1,
      duration: 2.5,
      ease: "power4.out"
    }, 2.2);

    // Subtle pulse for the glow
    tl.to(state, {
      glowIntensity: 1.2,
      duration: 1.5,
      yoyo: true,
      repeat: -1,
      ease: "power2.inOut"
    }, 4.7);

    // STAGE 4: SECONDARY TEXT REVEAL (2.6s -> 4.1s)
    // ~0.3s-0.4s delay after SAMEER begins
    tl.to(secondaryTextEl, {
      opacity: 0.7, // Lighter opacity
      filter: "blur(0px)",
      y: 0,
      duration: 1.5,
      ease: "power4.out"
    }, 2.6);

    // STAGE 5: HOLD MOMENT / BREATHING (3.5s -> 5.0s)
    tl.to(state, {
      textScale: 1.02,
      duration: 1.5,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    }, 3.5);

    // STAGE 6: TRANSITION TO HERO (5.0s -> 6.5s)
    // 1. Secondary text fades first
    tl.to(secondaryTextEl, {
      opacity: 0,
      filter: "blur(4px)",
      duration: 0.8,
      ease: "power4.out"
    }, 5.0);

    // 2. Main text fades and scales slightly next
    tl.to(nameChars, {
      opacity: 0,
      filter: "blur(6px)",
      scale: 1.1,
      duration: 1.0,
      ease: "power4.out"
    }, 5.2);

    // 3. Background zoom and fade transition (last)
    tl.to(state, {
      cameraZoom: 3, // cinematic expansion
      rotation: Math.PI / 8,
      duration: 1.5,
      ease: "expo.inOut" // smooth, non-harsh zoom
    }, 5.4);

    tl.to(container, {
      opacity: 0,
      duration: 1.5,
      ease: "expo.inOut"
    }, 5.4);

    // CANVAS RENDER LOOP
    const render = () => {
      // Deep black base with very subtle trail
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.fillRect(0, 0, w, h);

      if (state.galaxyExpand > 0) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(state.rotation);
        ctx.translate(-cx, -cy);

        // Core Glow (White)
        const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 200 * state.galaxyExpand * state.cameraZoom * state.glowScale);
        coreGrad.addColorStop(0, `rgba(255, 255, 255, ${0.06 * state.glowIntensity})`);
        coreGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        
        ctx.globalCompositeOperation = "screen";
        ctx.fillStyle = coreGrad;
        ctx.fillRect(0, 0, w, h);

        // Outer Glow (Soft blue/purple haze)
        const outerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 450 * state.galaxyExpand * state.cameraZoom * state.glowScale);
        outerGrad.addColorStop(0, `rgba(160, 180, 255, ${0.12 * state.glowIntensity})`);
        outerGrad.addColorStop(0.5, `rgba(40, 30, 80, ${0.04 * state.glowIntensity})`);
        outerGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        
        ctx.fillStyle = outerGrad;
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = "source-over"; 

        // Particles with canvas shadow blur for soft glow
        ctx.shadowBlur = 12 * state.glowIntensity * state.cameraZoom;
        ctx.shadowColor = "rgba(180, 200, 255, 0.8)";

        particlesRef.current.forEach((p) => {
          p.angle += p.speed;

          const currentOrbit = p.orbit * (0.2 + state.galaxyExpand * 0.8) * state.cameraZoom;

          p.x = cx + Math.cos(p.angle) * currentOrbit;
          p.y = cy + Math.sin(p.angle) * currentOrbit * 0.8; 

          if (state.galaxyExpand > 0) {
            p.alpha = Math.min(p.alpha + 0.008, p.targetAlpha * state.glowIntensity);
          }
          
          const finalAlpha = p.alpha * (1 - (state.cameraZoom - 1) * 0.8); // fade out slower on zoom
          const finalSize = p.size * state.cameraZoom;

          if (finalAlpha > 0.01 && finalSize > 0.1 && p.x > -50 && p.x < w + 50 && p.y > -50 && p.y < h + 50) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, finalSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(230, 240, 255, ${finalAlpha})`;
            ctx.fill();
          }
        });

        ctx.shadowBlur = 0; // reset shadow for other renders
        
        ctx.restore();
      }

      // Very Subtle Noise
      if (state.galaxyExpand > 0) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.01)";
        for(let i=0; i< (w * h) / 6000; i++) {
          const nx = Math.random() * w;
          const ny = Math.random() * h;
          ctx.fillRect(nx, ny, 1, 1);
        }
      }

      // Apply synchronized text scale breathing
      if (contentEl) {
        contentEl.style.transform = `scale(${state.textScale})`;
      }

      frameRef.current = requestAnimationFrame(render);
    };

    frameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", handleResize);
      tl.kill();
      gsap.killTweensOf(state);
      document.body.style.overflow = "auto";
    };
  }, [createParticles]);

  // Removed full stop for cleanest typography
  const name = "SAMEER".split("");

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "#000000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, zIndex: 1 }}
      />

      {/* Central Void Dot */}
      <div
        ref={dotRef}
        style={{
          position: "absolute",
          width: "3px",
          height: "3px",
          borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 0 20px 8px rgba(180, 200, 255, 0.3)",
          zIndex: 5,
        }}
      />

      <div 
        ref={contentRef} 
        style={{ 
          position: "relative", 
          zIndex: 10, 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <div 
          ref={nameContainerRef} 
          style={{ 
            display: "flex", 
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "nowrap",
          }}
        >
          {name.map((char, i) => (
            <span
              key={i}
              className="name-char"
              style={{
                fontSize: "clamp(4rem, 10vw, 8rem)",
                fontWeight: 800,
                color: "#ffffff",
                fontFamily: "var(--font-space)",
                lineHeight: 1.2,
                display: "inline-block",
                margin: "0 0.04em",
                textShadow: "0px 0px 30px rgba(255, 255, 255, 0.4)", // Soft glow behind strong white text
                willChange: "transform, opacity, filter"
              }}
            >
              {char}
            </span>
          ))}
        </div>
        
        {/* Secondary Text Element */}
        <div
          ref={secondaryTextRef}
          style={{
            marginTop: "30px", // 30px gap
            fontSize: "0.85rem",
            letterSpacing: "0.4em",
            color: "rgba(255, 255, 255, 0.9)", // Dimmer white
            fontFamily: "var(--font-space)",
            textTransform: "uppercase",
            textShadow: "0px 0px 15px rgba(180, 200, 255, 0.4)", // Subtle glow
            willChange: "transform, opacity, filter"
          }}
        >
          Initializing Experience
        </div>
      </div>
    </div>
  );
}
