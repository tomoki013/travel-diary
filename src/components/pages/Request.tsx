"use client";

import { motion } from "framer-motion";
import { sectionVariants } from "../common/animation";
import Button from "../common/Button";

const Request = () => {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={sectionVariants}
      className="bg-background text-foreground py-12 md:py-16"
    >
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          あなたの見たい景色はどこですか？
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
          「あの国のこんな情報が知りたい」「この街の景色を見てみたい」など、
          あなたが気になっている旅のテーマを教えてください。<br className="hidden md:block"/>
          いただいたリクエストが、次の冒険の目的地になるかもしれません。
        </p>
        <Button href={`/request`}>リクエストを送る</Button>
      </div>
    </motion.section>
  );
};

export default Request;
