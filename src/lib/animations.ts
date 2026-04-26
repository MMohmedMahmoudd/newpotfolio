import { type ClassValue, clsx } from "clsx";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import type { Variants, Transition } from "framer-motion";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ease = [0.22, 1, 0.36, 1] as const;

export const animationConfig = {
  duration: { fast: 0.3, normal: 0.5, slow: 0.7 },
  delay: { xs: 0.05, sm: 0.1, md: 0.15, lg: 0.2 },
  ease,
};

export const springTransition: Transition = {
  type: "spring",
  stiffness: 100,
  damping: 18,
  mass: 1,
};

export type ScrollDirection = "up" | "down";

export function useScrollDirection(threshold = 6): ScrollDirection {
  const [direction, setDirection] = useState<ScrollDirection>("down");
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      if (Math.abs(delta) < threshold) return;
      setDirection(delta > 0 ? "down" : "up");
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return direction;
}

const resolveDirection = (d: ScrollDirection | undefined): ScrollDirection =>
  d === "up" ? "up" : "down";

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

export const itemVariants: Variants = {
  hidden: (direction?: ScrollDirection) => ({
    opacity: 0,
    y: resolveDirection(direction) === "down" ? 24 : -24,
  }),
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease },
  },
};

export const fadeInUp: Variants = {
  hidden: (direction?: ScrollDirection) => ({
    opacity: 0,
    y: resolveDirection(direction) === "down" ? 24 : -24,
  }),
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease },
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

export const staggerItem: Variants = {
  hidden: (direction?: ScrollDirection) => ({
    opacity: 0,
    y: resolveDirection(direction) === "down" ? 20 : -20,
  }),
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease },
  },
};

export const revealViewport = { margin: "-100px" } as const;
