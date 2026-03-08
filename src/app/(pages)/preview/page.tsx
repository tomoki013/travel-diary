import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getAllDraftPosts } from "@/lib/posts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function PreviewPage() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get("preview_auth")?.value === "true";

  if (!isAuthenticated) {
    redirect("/preview/login?callbackUrl=/preview");
  }

  const drafts = await getAllDraftPosts();

  return (
    <div className="container py-10 max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Draft Preview</h1>
      <div className="grid gap-6">
        {drafts.length === 0 ? (
          <p className="text-muted-foreground">No drafts found in draft-posts directory.</p>
        ) : (
          drafts.map((draft) => (
            <Link key={draft.slug} href={`/preview/${draft.slug}`}>
              <Card className="hover:bg-accent transition-colors">
                <CardHeader>
                  <div className="flex justify-between items-start">
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
                      <span key={tag} className="text-xs text-muted-foreground">
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
