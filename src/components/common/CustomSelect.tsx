"use client";

import { useState, useRef, useEffect, RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

interface Option {
  slug: string;
  title: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  labelPrefix: string;
}

// コンポーネント外クリックを検知するカスタムフック (変更なし)
const useOutsideClick = (
  ref: RefObject<HTMLDivElement | null>,
  callback: () => void
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, callback]);
};

// Framer Motionのアニメーション定義
const listVariants = {
  open: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
      staggerChildren: 0.05, // 子要素が0.05秒ずれてアニメーション開始
    },
  },
  closed: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
} as const;

const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 24 },
  },
  closed: { opacity: 0, y: -15, transition: { duration: 0.2 } },
} as const;

export const CustomSelect = ({
  options,
  value,
  onChange,
  labelPrefix,
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  useOutsideClick(wrapperRef, () => setIsOpen(false));

  const selectedOption = options.find((opt) => opt.slug === value);

  return (
    <div ref={wrapperRef} className="relative z-40 w-full font-sans isolate">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-10 w-full flex items-center justify-between text-left p-4 bg-white/80 border border-gray-200/80 rounded-xl shadow-sm hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-all duration-300"
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex flex-col">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            {labelPrefix}
          </span>
          <span className="text-lg font-semibold text-gray-800">
            {selectedOption?.title}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
        >
          <ChevronDown className="text-gray-500" size={24} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            variants={listVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="absolute z-[80] w-full mt-2 origin-top bg-white/95 text-gray-800 backdrop-blur-lg rounded-xl shadow-2xl ring-1 ring-secondary overflow-hidden"
          >
            {options.map((option) => (
              <motion.li
                key={option.slug}
                variants={itemVariants}
                onClick={() => {
                  onChange(option.slug);
                  setIsOpen(false);
                }}
                className="flex items-center justify-between px-5 py-3 cursor-pointer hover:bg-sky-100/70"
              >
                <span
                  className={
                    value === option.slug ? "font-semibold text-secondary" : ""
                  }
                >
                  {option.title}
                </span>
                {value === option.slug && (
                  <motion.div layoutId="selected-check">
                    <Check className="text-secondary" size={20} />
                  </motion.div>
                )}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};
