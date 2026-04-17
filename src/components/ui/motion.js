import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

export function useMotionVariants() {
  const reduce = useReducedMotion();

  const fadeUp = {
    initial: { opacity: 0, y: reduce ? 0 : 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: reduce ? 0 : 8 },
    transition: { duration: reduce ? 0 : 0.22, ease: 'easeOut' },
  };

  const fade = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: reduce ? 0 : 0.18, ease: 'easeOut' },
  };

  const hoverCard = reduce
    ? {}
    : {
        whileHover: { y: -2 },
        transition: { duration: 0.18, ease: 'easeOut' },
      };

  const tap = reduce ? {} : { whileTap: { scale: 0.98 } };

  return { reduce, fadeUp, fade, hoverCard, tap };
}

export { motion };
export { AnimatePresence };

