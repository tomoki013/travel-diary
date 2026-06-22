import Image from "next/image";
import { Reveal } from "@/components/common/Reveal";

const AboutMeSection = () => {
  return (
    <Reveal as="section" className="py-20 md:py-28">
      <div className="text-foreground mx-auto max-w-5xl px-6">
        <h2 className="mb-16 text-center text-3xl font-bold md:text-4xl">
          中の人について - About Me
        </h2>
        {/* 設計書のジグザグレイアウトを実装 */}
        <div className="space-y-20">
          <div className="flex flex-col items-center gap-10 md:flex-row md:gap-16">
            {/* CSS(max-h)で高さだけ変えると next/image がアスペクト比警告を
                出すため、コンテナ+fill で明示的に切り抜く */}
            <div className="relative h-100 w-full overflow-hidden rounded-lg shadow-lg md:w-1/2">
              <Image
                src="/images/Introduce/introduce.jpg"
                alt="ともきちのプロフィール写真"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="w-full md:w-1/2">
              <h3 className="mb-4 text-2xl font-bold">旅に魅せられて</h3>
              <p className="text-base leading-relaxed md:text-lg">
                京都在住の大学生です。特に好きなのは、歴史を感じる建築物と、その土地の空気を一変させる夕陽を眺める時間です。
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-10 md:flex-row-reverse md:gap-16">
            <div className="w-full md:w-1/2">
              <Image
                src="/images/Greece/fira-shopping-street.jpg"
                alt="旅の様子のスナップ写真"
                width={600}
                height={600}
                className="max-h-100 overflow-hidden rounded-lg object-cover shadow-lg"
              />
            </div>
            <div className="w-full md:w-1/2">
              <h3 className="mb-4 text-2xl font-bold">私の旅のスタイル</h3>
              <p className="text-base leading-relaxed md:text-lg">
                私の旅は、有名な観光地を巡るだけでなく、現地の人が通うカフェでのんびりしたり、裏路地をあてもなく散策したり、その土地の日常に溶け込むことを大切にしています。このブログでは、そうしたリアルな現地の雰囲気も伝えていきたいと思っています。
              </p>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
};

export default AboutMeSection;
