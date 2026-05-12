import { useState, useEffect } from "react";

/**
 * カスタムフック: 値のデバウンスを行う
 * @param value デバウンス対象の値
 * @param delay デバウンスの遅延時間 (ミリ秒)
 * @returns デバウンスされた値
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // valueが変更された後、指定されたdelay後にdebouncedValueを更新するタイマーを設定
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 次のeffectが実行される前、またはコンポーネントがアンマウントされる時にタイマーをクリア
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // valueまたはdelayが変更された場合にのみeffectを再実行

  return debouncedValue;
}
