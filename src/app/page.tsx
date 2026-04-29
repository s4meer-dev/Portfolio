"use client";

import Background from "@/three/Background";
import Hero from "@/sections/Hero";
import About from "@/sections/About";
import Projects from "@/sections/Projects";
import Skills from "@/sections/Skills";
import Contact from "@/sections/Contact";

export default function Home() {
  return (
    <main style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
      <Background />
      
      {/* Navigation */}
      <nav className="navbar">
        <div className="container flex justify-between items-center">
          <a href="#hero" style={{ fontFamily: 'var(--font-space)', fontSize: '1.5rem', fontWeight: 700, color: '#fff', textDecoration: 'none' }} className="interactive">
            SAMEER<span style={{ color: 'rgba(160, 140, 255, 0.8)' }}>.</span>
          </a>
          <div className="nav-links flex gap-4">
            <a href="#about" className="interactive">About</a>
            <a href="#projects" className="interactive">Work</a>
            <a href="#skills" className="interactive">Skills</a>
            <a href="#contact" className="interactive">Contact</a>
          </div>
        </div>
      </nav>

      <Hero />
      <About />
      <Projects />
      <Skills />
      <Contact />

      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.04)', padding: '40px 0', position: 'relative', zIndex: 10 }}>
        <div className="container flex justify-between items-center">
          <span style={{ fontWeight: 700, fontFamily: 'var(--font-space)' }}>SAMEER.</span>
          <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem', letterSpacing: '0.05em' }}>© 2024 — Crafted with passion</span>
        </div>
      </footer>
    </main>
  );
}
