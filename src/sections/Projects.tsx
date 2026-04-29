"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    id: 1,
    title: "Neural Canvas",
    category: "WebGL",
    year: "2024",
    desc: "AI-driven visual art generator creating living digital paintings.",
    gradient: "linear-gradient(135deg, rgba(123,44,255,0.15), rgba(0,240,255,0.05))",
  },
  {
    id: 2,
    title: "Quantum Dashboard",
    category: "React",
    year: "2024",
    desc: "Real-time analytics platform with cinematic visualizations.",
    gradient: "linear-gradient(135deg, rgba(0,240,255,0.12), rgba(168,85,247,0.05))",
  },
  {
    id: 3,
    title: "Aether Platform",
    category: "SaaS",
    year: "2023",
    desc: "Next-generation SaaS for creative teams with AI workflows.",
    gradient: "linear-gradient(135deg, rgba(168,85,247,0.12), rgba(123,44,255,0.05))",
  },
];

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section entrance
      gsap.fromTo(
        containerRef.current,
        { opacity: 0.3, scale: 0.97, filter: "blur(4px)" },
        {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            end: "top 40%",
            scrub: 1,
          },
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          ease: "none",
        }
      );

      // Header
      gsap.from(".proj-header", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        },
        y: 40,
        opacity: 0,
        filter: "blur(6px)",
        duration: 1,
        ease: "power3.out",
      });

      // Cards stagger
      gsap.from(".proj-card", {
        scrollTrigger: {
          trigger: ".proj-grid",
          start: "top 80%",
        },
        y: 80,
        opacity: 0,
        filter: "blur(8px)",
        stagger: 0.2,
        duration: 1,
        ease: "power3.out",
      });

      // Exit
      gsap.to(containerRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "bottom 60%",
          end: "bottom top",
          scrub: 1,
        },
        opacity: 0.4,
        y: -30,
        ease: "none",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // 3D tilt handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(card, {
      rotateY: x * 12,
      rotateX: -y * 12,
      duration: 0.4,
      ease: "power2.out",
    });

    // Move glow border
    const glowEl = card.querySelector(".proj-glow") as HTMLElement;
    if (glowEl) {
      glowEl.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(160,140,255,0.25), transparent 60%)`;
    }
  };

  const handleMouseLeave = (index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;

    gsap.to(card, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)",
    });

    const glowEl = card.querySelector(".proj-glow") as HTMLElement;
    if (glowEl) {
      glowEl.style.background = "transparent";
    }
  };

  return (
    <section id="projects" className="section cinema-section" ref={containerRef}>
      <div className="container">
        <div className="section-header proj-header">
          <div className="section-num">02</div>
          <h2 className="section-title">
            Projects That <br />
            <span className="text-gradient">Define Me.</span>
          </h2>
        </div>

        <div className="grid grid-3 proj-grid">
          {PROJECTS.map((p, i) => (
            <div
              key={p.id}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="proj-card glass-panel interactive"
              style={{ perspective: "800px", transformStyle: "preserve-3d" }}
              onMouseMove={(e) => handleMouseMove(e, i)}
              onMouseLeave={() => handleMouseLeave(i)}
            >
              {/* Background gradient */}
              <div
                className="proj-bg"
                style={{ background: p.gradient }}
              />
              {/* Glow border effect */}
              <div className="proj-glow" />
              <div className="proj-content">
                <div
                  className="flex justify-between items-center"
                  style={{ marginBottom: "16px" }}
                >
                  <span className="tag">{p.category}</span>
                  <span
                    style={{
                      fontSize: "0.875rem",
                      color: "#94a3b8",
                      fontFamily: "var(--font-space)",
                    }}
                  >
                    {p.year}
                  </span>
                </div>
                <h3 style={{ fontSize: "1.5rem", marginBottom: "12px" }}>{p.title}</h3>
                <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
