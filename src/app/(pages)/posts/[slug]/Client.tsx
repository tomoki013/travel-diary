"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { slideFadeIn } from "@/components/common/animation";
import { members } from "@/data/member";
import { Post } from "@/types/types";
import RelatedPosts from "@/components/features/article/RelatedPosts";
import TableOfContent from "@/components/features/article/TableOfContent";
import PostHeader from "@/components/features/article/PostHeader";
import PostNavigation from "@/components/features/article/PostNavigation";
import Button from "@/components/common/Button";
import ShareButtons from "@/components/features/article/ShareButtons";
import AffiliateCard from "@/components/common/AffiliateCard";
import { affiliates } from "@/constants/affiliates";
import AffiliateSection from "@/components/features/affiliates/AffiliateSection";
import React from "react";
import ArticleCTASection from "@/components/features/revenue/ArticleCTASection";
import { NextStepLinks } from "@/components/features/revenue/RevenueComponents";
import CostBreakdown from "@/components/features/article/CostBreakdown";
import GlobePromo from "@/components/features/promo/GlobePromo";
import { cn } from "@/lib/utils";
import FocusModeToggle from "@/components/features/article/focus-mode/FocusModeToggle";
import {
  FocusMode,
  useFocusMode,
} from "@/components/features/article/focus-mode/FocusModeContext";

interface ClientProps {
  children: React.ReactNode;
  post: Post;
  previousPost?: { href: string; title: string };
  nextPost?: { href: string; title: string };
  regionRelatedPosts?: Omit<Post, "content">[];
  previousCategoryPost?: { href: string; title: string };
  nextCategoryPost?: { href: string; title: string };
  previousSeriesPost?: { href: string; title: string };
  nextSeriesPost?: { href: string; title: string };
  nextActionPosts?: Omit<Post, "content">[];
}

const ITINERARY_SLUG_MAP: Record<string, string> = {
  "europe-itinerary": "europe-trip-2025",
  "thai-itinerary": "bangkok-trip-2024",
};

const TRIP_ID_MAP: Record<string, string> = {
  "europe-trip": "europe-trip-2025",
  "bangkok-trip": "bangkok-trip-2024",
};

const FOCUS_SECTION_TRANSITION = {
  type: "spring",
  stiffness: 210,
  damping: 32,
  mass: 1,
} as const;

type FocusSectionProps = {
  show: boolean;
  children: React.ReactNode;
  className?: string;
};

const FocusSection = ({ show, children, className }: FocusSectionProps) => (
  <AnimatePresence initial={false}>
    {show ? (
      <motion.div
        layout
        initial={{ opacity: 0, height: 0, y: 12 }}
        animate={{ opacity: 1, height: "auto", y: 0 }}
        exit={{ opacity: 0, height: 0, y: 12 }}
        transition={FOCUS_SECTION_TRANSITION}
        className={cn("overflow-hidden", className)}
      >
        {children}
      </motion.div>
    ) : null}
  </AnimatePresence>
);

const isArticleContentElement = (
  node: React.ReactNode,
): node is React.ReactElement<{
  focusMode?: FocusMode;
  content: string;
  allPosts: unknown;
  currentPostCategory: unknown;
}> => {
  if (!React.isValidElement(node)) {
    return false;
  }

  const props = node.props as {
    content?: unknown;
    allPosts?: unknown;
    currentPostCategory?: unknown;
  };

  return (
    props.content !== undefined &&
    props.allPosts !== undefined &&
    props.currentPostCategory !== undefined
  );
};

