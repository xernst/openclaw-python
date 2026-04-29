import { notFound, redirect } from "next/navigation";
import { getV2Lesson, listAllV2LessonRoutes } from "@/lib/content-v2";

export async function generateStaticParams() {
  return listAllV2LessonRoutes();
}

export default async function V2LessonLandingPage({
  params,
}: {
  params: Promise<{ chapter: string; lesson: string }>;
}) {
  const { chapter, lesson } = await params;
  const found = await getV2Lesson(chapter, lesson);
  if (!found) notFound();
  redirect(`/learn/v2/${chapter}/${lesson}/0`);
}
