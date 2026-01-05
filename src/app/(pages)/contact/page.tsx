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
      "ご質問、ご意見、ご提案などがpigございましたら、お気軽にお問い合わせください。",
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
          <div className="bg-background rounded-lg shadow p-6">
            <h2 className="text-lg font-bold mb-6">その他の連絡方法</h2>
            <div className="space-y-6">
              <Link
                href="mailto:tomokichidiary@gmail.com"
                className="flex items-start p-2 -mx-2 rounded-md hover:bg-muted transition-colors"
              >
                <Mail className="mr-3 h-5 w-5 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="text-sm font-medium mb-1">メール</h3>
                  <p className="text-sm text-muted-foreground break-all">
                    tomokichidiary@gmail.com
                  </p>
                </div>
              </Link>

              <Link
                href="https://github.com/tomoki013/travel-diary"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start p-2 -mx-2 rounded-md hover:bg-muted transition-colors"
              >
                <Github className="mr-3 h-5 w-5 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="text-sm font-medium mb-1">Github Issues</h3>
                  <p className="text-xs text-muted-foreground mb-1">
                    開発者向け（バグ報告・機能要望など）
                  </p>
                  <p className="text-sm text-muted-foreground break-all">
                    https://github.com/tomoki013/travel-diary
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
