"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    
    // Initial animation
    gsap.fromTo(
      ".navbar",
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 1.5 }
    );

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? "nav-scrolled" : ""}`}>
      <div className="container flex justify-between items-center">
        <div className="logo interactive" style={{ fontWeight: 700, letterSpacing: '0.1em', fontSize: '1.2rem' }}>
          S<span className="text-gradient">.</span>
        </div>
        
        <div className="nav-links flex gap-4">
          <a href="#about" className="interactive">About</a>
          <a href="#skills" className="interactive">Skills</a>
          <a href="#projects" className="interactive">Work</a>
          <a href="#contact" className="interactive">Contact</a>
        </div>
      </div>
    </nav>
  );
}
