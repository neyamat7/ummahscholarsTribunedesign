import { redirect } from "next/navigation";

export default async function CategoryBlogRedirectPage({ params }) {
  const { categorySlug } = await params;
  redirect(`/categories/${categorySlug}`);
}
