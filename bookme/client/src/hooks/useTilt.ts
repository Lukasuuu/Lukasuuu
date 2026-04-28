import { useRef, useEffect, useState } from "react";

interface TiltState {
  rotateX: number;
  rotateY: number;
  scale: number;
}

/**
 * useTilt Hook - Creates a 3D tilt effect based on mouse position
 * 
 * Usage:
 * const { ref, tiltStyle } = useTilt();
 * <div ref={ref} style={tiltStyle}>Content</div>
 */
export const useTilt = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<TiltState>({
    rotateX: 0,
    rotateY: 0,
    scale: 1,
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate mouse position relative to element center
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      // Calculate rotation angles (max 15 degrees)
      const rotateY = (mouseX / (rect.width / 2)) * 15;
      const rotateX = -(mouseY / (rect.height / 2)) * 15;

      setTilt({
        rotateX,
        rotateY,
        scale: 1.05,
      });
    };

    const handleMouseLeave = () => {
      setTilt({
        rotateX: 0,
        rotateY: 0,
        scale: 1,
      });
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const tiltStyle = {
    transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${tilt.scale})`,
    transition: "transform 0.1s ease-out",
  };

  return { ref, tiltStyle };
};
