"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ElementType, ReactNode } from "react";
import { staggerContainer, staggerItem } from "@/lib/animations";

/** Element tags Stagger/StaggerItem can render as. */
type MotionTag = "div" | "section" | "ul" | "ol" | "li" | "nav" | "article";

// Pre-built motion components, created once at module load. Indexing this map in
// render is a plain lookup — no component is created per render (which would
// reset state and trips react-hooks/static-components).
const MOTION_TAGS: Record<MotionTag, ElementType> = {
  div: motion.div,
  section: motion.section,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
  nav: motion.nav,
  article: motion.article,
};

type StaggerProps = {
  children: ReactNode;
  className?: string;
  /** Render as a different element (e.g. "ul", "section"). Defaults to "div". */
  as?: MotionTag;
  /** Re-trigger every time it scrolls into view instead of only once. */
  repeat?: boolean;
};

/**
 * Stagger reveals its <StaggerItem> children in a gentle cascade as the group
 * scrolls into view. Prefer this over wrapping each child in its own <Reveal>
 * for grids and lists — one in-view observer, coordinated timing. Honors
 * prefers-reduced-motion by rendering statically.
 */
export function Stagger({ children, className, as = "div", repeat = false }: StaggerProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    const Tag = as as ElementType;
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionComp = MOTION_TAGS[as];
  return (
    <MotionComp
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: !repeat, margin: "-80px" }}
    >
      {children}
    </MotionComp>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
  as?: MotionTag;
};

/** A single child of <Stagger>. Inherits the group's reveal timing. */
export function StaggerItem({ children, className, as = "div" }: StaggerItemProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    const Tag = as as ElementType;
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionComp = MOTION_TAGS[as];
  return (
    <MotionComp className={className} variants={staggerItem}>
      {children}
    </MotionComp>
  );
}
