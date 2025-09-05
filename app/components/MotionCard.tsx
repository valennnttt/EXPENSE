"use client";
import { motion, type Variants } from "framer-motion";
import { PropsWithChildren } from "react";

const variants: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

export default function MotionCard({
  children,
  className = "",
}: PropsWithChildren<{ className?: string }>) {
  return (
    <motion.div
      className={`card ${className}`}
      initial="hidden"
      animate="show"
      variants={variants}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 180, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}
