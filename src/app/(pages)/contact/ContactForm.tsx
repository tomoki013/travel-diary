"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { User, Mail, Heading, MessageSquare, Send, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { sendContactForm } from "@/services/contactService";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "お名前は2文字以上で入力してください。",
  }),
  email: z.string().email({
    message: "有効なメールアドレスを入力してください。",
  }),
  subject: z.string().min(5, {
    message: "件名は5文字以上で入力してください。",
  }),
  message: z.string().min(10, {
    message: "メッセージは10文字以上で入力してください。",
  }),
  inquiryType: z.string().min(1, {
    message: "お問い合わせの種類を選択してください。",
  }),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "プライバシーポリシーに同意する必要があります。",
  }),
});

type ContactFormValues = z.infer<typeof formSchema>;

const ContactForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      agreeToTerms: false,
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      await sendContactForm(values);
      setIsSubmitted(true);
    } catch {
      setErrorMessage(
        "メール送信に失敗しました。もう一度お試しいただくか、ネットワーク接続を確認してください。",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="md:col-span-2">
      {isSubmitted ? (
        <Card className="border-t-primary overflow-hidden border-t-4 shadow-xl">
          <div className="from-primary/10 h-1 bg-gradient-to-r to-transparent p-1" />
          <CardHeader className="bg-muted/10 pb-8">
            <CardTitle className="text-center text-2xl">お問い合わせありがとうございます</CardTitle>
            <CardDescription className="mt-2 text-center text-base">
              メッセージを受け付けました。通常2営業日以内にご返信いたします。
            </CardDescription>
          </CardHeader>
          <CardContent className="mx-auto max-w-lg pt-8 text-center">
            <div className="mb-8 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                <Send className="h-8 w-8" />
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              ご質問やご意見をお寄せいただき、誠にありがとうございます。
              <br />
              内容を確認次第、担当者より折り返しご連絡させていただきます。
            </p>
          </CardContent>
          <CardFooter className="justify-center pb-8">
            <Button
              onClick={() => setIsSubmitted(false)}
              variant="outline"
              className="min-w-[200px]"
            >
              新しいお問い合わせ
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="border-muted/40 bg-card/50 overflow-hidden shadow-xl backdrop-blur-sm">
          <div className="from-primary/80 to-secondary/80 h-1.5 w-full bg-gradient-to-r" />
          <CardHeader className="bg-muted/10 border-border/50 border-b pb-8">
            <CardTitle className="flex items-center gap-2 text-2xl font-bold">
              お問い合わせフォーム
            </CardTitle>
            <CardDescription className="mt-2 text-base">
              以下のフォームに必要事項をご記入ください。
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            {errorMessage && (
              <div className="bg-destructive/15 text-destructive border-destructive/20 mb-6 rounded-md border p-4 text-sm font-medium">
                {errorMessage}
              </div>
            )}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground/80 font-bold">
                          お名前 <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="group relative">
                            <User className="text-muted-foreground group-focus-within:text-primary absolute top-2.5 left-3 h-4 w-4 transition-colors" />
                            <Input
                              placeholder="山田 太郎"
                              className="bg-background/50 border-input/60 focus:bg-background h-11 pl-9 transition-all"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground/80 font-bold">
                          メールアドレス <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="group relative">
                            <Mail className="text-muted-foreground group-focus-within:text-primary absolute top-2.5 left-3 h-4 w-4 transition-colors" />
                            <Input
                              placeholder="example@email.com"
                              className="bg-background/50 border-input/60 focus:bg-background h-11 pl-9 transition-all"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="inquiryType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80 font-bold">
                        お問い合わせの種類 <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background/50 border-input/60 focus:bg-background h-11 transition-all">
                            <SelectValue placeholder="お問い合わせの種類を選択してください" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="general">一般的なお問い合わせ</SelectItem>
                          <SelectItem value="feedback">サイトへのご意見・ご感想</SelectItem>
                          <SelectItem value="collaboration">コラボレーションのご提案</SelectItem>
                          <SelectItem value="correction">記事内容の修正依頼</SelectItem>
                          <SelectItem value="other">その他</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80 font-bold">
                        件名 <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="group relative">
                          <Heading className="text-muted-foreground group-focus-within:text-primary absolute top-2.5 left-3 h-4 w-4 transition-colors" />
                          <Input
                            placeholder="お問い合わせの件名"
                            className="bg-background/50 border-input/60 focus:bg-background h-11 pl-9 transition-all"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80 font-bold">
                        メッセージ <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="group relative">
                          <MessageSquare className="text-muted-foreground group-focus-within:text-primary absolute top-3 left-3 h-4 w-4 transition-colors" />
                          <Textarea
                            placeholder="お問い合わせ内容を入力してください"
                            className="bg-background/50 border-input/60 focus:bg-background min-h-[150px] resize-y pl-9 transition-all"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="agreeToTerms"
                  render={({ field }) => (
                    <FormItem className="border-border/50 bg-muted/20 space-y-4 rounded-xl border p-5 shadow-sm">
                      <div className="border-border/40 space-y-3 border-b pb-3">
                        <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
                          <Link
                            href="/privacy"
                            className="text-primary hover:text-primary/80 inline-flex items-center gap-1 text-sm font-medium transition-colors hover:underline"
                            target="_blank"
                          >
                            プライバシーポリシー
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                          <Link
                            href="/terms"
                            className="text-primary hover:text-primary/80 inline-flex items-center gap-1 text-sm font-medium transition-colors hover:underline"
                            target="_blank"
                          >
                            利用規約
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>

                      <div className="flex flex-row items-center space-y-0 space-x-3 pt-1">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground mt-0.5 h-5 w-5"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="cursor-pointer text-base font-medium">
                            上記の内容に同意します
                          </FormLabel>
                          <p className="text-muted-foreground pt-1 text-xs">
                            お問い合わせいただいた内容は、お問い合わせへの回答のみに使用します。
                          </p>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "h-12 w-full text-base font-bold tracking-wide shadow-lg transition-all duration-300",
                    "from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 bg-gradient-to-r hover:scale-[1.01] active:scale-[0.99]",
                  )}
                >
                  {isSubmitting ? "送信中..." : "送信する"}
                  {!isSubmitting && <Send className="ml-2 h-4 w-4" />}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContactForm;
