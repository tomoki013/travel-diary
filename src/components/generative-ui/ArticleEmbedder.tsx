"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, BookOpen } from "lucide-react";
import Link from "next/link";

interface Article {
  title: string;
  slug: string;
  summary: string;
  category?: string;
}

interface ArticleEmbedderProps {
  articles: Article[];
}

export const ArticleEmbedder: React.FC<ArticleEmbedderProps> = ({
  articles,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-2xl my-4 space-y-3"
    >
      <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground px-1">
        <BookOpen className="w-4 h-4" />
        詳しくはこちらの記事をチェック
      </div>
      <div className="grid grid-cols-1 gap-3">
        {articles.map((article, idx) => (
          <Link key={idx} href={`/posts/${article.slug}`} className="block group">
            <Card className="hover:border-primary/50 transition-all duration-300 overflow-hidden">
              <CardContent className="p-4 flex justify-between items-center gap-4">
                <div className="space-y-1">
                  {article.category && (
                    <span className="text-[10px] uppercase tracking-wider text-primary font-bold">
                      {article.category}
                    </span>
                  )}
                  <h4 className="font-bold text-sm group-hover:text-primary transition-colors">
                    {article.title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {article.summary}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="p-2 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                    <ExternalLink className="w-4 h-4 group-hover:text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </motion.div>
  );
};
