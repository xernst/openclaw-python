import { notFound } from "next/navigation";
import {
  getNextV2Step,
  getV2Step,
  listAllV2StepRoutes,
} from "@/lib/content-v2";
import LessonStepClient from "@/components/v2/LessonStepClient";

export async function generateStaticParams() {
  return listAllV2StepRoutes();
}

export default async function V2StepPage({
  params,
}: {
  params: Promise<{ chapter: string; lesson: string; stepIndex: string }>;
}) {
  const { chapter, lesson, stepIndex } = await params;
  const idx = Number.parseInt(stepIndex, 10);
  if (!Number.isFinite(idx) || idx < 0) notFound();

  const found = await getV2Step(chapter, lesson, idx);
  if (!found) notFound();

  const next = await getNextV2Step(chapter, lesson, idx);

  return (
    <LessonStepClient
      chapter={found.chapter}
      lesson={found.lesson}
      step={found.step}
      stepIndex={found.stepIndex}
      next={next}
    />
  );
}
