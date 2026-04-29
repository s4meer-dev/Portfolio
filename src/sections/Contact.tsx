"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
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

      // Content reveals
      gsap.from(".ct-reveal", {
        scrollTrigger: { trigger: containerRef.current, start: "top 70%" },
        y: 50,
        opacity: 0,
        filter: "blur(6px)",
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" className="section cinema-section" ref={containerRef}>
      <div className="container">
        <div className="section-header">
          <div className="section-num">04</div>
          <h2 className="section-title">Contact</h2>
        </div>

        <div className="grid grid-2 gap-5 items-center">
          <div>
            <h3
              className="ct-reveal"
              style={{ fontSize: "clamp(2rem, 3vw, 3rem)", marginBottom: "24px" }}
            >
              Let&apos;s Build <br />
              <span className="text-gradient">Something</span> <br />
              Extraordinary.
            </h3>
            <p
              className="ct-reveal"
              style={{
                fontSize: "1.1rem",
                color: "#94a3b8",
                marginBottom: "48px",
                maxWidth: "400px",
              }}
            >
              Have a vision? Let&apos;s make it real. I&apos;m open to freelance,
              full-time, and creative collaborations.
            </p>

            <div className="flex flex-col gap-2 ct-reveal">
              <a
                href="mailto:sameer@example.com"
                className="contact-link glass-panel interactive"
              >
                <div>
                  <div className="contact-link-label">Email</div>
                  <div className="contact-link-value">sameer@example.com</div>
                </div>
                <span style={{ color: "rgba(160,140,255,0.8)", fontSize: "1.2rem" }}>↗</span>
              </a>
              <a
                href="https://github.com"
                className="contact-link glass-panel interactive"
              >
                <div>
                  <div className="contact-link-label">GitHub</div>
                  <div className="contact-link-value">github.com/sameer</div>
                </div>
                <span style={{ color: "rgba(160,140,255,0.8)", fontSize: "1.2rem" }}>↗</span>
              </a>
            </div>
          </div>

          <div className="glass-panel ct-reveal" style={{ padding: "48px" }}>
            <form
              onSubmit={(e) => e.preventDefault()}
              style={{ display: "flex", flexDirection: "column", gap: "32px" }}
            >
              <div className="form-group">
                <input type="text" id="name" required className="form-input" placeholder=" " />
                <label htmlFor="name" className="form-label">
                  Your Name
                </label>
              </div>

              <div className="form-group">
                <input type="email" id="email" required className="form-input" placeholder=" " />
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
              </div>

              <div className="form-group">
                <textarea
                  id="message"
                  required
                  rows={4}
                  className="form-input"
                  placeholder=" "
                  style={{ resize: "vertical", minHeight: "100px" }}
                />
                <label htmlFor="message" className="form-label">
                  Your Message
                </label>
              </div>

              <button type="submit" className="btn btn-primary interactive" style={{ width: "100%" }}>
                <span className="btn-text">Send Message</span>
                <span className="btn-sweep" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
