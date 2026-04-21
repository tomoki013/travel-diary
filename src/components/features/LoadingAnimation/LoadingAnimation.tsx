"use client";

import { useState, useEffect, useRef } from "react";
import { FaPlane, FaGlobeEurope, FaCamera } from "react-icons/fa";

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
const icons = [
  <FaPlane key="plane" />,
  <FaGlobeEurope key="globe" />,
  <FaCamera key="camera" />,
];
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
const SplitFlapCharacter = ({
  char,
  flapBG,
}: {
  char: string;
  flapBG: string;
}) => {
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
    <div className="char-container">
      <div className={`flap top ${flapBG}`}>{currentChar}</div>
      <div className={`flap bottom ${flapBG}`}>{currentChar}</div>
      {isFlipping && (
        <div className={`flap top flipping ${flapBG}`}>{prevChar}</div>
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
        setCurrentWord(
          (prev) => words[(words.indexOf(prev) + 1) % words.length]
        );
      }, 3000);
      return () => clearInterval(wordInterval);
    }
    return;
  }, [variant, words]);

  // prettier-ignore
  switch (variant) {
    case 'mapRoute': return <div className={`loader-map-route ${className}`}><svg viewBox="0 0 220 100" width="100%" height="100%"><path className="map-path" d="M1,63 C5,30 25,20 40,25 C60,30 70,60 80,70 C90,80 100,75 120,60 C140,45 150,30 170,25 C190,20 210,30 219,60" /><path className="route-line" d="M10,50 Q60,10 110,50 T210,50" /><path className="plane" d="M0,0 L10,5 L0,10 L2,5 Z" /></svg></div>;
    case 'flippingJournal': return <div className={`loader-journal ${className}`}><div className="book"><div className="page"></div><div className="page"></div><div className="page"></div></div></div>;
    case 'compass': return <div className={`loader-compass ${className}`}><div className="rose"><span className="marker n">N</span><span className="marker s">S</span><span className="marker w">W</span><span className="marker e">E</span></div><div className="needle"></div></div>;
    case 'cameraAperture': return <div className={`loader-aperture ${className}`}><div className="blade"></div><div className="blade"></div><div className="blade"></div><div className="blade"></div><div className="blade"></div><div className="blade"></div></div>;
    case 'passportStamp': return <div className={`loader-passport-stamp ${className}`}><div className="stamp">{icons[currentIconIndex]}</div></div>;
    case 'airplaneWindow': return <div className={`loader-airplane-window ${className}`}><div className="clouds"></div></div>;
    case 'luggageCarousel': return <div className={`loader-carousel ${className}`}><div className="track"></div><div className="luggage l1"></div><div className="luggage l2"></div><div className="luggage l3"></div></div>;
    case 'splitFlap': return <div className={`loader-split-flap ${className}`}>{padCenter(currentWord, targetLength).split("").map((char, index) => <SplitFlapCharacter key={index} char={char} flapBG={flapBG} />)}</div>;
    case 'floatingLanterns': return <div className={`loader-lantern ${className}`}>{lanterns.map((style, index) => <div key={index} className="lantern" style={style as React.CSSProperties} />)}</div>;
    case 'backpack': return <div className={`loader-backpack ${className}`}><div className="flap"></div><div className="item passport"></div><div className="item camera"></div></div>;
    case 'boardingPass': return <div className={`loader-boarding-pass ${className}`}><div className="stub"></div></div>;
    case 'postcard': return <div className={`loader-postcard ${className}`}><svg width="100%" height="100%"><path className="writing-path" d="M20,60 C30,40 50,40 60,60 C70,80 90,80 100,60" /></svg></div>;
    case 'dayNightCycle': return <div className={`loader-day-night ${className}`}><div className="sky"><div className="sun-moon"></div></div></div>;
    case 'landmark': return <div className={`loader-landmark ${className}`}><svg viewBox="0 0 100 100"><path d="M10 90 L 50 10 L 90 90 M 25 60 L 75 60"></path></svg></div>;
    case 'polaroid': return <div className={`loader-polaroid ${className}`}><div className="photo"></div></div>;
    case 'noodles': return <div className={`loader-noodles ${className}`}><div className="steam steam1"></div><div className="steam steam2"></div><div className="steam steam3"></div></div>;
    case 'treasureChest': return <div className={`loader-treasure-chest ${className}`}><div className="base"></div><div className="lid"></div><div className="glow"></div></div>;
    case 'messageInABottle': return <div className={`loader-message-bottle ${className}`}><div className="wave"></div><div className="wave wave2"></div><div className="bottle"></div></div>;
    default: return <div>Loading...</div>;
  }
};
