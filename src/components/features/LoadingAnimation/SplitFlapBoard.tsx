"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import styles from "./SplitFlapBoard.module.css";

interface SplitFlapBoardProps {
  className?: string;
  words?: string[];
  targetLength?: number;
}

const defaultWords = ["LOADING", "JOURNEY", "EXPLORE"];
const defaultTargetLength = 10;

// 文字盤ドラムの並び。実機と同じく一方向にしか回らないので、
// 目的の文字までこの順に1枚ずつめくって進む (地名スラグに必要な文字のみ)
const DRUM = " ABCDEFGHIJKLMNOPQRSTUVWXYZ-";

/** フラップ1枚の回転時間。セルごとに少しばらして機械の個体差を出す */
const STEP_MS_MIN = 60;
const STEP_MS_JITTER = 35;
/** 最後の1枚 (バウンド付き) の時間 */
const LAND_MS = 280;
/** 次の1枚をめくり始めるまでの隙間 */
const STEP_GAP_MS = 15;

/**
 * 文字列の前後を均等なスペースで埋めて中央揃えにする関数
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

/** ドラム上で1つ先の文字を返す */
function nextInDrum(char: string): string {
  const idx = DRUM.indexOf(char);
  return DRUM[(idx + 1) % DRUM.length];
}

interface Flip {
  from: string;
  to: string;
  /** 目的の文字で止まる最後の1枚か (バウンド付きアニメーションにする) */
  landing: boolean;
  /** アニメーション再トリガー用 */
  id: number;
}

/**
 * 1文字分のセル。目的の文字 (target) が変わると、ドラム順に1枚ずつ
 * フラップを落として target まで回る。
 */
const SplitFlapCell = ({ target, order }: { target: string; order: number }) => {
  const [current, setCurrent] = useState(" ");
  const [flip, setFlip] = useState<Flip | null>(null);
  const currentRef = useRef(" ");
  const flipIdRef = useRef(0);
  // セル固有のめくり速度。セル位置から決定的に散らす (乱数はレンダー中に使えない)
  const stepMs = STEP_MS_MIN + ((order * 37 + 13) % STEP_MS_JITTER);

  useEffect(() => {
    // ドラムに無い文字はスペース扱いで止める
    const goal = DRUM.includes(target) ? target : " ";
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const tick = () => {
      if (cancelled) return;
      const from = currentRef.current;
      if (from === goal) {
        setFlip(null);
        return;
      }
      const to = nextInDrum(from);
      const landing = to === goal;
      flipIdRef.current += 1;
      setFlip({ from, to, landing, id: flipIdRef.current });

      const duration = reduceMotion ? 30 : landing ? LAND_MS : stepMs;
      timer = setTimeout(() => {
        if (cancelled) return;
        currentRef.current = to;
        setCurrent(to);
        if (landing) {
          setFlip(null);
        } else {
          timer = setTimeout(tick, STEP_GAP_MS);
        }
      }, duration);
    };

    // セルごとに開始をずらし、全セル一斉に動き出す機械っぽさを消す
    timer = setTimeout(tick, Math.random() * 150);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [target, stepMs]);

  const flipMs = flip?.landing ? LAND_MS : stepMs;

  return (
    <div
      className={styles.cell}
      style={{ "--step": `${stepMs}ms`, "--land": `${LAND_MS}ms` } as React.CSSProperties}
    >
      {/* 静止面: 上半分は次の文字、下半分は今の文字 */}
      <div className={`${styles.half} ${styles.top}`} aria-hidden="true">
        <span>{flip ? flip.to : current}</span>
      </div>
      <div className={`${styles.half} ${styles.bottom}`} aria-hidden="true">
        <span>{current}</span>
      </div>
      {/* 落下フラップ: 表=前の文字の上半分 / 裏=次の文字の下半分 */}
      {flip && (
        <div
          key={flip.id}
          className={`${styles.leaf} ${flip.landing ? styles.landing : ""}`}
          style={{ animationDuration: `${flipMs}ms` }}
          aria-hidden="true"
        >
          <div className={styles.leafFront}>
            <span>{flip.from}</span>
          </div>
          <div className={styles.leafBack}>
            <span>{flip.to}</span>
          </div>
        </div>
      )}
      <div className={styles.hinge} aria-hidden="true" />
    </div>
  );
};

/**
 * パタパタ表示（スプリットフラップ）ボード。
 * ローディングではなく装飾用途（トップページのヒーローで行き先を表示）。
 * 実機のソラリー式に寄せて、文字盤を順送りで回し、着地バウンドと陰影を付けている。
 */
export const SplitFlapBoard = ({
  className = "",
  words = defaultWords,
  targetLength = defaultTargetLength,
}: SplitFlapBoardProps) => {
  const [wordIndex, setWordIndex] = useState(0);

  // 盤面の桁数は最長の単語に合わせて固定する (単語ごとにセル数が変わらないように)
  const boardLength = useMemo(
    () => Math.max(targetLength, ...words.map((w) => w.length)),
    [words, targetLength],
  );

  useEffect(() => {
    const wordInterval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 4000);
    return () => clearInterval(wordInterval);
  }, [words]);

  const word = words[wordIndex] ?? "";

  return (
    // 装飾用途のためスクリーンリーダーには読ませない (回転中の文字が逐一読まれるのを防ぐ)。
    // words は呼び出し側でシャッフルされ SSR とクライアントで並びが異なるため、
    // 文字は必ずクライアント側のエフェクトだけで描く (初期描画は全セル空白)
    <div className={`${styles.board} ${className}`} aria-hidden="true">
      {padCenter(word.toUpperCase(), boardLength)
        .split("")
        .map((char, index) => (
          <SplitFlapCell key={index} target={char} order={index} />
        ))}
    </div>
  );
};
