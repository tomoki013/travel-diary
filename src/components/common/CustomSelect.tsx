"use client";

import { useState, useRef, useEffect, RefObject, useCallback, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
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
const useOutsideClick = (refs: Array<RefObject<HTMLElement | null>>, callback: () => void) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInside = refs.some((ref) => ref.current && ref.current.contains(target));

      if (!clickedInside) {
        callback();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [refs, callback]);
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

export const CustomSelect = ({ options, value, onChange, labelPrefix }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  useOutsideClick([wrapperRef, menuRef], () => setIsOpen(false));

  const selectedOption = options.find((opt) => opt.slug === value);
  const canUsePortal = typeof document !== "undefined";

  const updateMenuPosition = useCallback(() => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + 8,
      left: rect.left,
      width: rect.width,
    });
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) return;

    updateMenuPosition();

    const handlePositionUpdate = () => updateMenuPosition();

    window.addEventListener("resize", handlePositionUpdate);
    window.addEventListener("scroll", handlePositionUpdate, true);

    return () => {
      window.removeEventListener("resize", handlePositionUpdate);
      window.removeEventListener("scroll", handlePositionUpdate, true);
    };
  }, [isOpen, updateMenuPosition]);

  return (
    <div ref={wrapperRef} className="relative isolate z-40 w-full font-sans">
      <motion.button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="focus:ring-secondary relative z-10 flex w-full items-center justify-between rounded-xl border border-gray-200/80 bg-white/80 p-4 text-left shadow-sm transition-all duration-300 hover:border-gray-300 focus:ring-2 focus:ring-offset-2 focus:outline-none"
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex flex-col">
          <span className="text-xs font-medium tracking-wider text-gray-500 uppercase">
            {labelPrefix}
          </span>
          <span className="text-lg font-semibold text-gray-800">{selectedOption?.title}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
        >
          <ChevronDown className="text-gray-500" size={24} />
        </motion.div>
      </motion.button>

      {canUsePortal &&
        createPortal(
          <AnimatePresence>
            {isOpen && menuPosition && (
              <motion.ul
                ref={menuRef}
                variants={listVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="ring-secondary fixed z-[220] origin-top overflow-hidden rounded-xl bg-white/95 text-gray-800 shadow-2xl ring-1 backdrop-blur-lg"
                style={{
                  top: menuPosition.top,
                  left: menuPosition.left,
                  width: menuPosition.width,
                }}
              >
                {options.map((option) => (
                  <motion.li
                    key={option.slug}
                    variants={itemVariants}
                    onClick={() => {
                      onChange(option.slug);
                      setIsOpen(false);
                    }}
                    className="flex cursor-pointer items-center justify-between px-5 py-3 hover:bg-sky-100/70"
                  >
                    <span className={value === option.slug ? "text-secondary font-semibold" : ""}>
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
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
};
