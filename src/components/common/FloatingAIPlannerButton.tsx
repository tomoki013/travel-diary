"use client";

import Link from "next/link";
import { Bot } from "lucide-react";
import { motion } from "framer-motion";
import { AI_PLANNER_PATH } from "@/constants/site";

const FloatingAIPlannerButton = () => {
  return (
    <motion.div
      initial={{ scale: 0, y: 50 }}
      animate={{ scale: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 1,
      }}
      whileHover={{ scale: 1.1 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Link
        href={AI_PLANNER_PATH}
        className="flex items-center justify-center w-16 h-16 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors"
        aria-label="AI Planner"
      >
        <Bot size={32} />
      </Link>
    </motion.div>
  );
};

export default FloatingAIPlannerButton;
