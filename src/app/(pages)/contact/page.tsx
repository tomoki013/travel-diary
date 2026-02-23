import ContactForm from "./ContactForm";
import { Metadata } from "next";
import { Mail, Github } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description:
    "ご質問、ご意見、ご提案などがございましたら、お気軽にお問い合わせください。",
  openGraph: {
    title: "お問い合わせ",
    description:
      "ご質問、ご意見、ご提案などがございましたら、お気軽にお問い合わせください。",
  },
  twitter: {
    title: "お問い合わせ",
    description:
      "ご質問、ご意見、ご提案などがございましたら、お気軽にお問い合わせください。",
  },
};

const ContactPage = () => {
  return (
    <div className="container px-4 sm:px-6 lg:mx-8 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">お問い合わせ</h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          ご質問、ご意見、ご提案などがございましたら、お気軽にお問い合わせください。
        </p>
      </div>
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
        <ContactForm />
        <div className="md:col-span-1">
          <div className="bg-background rounded-lg shadow p-6 border sticky top-20">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full"></span>
              その他の連絡方法
            </h2>
            <div className="space-y-4">
              <Link
                href="mailto:tomokichidiary@gmail.com"
                className="group flex items-start p-4 rounded-lg border bg-card hover:bg-accent/50 hover:shadow-md transition-all duration-300"
              >
                <div className="mr-4 p-2 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                  <Mail className="h-5 w-5 text-primary shrink-0" />
                </div>
                <div>
                  <h3 className="text-sm font-bold mb-1 group-hover:text-primary transition-colors">メール</h3>
                  <p className="text-sm text-muted-foreground break-all">
                    tomokichidiary@gmail.com
                  </p>
                </div>
              </Link>

              <Link
                href="https://github.com/tomoki013/travel-diary"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start p-4 rounded-lg border bg-card hover:bg-accent/50 hover:shadow-md transition-all duration-300"
              >
                <div className="mr-4 p-2 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                  <Github className="h-5 w-5 text-primary shrink-0" />
                </div>
                <div>
                  <h3 className="text-sm font-bold mb-1 group-hover:text-primary transition-colors">Github Issues</h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    開発者向け（バグ報告・機能要望など）
                  </p>
                  <p className="text-xs text-primary/70 break-all font-mono bg-muted/50 p-1 rounded inline-block">
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
