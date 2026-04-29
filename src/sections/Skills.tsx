"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SKILLS = [
  {
    category: "Frontend",
    items: [
      { name: "React / Next.js", value: 95 },
      { name: "TypeScript", value: 88 },
      { name: "Three.js / WebGL", value: 85 },
      { name: "GSAP / Motion", value: 90 },
    ],
  },
  {
    category: "Backend",
    items: [
      { name: "Node.js / Express", value: 90 },
      { name: "Python / FastAPI", value: 85 },
      { name: "PostgreSQL", value: 83 },
      { name: "Redis", value: 75 },
    ],
  },
  {
    category: "Design",
    items: [
      { name: "Figma", value: 88 },
      { name: "GLSL Shaders", value: 78 },
      { name: "Blender", value: 70 },
      { name: "Motion Design", value: 85 },
    ],
  },
];

export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);

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
      gsap.from(".sk-header", {
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

      // Cards
      gsap.from(".sk-card", {
        scrollTrigger: {
          trigger: ".sk-grid",
          start: "top 80%",
        },
        y: 60,
        opacity: 0,
        filter: "blur(6px)",
        stagger: 0.15,
        duration: 0.9,
        ease: "power3.out",
      });

      // Skill bars animate
      gsap.utils.toArray<HTMLElement>(".sk-fill").forEach((fill) => {
        gsap.to(fill, {
          scrollTrigger: {
            trigger: fill,
            start: "top 85%",
          },
          width: fill.dataset.w + "%",
          duration: 1.4,
          ease: "expo.out",
        });
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

  return (
    <section id="skills" className="section cinema-section" ref={containerRef}>
      <div className="container">
        <div className="section-header sk-header">
          <div className="section-num">03</div>
          <h2 className="section-title">
            Tools of <br />
            <span className="text-gradient">My Craft.</span>
          </h2>
        </div>

        <div className="grid grid-3 sk-grid">
          {SKILLS.map((skillGroup, i) => (
            <div key={i} className="sk-card glass-panel" style={{ padding: "40px" }}>
              <h3 style={{ fontSize: "1.25rem", marginBottom: "32px" }}>
                {skillGroup.category}
              </h3>

              <div className="flex flex-col gap-3">
                {skillGroup.items.map((item, j) => (
                  <div key={j}>
                    <div
                      className="flex justify-between"
                      style={{
                        fontSize: "0.875rem",
                        color: "#94a3b8",
                        marginBottom: "8px",
                      }}
                    >
                      <span>{item.name}</span>
                      <span style={{ fontFamily: "var(--font-space)" }}>
                        {item.value}%
                      </span>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "4px",
                        background: "rgba(255,255,255,0.05)",
                        borderRadius: "2px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        className="sk-fill"
                        style={{
                          height: "100%",
                          background: "linear-gradient(90deg, var(--purple), var(--blue))",
                          width: "0%",
                          borderRadius: "2px",
                          boxShadow: "0 0 8px rgba(123,44,255,0.3)",
                        }}
                        data-w={item.value}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
