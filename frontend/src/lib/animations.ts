import type { Variants } from "framer-motion";

export const premiumEase = [0.22, 1, 0.36, 1] as const;

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.45, ease: premiumEase } },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: premiumEase } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: premiumEase } },
};

export const slideInFromLeft: Variants = {
  hidden: { opacity: 0, x: -28 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: premiumEase } },
};

export const slideInFromRight: Variants = {
  hidden: { opacity: 0, x: 28 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: premiumEase } },
};

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.075,
      delayChildren: 0.04,
    },
  },
};

/**
 * staggerItem is the child variant to pair with `staggerContainer` (or the
 * <Stagger>/<StaggerItem> components). Children inherit the parent's `initial`
 * / `whileInView` state, so they cascade in together instead of each element
 * running its own in-view observer.
 */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: premiumEase } },
};

export const cardHover = {
  y: -6,
  transition: { duration: 0.28, ease: premiumEase },
};

/**
 * hoverLift / tapScale are the standard interactive gestures for cards and
 * pressable surfaces. Keep motion on transform only (compositor-friendly).
 */
export const hoverLift = { y: -6, transition: { duration: 0.28, ease: premiumEase } };
export const tapScale = { scale: 0.97, transition: { duration: 0.12, ease: premiumEase } };

/** imageZoom is the subtle scale applied to product imagery on card/gallery hover. */
export const imageZoom = { scale: 1.06, transition: { duration: 0.6, ease: premiumEase } };

/**
 * listItem is for add/remove animations in carts, wishlists, and line-item
 * lists. Use with <AnimatePresence> + `layout` so neighbours slide smoothly as
 * items enter or leave.
 */
export const listItem: Variants = {
  hidden: { opacity: 0, y: 12, height: 0 },
  show: { opacity: 1, y: 0, height: "auto", transition: { duration: 0.35, ease: premiumEase } },
  exit: { opacity: 0, x: -24, height: 0, transition: { duration: 0.28, ease: premiumEase } },
};

/**
 * pageTransition drives route-level cross-fades (see <PageTransition>). Kept
 * short and translate-light so navigation feels instant, not sluggish.
 */
export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: premiumEase } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: premiumEase } },
};

export const drawerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.22, ease: premiumEase } },
  exit: { opacity: 0, transition: { duration: 0.18, ease: premiumEase } },
};

export const drawerPanelVariants: Variants = {
  hidden: { x: "-100%" },
  show: { x: 0, transition: { duration: 0.38, ease: premiumEase } },
  exit: { x: "-100%", transition: { duration: 0.28, ease: premiumEase } },
};
