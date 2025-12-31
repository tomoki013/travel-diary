import {
  FOOTER_CONTENTS_LIST,
  FOOTER_ABOUT_LIST,
  FOOTER_COMMUNITY_LIST,
  FOOTER_LEGAL_LIST,
  SOCIAL_LIST,
} from "@/constants/navigation";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-background text-foreground py-16 px-8">
      {/* アフィリエイトポリシー */}
      <div className="italic">
        <p>
          ※当サイトはアフィリエイト広告を利用しています。掲載する商品・サービスは、運営者が実際に試し、自信を持っておすすめできるものに限定しています。
          詳しい運営方針については
          <Link
            href={`/affiliates`}
            className="text-secondary underline hover:text-primary"
          >
            アフィリエイトポリシー
          </Link>
          をご覧ください。
        </p>
      </div>
      <div className="container py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-5">
          <div className="space-y-3 md:col-span-1">
            <Link href="/" className="text-lg font-heading font-bold">
              ともきちの旅行日記
            </Link>
            <p className="text-sm text-muted-foreground font-heading">
              日本と世界の旅行記録と観光情報を発信するブログサイトです。
            </p>
            <div className="flex space-x-3">
              {SOCIAL_LIST.map((sns) => (
                <Link
                  key={sns.name}
                  href={sns.pass}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl text-muted-foreground hover:text-secondary"
                >
                  {sns.icon}
                  <span className="sr-only">{sns.name}</span>
                </Link>
              ))}
            </div>
            <Link
              href={`/social`}
              className="text-lg text-muted-foreground font-code hover:text-secondary"
            >
              Follow Me
            </Link>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-medium">旅行コンテンツ</h3>
            <ul className="space-y-2 text-sm">
              {FOOTER_CONTENTS_LIST.map((content) => (
                <li key={content.name}>
                  <Link
                    href={content.pass}
                    className="flex items-center text-muted-foreground hover:text-secondary"
                    target={content.target}
                    rel={
                      content.target === "_blank"
                        ? "noopener noreferrer"
                        : undefined
                    }
                  >
                    {content.name}
                    {content.isNew && (
                      <span className="ml-2 rounded-md bg-primary px-1.5 py-0.5 text-xs font-semibold leading-none text-primary-foreground">
                        NEW
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-medium">サイト情報</h3>
            <ul className="space-y-2 text-sm">
              {FOOTER_ABOUT_LIST.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.pass}
                    className="text-muted-foreground hover:text-secondary"
                    target={link.target}
                    rel={
                      link.target === "_blank"
                        ? "noopener noreferrer"
                        : undefined
                    }
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-medium">お問い合わせ・参加</h3>
            <ul className="space-y-2 text-sm">
              {FOOTER_COMMUNITY_LIST.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.pass}
                    className="text-muted-foreground hover:text-secondary"
                    target={link.target}
                    rel={
                      link.target === "_blank"
                        ? "noopener noreferrer"
                        : undefined
                    }
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-medium">法務情報</h3>
            <ul className="space-y-2 text-sm">
              {FOOTER_LEGAL_LIST.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.pass}
                    className="text-muted-foreground hover:text-secondary"
                    target={link.target}
                    rel={
                      link.target === "_blank"
                        ? "noopener noreferrer"
                        : undefined
                    }
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-secondary to-transparent" />

        <div className="text-center text-sm text-muted-foreground">
          <p>&copy; 2024-2026 ともきちの旅行日記. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
