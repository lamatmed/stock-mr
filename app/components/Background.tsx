"use client";
import { motion } from "framer-motion";

const Background = () => {
  return (
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 -z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  );
};

export default Background;
