"use client";

import { useState, useEffect, useRef } from "react";
import { FaPlane, FaGlobeEurope, FaCamera } from "react-icons/fa";
import styles from "./LoadingAnimation.module.css";

type LoadingVariant =
  | "mapRoute"
  | "flippingJournal"
  | "compass"
  | "cameraAperture"
  | "passportStamp"
  | "airplaneWindow"
  | "luggageCarousel"
  | "splitFlap"
  | "floatingLanterns"
  | "backpack"
  | "boardingPass"
  | "postcard"
  | "dayNightCycle"
  | "landmark"
  | "polaroid"
  | "noodles"
  | "treasureChest"
  | "messageInABottle";

interface LoadingAnimationProps {
  variant: LoadingVariant;
  className?: string;
  words?: string[];
  flapBG?: string;
  targetLength?: number;
}

// Data for animations that use it
const icons = [<FaPlane key="plane" />, <FaGlobeEurope key="globe" />, <FaCamera key="camera" />];
const lanterns = [
  { left: "10%", animationDuration: "8s", animationDelay: "0s" },
  { left: "30%", animationDuration: "6s", animationDelay: "1s" },
  { left: "70%", animationDuration: "9s", animationDelay: "2s" },
  { left: "50%", animationDuration: "7s", animationDelay: "3.5s" },
  { left: "85%", animationDuration: "8s", animationDelay: "5s" },
];
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
  // 元の文字列が目標の長さ以上の場合はそのまま返す
  if (str.length >= targetLength) {
    return str;
  }

  // 追加する全体の文字数を計算
  const totalPadding = targetLength - str.length;

  // 先頭に追加する文字数を計算（小数点以下は切り捨て）
  const paddingStart = Math.floor(totalPadding / 2);

  // 先頭にパディングを追加
  const startPadded = str.padStart(str.length + paddingStart, padChar);

  // 最終的な長さになるように末尾にパディングを追加
  const finalPadded = startPadded.padEnd(targetLength, padChar);

  return finalPadded;
}

// Sub-component for SplitFlap
const SplitFlapCharacter = ({ char, flapBG }: { char: string; flapBG: string }) => {
  const [currentChar, setCurrentChar] = useState(" ");
  const [prevChar, setPrevChar] = useState(" ");
  const [isFlipping, setIsFlipping] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentCharRef = useRef(" ");

  useEffect(() => {
    setIsFlipping(true);
    let i = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);
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
        setTimeout(() => setIsFlipping(false), 400);
      }
    }, 60);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
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
  const [currentIconIndex, setCurrentIconIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState(words[0]);

  useEffect(() => {
    if (variant === "passportStamp") {
      const interval = setInterval(() => {
        setCurrentIconIndex((prev) => (prev + 1) % icons.length);
      }, 2500);
      return () => clearInterval(interval);
    }
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
    case 'flippingJournal': return <div className={`${styles['loader-journal']} ${className}`}><div className={styles.book}><div className={styles.page}></div><div className={styles.page}></div><div className={styles.page}></div></div></div>;
    case 'compass': return <div className={`${styles['loader-compass']} ${className}`}><div className={styles.rose}><span className={`${styles.marker} ${styles.n}`}>N</span><span className={`${styles.marker} ${styles.s}`}>S</span><span className={`${styles.marker} ${styles.w}`}>W</span><span className={`${styles.marker} ${styles.e}`}>E</span></div><div className={styles.needle}></div></div>;
    case 'cameraAperture': return <div className={`${styles['loader-aperture']} ${className}`}><div className={styles.blade}></div><div className={styles.blade}></div><div className={styles.blade}></div><div className={styles.blade}></div><div className={styles.blade}></div><div className={styles.blade}></div></div>;
    case 'passportStamp': return <div className={`${styles['loader-passport-stamp']} ${className}`}><div className={styles.stamp}>{icons[currentIconIndex]}</div></div>;
    case 'airplaneWindow': return <div className={`${styles['loader-airplane-window']} ${className}`}><div className={styles.clouds}></div></div>;
    case 'luggageCarousel': return <div className={`${styles['loader-carousel']} ${className}`}><div className={styles.track}></div><div className={`${styles.luggage} ${styles.l1}`}></div><div className={`${styles.luggage} ${styles.l2}`}></div><div className={`${styles.luggage} ${styles.l3}`}></div></div>;
    case 'splitFlap': return <div className={`${styles['loader-split-flap']} ${className}`}>{padCenter(currentWord, targetLength).split("").map((char, index) => <SplitFlapCharacter key={index} char={char} flapBG={flapBG} />)}</div>;
    case 'floatingLanterns': return <div className={`${styles['loader-lantern']} ${className}`}>{lanterns.map((style, index) => <div key={index} className={styles.lantern} style={style as React.CSSProperties} />)}</div>;
    case 'backpack': return <div className={`${styles['loader-backpack']} ${className}`}><div className={styles.flap}></div><div className={`${styles.item} ${styles.passport}`}></div><div className={`${styles.item} ${styles.camera}`}></div></div>;
    case 'boardingPass': return <div className={`${styles['loader-boarding-pass']} ${className}`}><div className={styles.stub}></div></div>;
    case 'postcard': return <div className={`${styles['loader-postcard']} ${className}`}><svg width="100%" height="100%"><path className={styles["writing-path"]} d="M20,60 C30,40 50,40 60,60 C70,80 90,80 100,60" /></svg></div>;
    case 'dayNightCycle': return <div className={`${styles['loader-day-night']} ${className}`}><div className={styles.sky}><div className={styles["sun-moon"]}></div></div></div>;
    case 'landmark': return <div className={`${styles['loader-landmark']} ${className}`}><svg viewBox="0 0 100 100"><path d="M10 90 L 50 10 L 90 90 M 25 60 L 75 60"></path></svg></div>;
    case 'polaroid': return <div className={`${styles['loader-polaroid']} ${className}`}><div className={styles.photo}></div></div>;
    case 'noodles': return <div className={`${styles['loader-noodles']} ${className}`}><div className={`${styles.steam} ${styles.steam1}`}></div><div className={`${styles.steam} ${styles.steam2}`}></div><div className={`${styles.steam} ${styles.steam3}`}></div></div>;
    case 'treasureChest': return <div className={`${styles['loader-treasure-chest']} ${className}`}><div className={styles.base}></div><div className={styles.lid}></div><div className={styles.glow}></div></div>;
    case 'messageInABottle': return <div className={`${styles['loader-message-bottle']} ${className}`}><div className={styles.wave}></div><div className={`${styles.wave} ${styles.wave2}`}></div><div className={styles.bottle}></div></div>;
    default: return <div>Loading...</div>;
  }
};
