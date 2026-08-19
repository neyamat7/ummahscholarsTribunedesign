import { redirect, notFound } from "next/navigation";
import { fetchPostBySlug } from "@/lib/api";

export default async function LegacyBlogPostPage({ params }) {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const pageCategorySlug = post.pageCategory?.slug || "research-studies";
  redirect(`/${pageCategorySlug}/${slug}`);
}
