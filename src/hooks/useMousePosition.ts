import { useState, useEffect } from "react";

export function useMousePosition() {
  const [mouse, setMouse] = useState({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return mouse;
}
