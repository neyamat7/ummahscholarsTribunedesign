// Shared Cinematic Animation Variants for Ummah Scholars Tribune
// Custom easing: [0.22, 1, 0.36, 1] (Refined ease-out-expo curve)

export const EXPO_EASE = [0.22, 1, 0.36, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EXPO_EASE },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: EXPO_EASE },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: EXPO_EASE },
  },
};

export const staggerContainer = (staggerChildren = 0.1, delayChildren = 0) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren, delayChildren },
  },
});

// Card Hover Effect Utility
export const cardHoverAnimation = {
  y: -4,
  transition: { duration: 0.25, ease: "easeOut" },
};
