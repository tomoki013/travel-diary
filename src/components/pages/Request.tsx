import { Reveal } from "@/components/common/Reveal";
import Button from "../common/Button";

const Request = () => {
  return (
    <Reveal as="section" className="bg-background text-foreground py-12 md:py-16">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">あなたの見たい景色はどこですか？</h2>
        <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg leading-relaxed">
          「あの国のこんな情報が知りたい」「この街の景色を見てみたい」など、
          あなたが気になっている旅のテーマを教えてください。
          <br className="hidden md:block" />
          いただいたリクエストが、次の冒険の目的地になるかもしれません。
        </p>
        <Button href={`/request`}>リクエストを送る</Button>
      </div>
    </Reveal>
  );
};

export default Request;
