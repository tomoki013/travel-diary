"use client";

import * as React from "react";
import type { Variants } from "framer-motion";
import { sectionVariants, staggerContainer } from "./animation";

/**
 * スクロールで一度だけフェードインする薄い client ラッパー。
 *
 * 以前は framer-motion (`motion.*` + `whileInView`) で実装していたが、
 * このコンポーネントの動きは「opacity / translate のワンショット遷移」のみで
 * CSS transition + IntersectionObserver で完全に再現できるため、
 * ハイドレーション負荷(TBT)削減を目的に CSS 実装へ移行した。
 *
 * 互換性: `animation.ts` の `slideFadeIn()` / `fadeIn()` / `staggerContainer()`
 * が返す Variants オブジェクトをそのまま受け取り、hidden の offset と
 * visible の duration / delay を読み取って同じ値・同じイージング
 * (cubic-bezier(0.43, 0.13, 0.23, 0.96)) で再生する。
 *
 *   <Reveal as="section" className="...">...server children...</Reveal>
 *   <RevealStagger>{items.map(i => <Reveal key=...>...</Reveal>)}</RevealStagger>
 */

type RevealTag = "div" | "section" | "header" | "footer" | "article" | "ul" | "li";

const DEFAULT_EASE = "cubic-bezier(0.43, 0.13, 0.23, 0.96)";

/** animation.ts の Variants から CSS 再生に必要な値を取り出す。 */
function extractTimings(variants: Variants) {
  const hidden = (variants.hidden ?? {}) as {
    opacity?: number;
    x?: number;
    y?: number;
    scale?: number;
  };
  const visible = (variants.visible ?? {}) as {
    transition?: { duration?: number; delay?: number };
  };

  return {
    hiddenOpacity: hidden.opacity ?? 0,
    hiddenX: hidden.x ?? 0,
    hiddenY: hidden.y ?? 0,
    hiddenScale: hidden.scale ?? 1,
    duration: visible.transition?.duration ?? 0.6,
    delay: visible.transition?.delay ?? 0,
  };
}

/** 要素がビューポートに入ったら true になる(一度きり)。 */
function useInViewOnce(amount: number, enabled: boolean, margin?: string) {
  const ref = React.useRef<HTMLElement | null>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    if (!enabled || inView) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: amount, rootMargin: margin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [amount, enabled, inView, margin]);

  return { ref, inView };
}

interface StaggerContextValue {
  visible: boolean;
  staggerChildren: number;
  delayChildren: number;
}

const StaggerContext = React.createContext<StaggerContextValue | null>(null);

// RevealStagger が React.Children.map で各子に配る並び順インデックス。
// レンダリング中にカウンターを進める方式は SSR とクライアント
// (特に StrictMode の二重レンダリング)で値がずれてハイドレーション
// エラーになるため、必ず宣言的に配布する。
const StaggerIndexContext = React.createContext(0);

type RevealProps = React.HTMLAttributes<HTMLElement> & {
  as?: RevealTag;
  /** IntersectionObserver の発火しきい値（既定 0.1）。 */
  amount?: number;
  variants?: Variants;
  /** variants の duration を上書きする(旧 transition={{ duration }} 相当)。 */
  duration?: number;
  /** イージングを上書きする(旧 framer のデフォルト easeInOut を使っていた箇所用)。 */
  ease?: string;
  /** IntersectionObserver の rootMargin(旧 viewport={{ margin }} 相当)。 */
  margin?: string;
};

export function Reveal({
  as = "div",
  amount = 0.1,
  variants = sectionVariants,
  duration,
  ease,
  margin,
  style,
  children,
  ...rest
}: RevealProps) {
  const Tag = as;
  const group = React.useContext(StaggerContext);
  const groupIndex = React.useContext(StaggerIndexContext);
  const timings = extractTimings(variants);

  // 親が RevealStagger の場合は親の可視判定に従い、
  // staggerChildren ぶんの遅延を順番に上乗せする(framer-motion と同じ挙動)。
  const { ref, inView } = useInViewOnce(amount, group === null, margin);
  const visible = group ? group.visible : inView;
  // 0.6000000000000001s のような浮動小数の揺れを丸める(SSR/クライアント間の
  // style 文字列一致のためにも桁を固定する)
  const delay = Number(
    (group
      ? group.delayChildren + groupIndex * group.staggerChildren + timings.delay
      : timings.delay
    ).toFixed(3),
  );

  const effectiveDuration = duration ?? timings.duration;
  const effectiveEase = ease ?? DEFAULT_EASE;
  const transition = `opacity ${effectiveDuration}s ${effectiveEase} ${delay}s, transform ${effectiveDuration}s ${effectiveEase} ${delay}s`;

  const hiddenTransform = [
    timings.hiddenX !== 0 || timings.hiddenY !== 0
      ? `translate(${timings.hiddenX}px, ${timings.hiddenY}px)`
      : null,
    timings.hiddenScale !== 1 ? `scale(${timings.hiddenScale})` : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag
      ref={ref as React.Ref<never>}
      style={{
        ...style,
        opacity: visible ? 1 : timings.hiddenOpacity,
        transform: visible ? "none" : hiddenTransform || "none",
        transition,
        willChange: visible ? undefined : "opacity, transform",
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

type RevealStaggerProps = RevealProps & {
  staggerChildren?: number;
  delayChildren?: number;
};

export function RevealStagger({
  as = "div",
  amount = 0.1,
  staggerChildren = 0.1,
  delayChildren = 0,
  variants,
  style,
  children,
  ...rest
}: RevealStaggerProps) {
  const Tag = as;
  const { ref, inView } = useInViewOnce(amount, true);

  // variants={staggerContainer(...)} 形式で渡された場合も値を尊重する
  const fromVariants = variants
    ? ((variants.visible ?? {}) as {
        transition?: { staggerChildren?: number; delayChildren?: number };
      })
    : undefined;
  const effectiveStagger = fromVariants?.transition?.staggerChildren ?? staggerChildren;
  const effectiveDelay = fromVariants?.transition?.delayChildren ?? delayChildren;

  const ctx = React.useMemo<StaggerContextValue>(
    () => ({
      visible: inView,
      staggerChildren: effectiveStagger,
      delayChildren: effectiveDelay,
    }),
    [inView, effectiveStagger, effectiveDelay],
  );

  return (
    <StaggerContext.Provider value={ctx}>
      <Tag ref={ref as React.Ref<never>} style={style} {...rest}>
        {React.Children.map(children, (child, index) => (
          <StaggerIndexContext.Provider value={index}>{child}</StaggerIndexContext.Provider>
        ))}
      </Tag>
    </StaggerContext.Provider>
  );
}

// staggerContainer は後方互換のために再エクスポートする
// (既存コードが `variants={staggerContainer(...)}` を渡しても動作する)。
export { staggerContainer };