const Client = ({
  children,
  post,
  previousPost,
  nextPost,
  regionRelatedPosts,
  previousCategoryPost,
  nextCategoryPost,
  previousSeriesPost,
  nextSeriesPost,
  nextActionPosts = [],
}: ClientProps) => {
  const author = members.find((m) => m.name === post.author);
  const { focusMode, isFocusActive } = useFocusMode();
  const isMinimalOrHigher = focusMode !== "off";
  const isStandardOrHigher =
    focusMode === "standard" || focusMode === "maximum";
  const isMaximum = focusMode === "maximum";

  let queryParams:
    | { trip?: string; country?: string; region?: string }
    | undefined = undefined;

  if (post.category === "itinerary") {
    if (ITINERARY_SLUG_MAP[post.slug]) {
      queryParams = { trip: ITINERARY_SLUG_MAP[post.slug] };
    } else if (post.series && TRIP_ID_MAP[post.series]) {
      queryParams = { trip: TRIP_ID_MAP[post.series] };
    }
  } else if (post.location && post.location.length > 0) {
    for (const loc of post.location) {
      const normalizedLoc = loc.toLowerCase().trim();
      const LOCATION_MAP: Record<
        string,
        { country?: string; region?: string }
      > = {
        paris: { region: "paris" },
        france: { country: "france" },
        bangkok: { region: "bangkok" },
        thai: { country: "thailand" },
        thailand: { country: "thailand" },
        spain: { country: "spain" },
        barcelona: { region: "barcelona" },
        madrid: { region: "madrid" },
        toledo: { region: "toledo" },
        italy: { country: "italy" },
        roma: { region: "rome" },
        rome: { region: "rome" },
        greece: { country: "greece" },
        athens: { region: "athens" },
        santorini: { region: "santorini" },
        japan: { country: "japan" },
        hokkaido: { region: "hokkaido" },
        kyoto: { region: "kyoto" },
        tokyo: { region: "tokyo" },
        vietnam: { country: "vietnam" },
        india: { country: "india" },
        delhi: { region: "new-delhi" },
        seoul: { region: "seoul" },
        soul: { region: "seoul" },
        "south-korea": { country: "south-korea" },
        varanasi: { region: "varanasi" },
        europe: { region: "europe" },
      };

      if (LOCATION_MAP[normalizedLoc]) {
        queryParams = LOCATION_MAP[normalizedLoc];
        break;
      }
    }
  }

  const childrenWithFocusMode = React.Children.map(children, (child) => {
    if (isArticleContentElement(child)) {
      return React.cloneElement(child, { focusMode });
    }
    return child;
  });

  return (
    <div className="relative">
      <FocusModeToggle />

      <AnimatePresence initial={false}>
        {isFocusActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none fixed inset-0 z-30 bg-black/12"
          />
        )}
      </AnimatePresence>

      <motion.div
        layout
        transition={FOCUS_SECTION_TRANSITION}
        className={cn(
          "relative z-40 mx-auto w-full px-4 py-12 transition-[max-width] duration-700 sm:px-6 lg:px-8",
          isFocusActive ? "max-w-[1180px]" : "max-w-4xl"
        )}
      >
        <motion.div layout transition={FOCUS_SECTION_TRANSITION}>
          <PostHeader post={post} variant={isMaximum ? "titleOnly" : "full"} />
        </motion.div>

        {post.costs && (
          <FocusSection show={!isMaximum}>
            <CostBreakdown costs={post.costs} />
          </FocusSection>
        )}

        {post.category === "itinerary" && (
          <FocusSection show={!isMaximum}>
            <GlobePromo className="py-8 px-0" queryParams={queryParams} />
          </FocusSection>
        )}

        <FocusSection show={!isMinimalOrHigher}>
          <TableOfContent />
        </FocusSection>

        <motion.div
          layout
          transition={FOCUS_SECTION_TRANSITION}
          className="mt-12 w-full"
        >
          <article className="max-w-none">{childrenWithFocusMode}</article>
          <ArticleCTASection revenueCategory={post.revenueCategory} />
          <NextStepLinks posts={nextActionPosts} />
        </motion.div>

        <div className="mt-8 text-right">
          <p className="text-xs text-gray-400">
            本記事の大部分の執筆および最終確認は執筆者が行っておりますが、一部執筆のサポートとしてAIを使用しています。
            <br />
            内容の正当性は執筆者が保証しますが、これは記事の内容によって生じた損害等の責任を負うものではありません。詳しくは
            <Link
              href="/privacy-policy"
              className="underline hover:text-gray-600"
            >
              プライバシーポリシー
            </Link>
            をご確認ください。
          </p>
        </div>

        {post.isPromotion && post.promotionPG && (
          <FocusSection show={!isStandardOrHigher} className="my-12">
            <h2 className="mb-6 text-center text-2xl font-bold">
              この記事で紹介したサービス
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {affiliates
                .filter(
                  (affiliate) =>
                    post.promotionPG?.includes(affiliate.name) &&
                    affiliate.status === "ready",
                )
                .map((affiliate) => (
                  <AffiliateCard
                    key={affiliate.name}
                    affiliate={affiliate}
                    type={affiliate.type}
                  />
                ))}
            </div>
          </FocusSection>
        )}

        <motion.footer
          className="mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={slideFadeIn()}
        >
          <FocusSection show={!isStandardOrHigher}>
            <ShareButtons post={post} />
          </FocusSection>

          <div className="mt-10 grid gap-8 md:gap-12">
            <FocusSection
              show={!isStandardOrHigher}
              className="order-2 md:order-1"
            >
              <PostNavigation
                previousPost={previousPost}
                nextPost={nextPost}
                previousCategoryPost={previousCategoryPost}
                nextCategoryPost={nextCategoryPost}
                previousSeriesPost={previousSeriesPost}
                nextSeriesPost={nextSeriesPost}
                series={post.series}
                category={post.category}
              />
            </FocusSection>

            <FocusSection
              show={!isStandardOrHigher}
              className="order-1 space-y-8 md:order-2"
            >
              <div className="flex items-center gap-6 rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
                <Image
                  src={author?.image || "/favicon.ico"}
                  alt={author?.name || "ともきちの旅行日記"}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
                <div>
                  <h3 className="text-lg font-bold">
                    {author?.name || "ともきちの旅行日記"}
                  </h3>
                  <p className="mb-2 text-gray-600 dark:text-gray-400">
                    {author?.description || ""}
                  </p>
                  <Link
                    href="/about"
                    className="font-semibold text-teal-600 hover:text-teal-700"
                  >
                    プロフィール詳細へ →
                  </Link>
                </div>
              </div>
              {post.category !== "itinerary" && (
                <GlobePromo className="px-0 py-4" queryParams={queryParams} />
              )}
              {regionRelatedPosts && (
                <RelatedPosts posts={regionRelatedPosts} />
              )}
            </FocusSection>

            <div className="order-3 text-center md:order-3">
              <Button href={`/posts`}>ブログ一覧へ</Button>
            </div>
          </div>
        </motion.footer>

        <FocusSection
          show={!isStandardOrHigher}
          className="mt-12 border-t border-dashed border-gray-200 pt-12 dark:border-gray-700"
        >
          <AffiliateSection
            title="おすすめの航空券予約"
            category="flight"
            description="お得な航空券を見つけて、旅の準備を始めましょう。"
          />
          <AffiliateSection
            title="おすすめのホテル予約"
            category="hotel"
            description="快適な滞在先を予約して、リラックスした時間を。"
          />
          <AffiliateSection
            title="おすすめの現地ツアー・アクティビティ"
            category="activity"
            description="ユニークな体験で、旅をもっと特別なものに。"
          />
          <AffiliateSection
            title="旅行に便利なサービス"
            category="esim"
            description="eSIMやWi-Fiなど、旅を快適にするアイテム。"
          />
        </FocusSection>
      </motion.div>
    </div>
  );
};

export default Client;
