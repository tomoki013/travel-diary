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

export const ArticleEmbedder: React.FC<ArticleEmbedderProps> = ({ articles }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="my-4 w-full max-w-2xl space-y-3"
    >
      <div className="text-muted-foreground flex items-center gap-2 px-1 text-sm font-bold">
        <BookOpen className="h-4 w-4" />
        詳しくはこちらの記事をチェック
      </div>
      <div className="grid grid-cols-1 gap-3">
        {articles.map((article, idx) => (
          <Link key={idx} href={`/posts/${article.slug}`} className="group block">
            <Card className="hover:border-primary/50 overflow-hidden transition-all duration-300">
              <CardContent className="flex items-center justify-between gap-4 p-4">
                <div className="space-y-1">
                  {article.category && (
                    <span className="text-primary text-[10px] font-bold tracking-wider uppercase">
                      {article.category}
                    </span>
                  )}
                  <h4 className="group-hover:text-primary text-sm font-bold transition-colors">
                    {article.title}
                  </h4>
                  <p className="text-muted-foreground line-clamp-2 text-xs">{article.summary}</p>
                </div>
                <div className="flex-shrink-0">
                  <div className="bg-muted group-hover:bg-primary/10 rounded-full p-2 transition-colors">
                    <ExternalLink className="group-hover:text-primary h-4 w-4" />
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
