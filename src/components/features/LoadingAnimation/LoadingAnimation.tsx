"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./LoadingAnimation.module.css";

type LoadingVariant = "mapRoute" | "splitFlap" | "luggageCarousel";

interface LoadingAnimationProps {
  variant: LoadingVariant;
  className?: string;
  words?: string[];
  flapBG?: string;
  targetLength?: number;
}

const defaultWords = ["LOADING", "JOURNEY", "EXPLORE"];
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ.,!?";
const defaultTargetLength = 10;

/**
 * 文字列の前後を均等なスペースで埋めて中央揃えにする関数
 * @param {string} str - 対象の文字列
 * @param {number} targetLength - 最終的な全体の長さ
 * @param {string} padChar - 埋める文字（デフォルトはスペース）
 * @returns {string} - 整形後の文字列
 */
function padCenter(str: string, targetLength: number, padChar = " ") {
  if (str.length >= targetLength) {
    return str;
  }
  const totalPadding = targetLength - str.length;
  const paddingStart = Math.floor(totalPadding / 2);
  const startPadded = str.padStart(str.length + paddingStart, padChar);
  return startPadded.padEnd(targetLength, padChar);
}

// Sub-component for SplitFlap
const SplitFlapCharacter = ({ char, flapBG }: { char: string; flapBG: string }) => {
  const [currentChar, setCurrentChar] = useState(" ");
  const [prevChar, setPrevChar] = useState(" ");
  const [isFlipping, setIsFlipping] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentCharRef = useRef(" ");

  useEffect(() => {
    let i = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const frameId = window.requestAnimationFrame(() => {
      setIsFlipping(true);
    });
    intervalRef.current = setInterval(() => {
      const nextChar = chars[Math.floor(Math.random() * chars.length)];
      setPrevChar(currentCharRef.current);
      currentCharRef.current = nextChar;
      setCurrentChar(nextChar);
      i++;
      if (i > 5) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setPrevChar(currentCharRef.current);
        currentCharRef.current = char;
        setCurrentChar(char);
        timeoutRef.current = setTimeout(() => setIsFlipping(false), 400);
      }
    }, 60);
    return () => {
      window.cancelAnimationFrame(frameId);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [char]);

  return (
    <div className={styles["char-container"]}>
      <div className={`${styles.flap} ${styles.top} ${flapBG}`}>{currentChar}</div>
      <div className={`${styles.flap} ${styles.bottom} ${flapBG}`}>{currentChar}</div>
      {isFlipping && (
        <div className={`${styles.flap} ${styles.top} ${styles.flipping} ${flapBG}`}>
          {prevChar}
        </div>
      )}
    </div>
  );
};

export const LoadingAnimation = ({
  variant,
  className = "",
  words = defaultWords,
  flapBG = "bg-background",
  targetLength = defaultTargetLength,
}: LoadingAnimationProps) => {
  const [currentWord, setCurrentWord] = useState(words[0]);

  useEffect(() => {
    if (variant === "splitFlap") {
      const wordInterval = setInterval(() => {
        setCurrentWord((prev) => words[(words.indexOf(prev) + 1) % words.length]);
      }, 3000);
      return () => clearInterval(wordInterval);
    }
    return;
  }, [variant, words]);

  // prettier-ignore
  switch (variant) {
    case 'mapRoute': return <div className={`${styles['loader-map-route']} ${className}`}><svg viewBox="0 0 220 100" width="100%" height="100%"><path className={styles["map-path"]} d="M1,63 C5,30 25,20 40,25 C60,30 70,60 80,70 C90,80 100,75 120,60 C140,45 150,30 170,25 C190,20 210,30 219,60" /><path className={styles["route-line"]} d="M10,50 Q60,10 110,50 T210,50" /><path className={styles.plane} d="M0,0 L10,5 L0,10 L2,5 Z" /></svg></div>;
    case 'luggageCarousel': return <div className={`${styles['loader-carousel']} ${className}`}><div className={styles.track}></div><div className={`${styles.luggage} ${styles.l1}`}></div><div className={`${styles.luggage} ${styles.l2}`}></div><div className={`${styles.luggage} ${styles.l3}`}></div></div>;
    case 'splitFlap': return <div className={`${styles['loader-split-flap']} ${className}`}>{padCenter(currentWord, targetLength).split("").map((char, index) => <SplitFlapCharacter key={index} char={char} flapBG={flapBG} />)}</div>;
    default: return <div>Loading...</div>;
  }
};
