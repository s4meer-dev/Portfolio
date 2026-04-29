"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section entrance: fade + zoom + blur
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

      // Elements reveal with stagger
      gsap.from(".about-reveal", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        },
        y: 50,
        opacity: 0,
        filter: "blur(6px)",
        stagger: 0.12,
        duration: 1,
        ease: "power3.out",
      });

      // Timeline items slide in from left
      gsap.from(".timeline-item", {
        scrollTrigger: {
          trigger: ".timeline",
          start: "top 80%",
        },
        x: -30,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power2.out",
      });

      // Exit parallax
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
    <section id="about" className="section cinema-section" ref={containerRef}>
      <div className="container">
        <div className="section-header about-reveal">
          <div className="section-num">01</div>
          <h2 className="section-title">The Journey</h2>
        </div>

        <div className="grid grid-2 items-center gap-5">
          <div
            className="about-reveal glass-panel"
            style={{
              padding: "60px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "400px",
              flexDirection: "column",
            }}
          >
            <h3 style={{ fontSize: "4rem", fontWeight: 700, fontFamily: "var(--font-space)" }}>
              S.
            </h3>
            <div
              style={{
                marginTop: "24px",
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <span className="tag">Full Stack</span>
              <span className="tag">WebGL</span>
              <span className="tag">UI Design</span>
            </div>
          </div>

          <div>
            <h3
              className="about-reveal"
              style={{ fontSize: "2rem", marginBottom: "24px" }}
            >
              I build things <br />
              <span className="text-gradient">that feel alive.</span>
            </h3>

            <p
              className="about-reveal"
              style={{ fontSize: "1.1rem", color: "#94a3b8", marginBottom: "40px" }}
            >
              I&apos;m <strong style={{ color: "#fff" }}>Sameer</strong> — a full-stack
              developer and creative technologist obsessed with pushing the boundaries
              of what&apos;s possible on the web. My work spans systems architecture,
              3D graphics, and product design.
            </p>

            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-year">2021</div>
                <div className="timeline-title">The Spark</div>
                <div className="timeline-desc">First line of code. First obsession.</div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">2022</div>
                <div className="timeline-title">Going Deep</div>
                <div className="timeline-desc">React, Node.js, 3D graphics mastery.</div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">Now</div>
                <div className="timeline-title" style={{ color: "#fff" }}>
                  Building the Future
                </div>
                <div className="timeline-desc">Redefining digital storytelling.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
