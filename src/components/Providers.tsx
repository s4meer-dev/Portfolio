"use client";

import { useEffect, useState, ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Cursor from "@/components/Cursor";
import Preloader from "@/components/Preloader";

gsap.registerPlugin(ScrollTrigger);

export function Providers({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const l = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1.1,
      touchMultiplier: 2,
      infinite: false,
    });

    l.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      l.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    setReady(true);

    return () => {
      gsap.ticker.remove(l.raf);
      l.destroy();
    };
  }, []);

  return (
    <>
      <Preloader />
      {ready && <Cursor />}
      {children}
    </>
  );
}
