import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { isPreviewEnabled } from "@/lib/preview-mode";
import type { Metadata } from "next";

// 執筆用の内部ページ。検索エンジンにインデックスさせない。
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function PreviewPage() {
  if (!isPreviewEnabled()) {
    notFound();
  }

  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get("preview_auth")?.value === "true";

  if (!isAuthenticated) {
    redirect("/preview/login?callbackUrl=/preview");
  }

  const { getAllDraftPosts } = await import("@/lib/draft-posts");
  const drafts = await getAllDraftPosts();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold">Draft Preview</h1>
      <div className="grid gap-6">
        {drafts.length === 0 ? (
          <p className="text-muted-foreground">No drafts found in draft-posts directory.</p>
        ) : (
          drafts.map((draft) => (
            <Link key={draft.slug} href={`/preview/${draft.slug}`}>
              <Card className="hover:bg-accent transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl">{draft.title || draft.slug}</CardTitle>
                    <Badge variant="outline">{draft.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-2">
                    {draft.excerpt || "No excerpt provided."}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {draft.tags?.map((tag) => (
                      <span key={tag} className="text-muted-foreground text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
