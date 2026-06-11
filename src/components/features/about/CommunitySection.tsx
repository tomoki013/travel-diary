"use client";

import Link from "next/link";
import { m } from "framer-motion";
import { sectionVariants } from "@/components/common/animation";

const CommunitySection = () => {
  return (
    <m.section
      className="bg-foreground text-background py-20 md:py-28"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={sectionVariants}
    >
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="mb-6 text-3xl font-bold md:text-4xl">
          一緒に旅をしませんか？ - Let&apos;s Journey Together
        </h2>
        <p className="mb-10 text-lg">
          このブログは、読者の皆さんと一緒に作り上げていきたいと思っています。
          <br />
          SNSでの交流や、記事テーマの提案など、お気軽にご参加ください。
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <m.div
            className="inline-block rounded-full border-2 border-orange-400 bg-transparent px-8 py-3 font-bold text-orange-400 transition-colors duration-300 hover:bg-orange-400 hover:text-gray-900"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href={`/social`}>SNSで繋がる</Link>
          </m.div>
          <m.div
            className="inline-block rounded-full border-2 border-orange-400 bg-transparent px-8 py-3 font-bold text-orange-400 transition-colors duration-300 hover:bg-orange-400 hover:text-gray-900"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href={`/request`}>記事テーマを提案する</Link>
          </m.div>
        </div>
      </div>
    </m.section>
  );
};

export default CommunitySection;
