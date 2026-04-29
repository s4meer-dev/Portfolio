"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;
    const glow = glowRef.current;
    if (!ring || !dot || !glow) return;

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let ringPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let glowPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let isHovering = false;

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Smooth follow loop
    const render = () => {
      // Dot follows instantly
      gsap.set(dot, {
        x: mouse.x,
        y: mouse.y,
      });

      // Ring follows with smooth delay (lerp)
      const ringSpeed = isHovering ? 0.08 : 0.12;
      ringPos.x += (mouse.x - ringPos.x) * ringSpeed;
      ringPos.y += (mouse.y - ringPos.y) * ringSpeed;

      gsap.set(ring, {
        x: ringPos.x,
        y: ringPos.y,
      });

      // Glow follows with even more delay
      glowPos.x += (mouse.x - glowPos.x) * 0.05;
      glowPos.y += (mouse.y - glowPos.y) * 0.05;

      gsap.set(glow, {
        x: glowPos.x,
        y: glowPos.y,
      });

      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);

    // Hover detection
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest(".interactive") ||
        target.closest("a") ||
        target.closest("button") ||
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button"
      ) {
        isHovering = true;
        ring.classList.add("cursor-hover");
        dot.classList.add("dot-hover");
        glow.classList.add("glow-active");
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest(".interactive") ||
        target.closest("a") ||
        target.closest("button") ||
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button"
      ) {
        isHovering = false;
        ring.classList.remove("cursor-hover");
        dot.classList.remove("dot-hover");
        glow.classList.remove("glow-active");
      }
    };

    const onMouseDown = () => {
      ring.classList.add("cursor-click");
      dot.classList.add("dot-click");
      setTimeout(() => {
        ring.classList.remove("cursor-click");
        dot.classList.remove("dot-click");
      }, 300);
    };

    window.addEventListener("mouseover", onMouseOver);
    window.addEventListener("mouseout", onMouseOut);
    window.addEventListener("mousedown", onMouseDown);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("mousedown", onMouseDown);
    };
  }, []);

  return (
    <>
      {/* Glow trail */}
      <div
        ref={glowRef}
        className="cursor-glow"
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="cursor-ring"
      />
      {/* Dot */}
      <div
        ref={dotRef}
        className="cursor-dot"
      />
    </>
  );
}
