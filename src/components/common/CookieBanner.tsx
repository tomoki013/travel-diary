"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { X, Cookie, CheckCircle } from "lucide-react"; // CookieとCheckCircleアイコンをインポート

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false); // 同意状態を管理

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    const dismissed = sessionStorage.getItem("cookie_dismissed");

    if (consent !== "true" && dismissed !== "true") {
      setShowBanner(true);
    }
  }, []);

  // 「同意する」ボタンの処理
  const handleAccept = () => {
    setIsAgreed(true); // アイコンを切り替える
    localStorage.setItem("cookie_consent", "true");

    // 1.5秒後にバナーを非表示にする
    setTimeout(() => {
      setShowBanner(false);
    }, 1500);
  };

  // 「×」ボタンの処理
  const handleDismiss = () => {
    sessionStorage.setItem("cookie_dismissed", "true");
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: "100%" }} // 初期状態（画面下外）
          animate={{ y: 0 }} // 表示状態（画面下）
          exit={{ y: "100%" }} // 終了状態（画面下外へ）
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm p-4 border-t border-border"
        >
          <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 relative">
            <button
              onClick={handleDismiss}
              className="absolute -top-2 -right-2 sm:top-1/2 sm:-translate-y-1/2 sm:-right-10 text-muted-foreground hover:text-foreground disabled:opacity-50"
              aria-label="閉じる"
              disabled={isAgreed} // 同意後は無効化
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-x-3">
              {/* アイコンの切り替え */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={isAgreed ? "check" : "cookie"}
                  initial={{ scale: 0.5, opacity: 0, rotate: -30 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0.5, opacity: 0, rotate: 30 }}
                  transition={{ duration: 0.3 }}
                >
                  {isAgreed ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <Cookie className="h-6 w-6 text-primary" />
                  )}
                </motion.div>
              </AnimatePresence>
              <p className="text-sm text-foreground text-center sm:text-left">
                {isAgreed
                  ? "ご協力ありがとうございます！"
                  : "当サイトでは、サービスの向上と最適なユーザー体験を提供するためにCookieを使用しています。"}
              </p>
            </div>

            <motion.div
              animate={{ opacity: isAgreed ? 0 : 1 }} // 同意後はボタンをフェードアウト
              transition={{ duration: 0.2 }}
              className="flex-shrink-0 flex items-center gap-x-2"
            >
              <Button
                asChild
                variant="outline"
                size="sm"
                disabled={isAgreed}
                onClick={handleDismiss}
              >
                <Link href="/cookie-policy">詳細を見る</Link>
              </Button>
              <Button onClick={handleAccept} size="sm" disabled={isAgreed}>
                同意する
              </Button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;
