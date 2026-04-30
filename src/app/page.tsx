"use client";

import Background from "@/three/Background";
import Hero from "@/sections/Hero";
import About from "@/sections/About";
import Skills from "@/sections/Skills";

export default function Home() {
  return (
    <main style={{ position: 'relative', width: '100%', minHeight: '100vh', background: '#050508' }}>
      <Background />
      <Hero />
      <About />
      <Skills />
    </main>
  );
}
