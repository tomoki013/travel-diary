"use client";

import { useEffect, useState } from "react";

const STEPS = [
  "旅行の目的を読み取り中",
  "関連する旅行記を選定中",
  "ページ構成を生成中",
  "コンポーネントを組み立て中",
];

const STEP_DURATION_MS = 1800;

export function LoadingSteps() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }, STEP_DURATION_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center py-16 gap-8">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-zinc-200 dark:border-zinc-700" />
        <div className="absolute inset-0 rounded-full border-2 border-t-zinc-900 dark:border-t-zinc-100 animate-spin" />
      </div>

      <div className="space-y-2 w-full max-w-xs">
        <p className="text-center text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-4">
          トップページを設計しています
        </p>
        {STEPS.map((step, i) => {
          const isDone = i < currentStep;
          const isActive = i === currentStep;
          return (
            <div
              key={i}
              className={`flex items-center gap-2.5 text-sm transition-opacity duration-500 ${
                isDone || isActive ? "opacity-100" : "opacity-30"
              }`}
            >
              <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                {isDone ? (
                  <span className="text-emerald-500">✓</span>
                ) : isActive ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                )}
              </span>
              <span
                className={
                  isDone
                    ? "text-zinc-400 dark:text-zinc-500"
                    : isActive
                    ? "text-zinc-900 dark:text-zinc-100 font-medium"
                    : "text-zinc-400 dark:text-zinc-600"
                }
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
