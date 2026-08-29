"use client";

import { type ReactNode } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";

interface AnimatedListProps {
  className?: string;
  children: ReactNode;
  delay?: number;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function AnimatedList({
  className,
  children,
  delay = 1000,
}: AnimatedListProps) {
  return (
    <AnimatePresence>
      <motion.div
        className={className}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        transition={{ delayChildren: delay / 1000 }}
      >
        {Array.isArray(children)
          ? children.map((child, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                {child}
              </motion.div>
            ))
          : children}
      </motion.div>
    </AnimatePresence>
  );
}
