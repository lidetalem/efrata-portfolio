import { getComments } from "@/lib/queries";
import { CommentModeration } from "./comment-moderation";

export const dynamic = "force-dynamic";

export default async function CommentsPage() {
  const comments = await getComments();
  return (
    <CommentModeration
      rows={comments.map((c) => ({ ...c, createdAt: new Date(c.createdAt).toISOString() }))}
    />
  );
}
