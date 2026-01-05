"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { User, Mail, Heading, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
    try {
      await sendContactForm(values);
      setIsSubmitted(true);
    } catch {
      setErrorMessage(
        "メール送信に失敗しました。もう一度お試しいただくか、ネットワーク接続を確認してください。"
      );
    }
  };

  return (
    <div className="md:col-span-2">
      {isSubmitted ? (
        <Card>
          <CardHeader>
            <CardTitle>お問い合わせありがとうございます</CardTitle>
            <CardDescription>
              メッセージを受け付けました。通常2営業日以内にご返信いたします。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              ご質問やご意見をお寄せいただき、誠にありがとうございます。
              内容を確認次第、担当者より折り返しご連絡させていただきます。
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => setIsSubmitted(false)}>
              新しいお問い合わせ
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>お問い合わせフォーム</CardTitle>
            <CardDescription>
              以下のフォームに必要事項をご記入ください。
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <div className="mb-4 text-sm text-red-600">{errorMessage}</div>
            )}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>お名前</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="山田 太郎" className="pl-9" {...field} />
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
                        <FormLabel>メールアドレス</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="example@email.com" className="pl-9" {...field} />
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
                      <FormLabel>お問い合わせの種類</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="お問い合わせの種類を選択してください" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="general">
                            一般的なお問い合わせ
                          </SelectItem>
                          <SelectItem value="feedback">
                            サイトへのご意見・ご感想
                          </SelectItem>
                          <SelectItem value="collaboration">
                            コラボレーションのご提案
                          </SelectItem>
                          <SelectItem value="correction">
                            記事内容の修正依頼
                          </SelectItem>
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
                      <FormLabel>件名</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Heading className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="お問い合わせの件名" className="pl-9" {...field} />
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
                      <FormLabel>メッセージ</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Textarea
                            placeholder="お問い合わせ内容を入力してください"
                            className="min-h-[150px] pl-9"
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
                    <FormItem className="space-y-4 rounded-lg border bg-muted/30 p-4 shadow-sm">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="h-1 w-1 rounded-full bg-primary" />
                          <Link
                            href="/privacy"
                            className="underline text-primary hover:text-primary/80"
                            target="_blank"
                          >
                            プライバシーポリシー
                          </Link>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="h-1 w-1 rounded-full bg-primary" />
                          <Link
                            href="/terms"
                            className="underline text-primary hover:text-primary/80"
                            target="_blank"
                          >
                            利用規約
                          </Link>
                        </div>
                      </div>

                      <div className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            上記の内容に同意します
                          </FormLabel>
                          <FormDescription>
                            お問い合わせいただいた内容は、お問い合わせへの回答のみに使用します。
                          </FormDescription>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-md">
                  送信する
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
