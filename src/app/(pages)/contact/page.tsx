import ContactForm from "./ContactForm";
import { Mail, Github } from "lucide-react";
import Link from "next/link";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata = createPageMetadata({
  title: "お問い合わせ",
  description: "ご質問、ご意見、ご提案などがございましたら、お気軽にお問い合わせください。",
  path: "/contact",
});

const ContactPage = () => {
  return (
    <div className="container px-4 py-16 sm:px-6 lg:mx-8">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">お問い合わせ</h1>
        <p className="text-muted-foreground mx-auto max-w-2xl">
          ご質問、ご意見、ご提案などがございましたら、お気軽にお問い合わせください。
        </p>
      </div>
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
        <ContactForm />
        <div className="md:col-span-1">
          <div className="bg-background sticky top-20 rounded-lg border p-6 shadow">
            <h2 className="mb-6 flex items-center gap-2 text-lg font-bold">
              <span className="bg-primary h-6 w-1 rounded-full"></span>
              その他の連絡方法
            </h2>
            <div className="space-y-4">
              <Link
                href="mailto:tomokichidiary@gmail.com"
                className="group bg-card hover:bg-accent/50 flex items-start rounded-lg border p-4 transition-all duration-300 hover:shadow-md"
              >
                <div className="bg-primary/10 group-hover:bg-primary/20 mr-4 rounded-full p-2 transition-colors">
                  <Mail className="text-primary h-5 w-5 shrink-0" />
                </div>
                <div>
                  <h3 className="group-hover:text-primary mb-1 text-sm font-bold transition-colors">
                    メール
                  </h3>
                  <p className="text-muted-foreground text-sm break-all">
                    tomokichidiary@gmail.com
                  </p>
                </div>
              </Link>

              <Link
                href="https://github.com/tomoki013/travel-diary"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-card hover:bg-accent/50 flex items-start rounded-lg border p-4 transition-all duration-300 hover:shadow-md"
              >
                <div className="bg-primary/10 group-hover:bg-primary/20 mr-4 rounded-full p-2 transition-colors">
                  <Github className="text-primary h-5 w-5 shrink-0" />
                </div>
                <div>
                  <h3 className="group-hover:text-primary mb-1 text-sm font-bold transition-colors">
                    Github Issues
                  </h3>
                  <p className="text-muted-foreground mb-2 text-xs">
                    開発者向け（バグ報告・機能要望など）
                  </p>
                  <p className="text-primary/70 bg-muted/50 inline-block rounded p-1 font-mono text-xs break-all">
                    tomoki013/travel-diary
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
