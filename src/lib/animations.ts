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

export const cardHover = {
  y: -6,
  transition: { duration: 0.28, ease: premiumEase },
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
