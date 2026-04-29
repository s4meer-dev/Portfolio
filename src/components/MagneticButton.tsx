"use client";

import { useRef, ReactNode, useEffect } from "react";
import { gsap } from "gsap";

interface Props {
  children: ReactNode;
  className?: string;
  href?: string;
  as?: "button" | "a";
}

export default function MagneticButton({ children, className = "", href, as = "button" }: Props) {
  const btnRef = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    const xTo = gsap.quickTo(btn, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const yTo = gsap.quickTo(btn, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      xTo(x * 0.3);
      yTo(y * 0.3);

      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX - rect.left}px`;
        glowRef.current.style.top = `${e.clientY - rect.top}px`;
      }
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    btn.addEventListener("mousemove", handleMouseMove);
    btn.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      btn.removeEventListener("mousemove", handleMouseMove);
      btn.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const Component = as as any;

  return (
    <Component 
      ref={btnRef} 
      href={href} 
      className={`mag-btn interactive ${className}`}
    >
      <div ref={glowRef} className="mag-glow"></div>
      <span style={{ position: 'relative', zIndex: 2 }}>{children}</span>
    </Component>
  );
}
