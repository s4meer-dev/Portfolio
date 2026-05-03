"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Wait for preloader to finish
    const initAnimations = () => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ delay: 0.3 });

        // Tagline
        tl.fromTo(
          ".hero-tagline",
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, duration: 1, ease: "power3.out" }
        );

        // Split headline words and animate
        tl.fromTo(
          ".hero-word",
          { opacity: 0, y: 40, filter: "blur(10px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1,
            stagger: 0.12,
            ease: "power3.out",
          },
          "-=0.6"
        );

        // Subtitle
        tl.fromTo(
          ".hero-sub",
          { opacity: 0, y: 20, filter: "blur(5px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.4"
        );

        // Buttons
        tl.fromTo(
          ".hero-btn",
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
          },
          "-=0.3"
        );

        // Light sweep on headline
        tl.fromTo(
          ".hero-sweep",
          { x: "-100%" },
          { x: "200%", duration: 1.5, ease: "power2.inOut" },
          "-=0.5"
        );

        // Breathing effect
        gsap.to(".hero-glow", {
          scale: 1.03,
          opacity: 0.6,
          duration: 3,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });

        // Mouse parallax on headline
        const onMouseMove = (e: MouseEvent) => {
          const { clientX, clientY } = e;
          const xPos = (clientX / window.innerWidth - 0.5) * 30;
          const yPos = (clientY / window.innerHeight - 0.5) * 30;

          gsap.to(".hero-content", {
            x: xPos,
            y: yPos - (window.scrollY * 0.2), // combine with scroll
            duration: 1.2,
            ease: "power2.out",
          });
        };
        window.addEventListener("mousemove", onMouseMove);

        // Parallax on scroll
        gsap.to(".hero-content", {
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
          opacity: 0.3,
          filter: "blur(4px)",
          ease: "none",
        });
      }, container);

      return () => ctx.revert();
    };

    // Listen for preloader complete
    const handler = () => initAnimations();
    window.addEventListener("preloaderComplete", handler);

    // Fallback if preloader already completed
    const timeout = setTimeout(() => initAnimations(), 4000);

    return () => {
      window.removeEventListener("preloaderComplete", handler);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <section id="hero" className="hero" ref={containerRef}>
      {/* Gradient glow behind text */}
      <div className="hero-glow" />

      <div className="container hero-content">
        <div className="hero-tagline" style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px", opacity: 0 }}>
          <div style={{ width: "40px", height: "1px", background: "rgba(160, 140, 255, 0.6)" }} />
          <span
            style={{
              fontFamily: "var(--font-space)",
              fontSize: "0.85rem",
              color: "rgba(160, 140, 255, 0.8)",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
            }}
          >
            Creative Developer & Digital Architect
          </span>
        </div>

        <h1 ref={headlineRef} style={{ position: "relative", overflow: "hidden" }}>
          <span className="hero-word">Crafting </span>
          <span className="hero-word">
            <span className="text-gradient">Digital</span>
          </span>
          <br />
          <span className="hero-word">Realities </span>
          <span className="hero-word">Beyond </span>
          <span className="hero-word">Limits.</span>
          {/* Light sweep overlay */}
          <span className="hero-sweep" />
        </h1>

        <p className="hero-sub" style={{ opacity: 0 }}>
          Immersive experiences at the intersection of{" "}
          <strong style={{ color: "#fff", fontWeight: 500 }}>art</strong>,{" "}
          <strong style={{ color: "#fff", fontWeight: 500 }}>engineering</strong>, and{" "}
          <strong style={{ color: "#fff", fontWeight: 500 }}>storytelling</strong>.
        </p>

        <div className="flex gap-3">
          <a href="#projects" className="btn btn-primary interactive hero-btn" style={{ opacity: 0 }}>
            Explore Work
          </a>
          <a href="#contact" className="btn btn-outline interactive hero-btn" style={{ opacity: 0 }}>
            Let&apos;s Talk
          </a>
        </div>
      </div>
    </section>
  );
}
