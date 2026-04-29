"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { interpolate, type ReadStep } from "@/lib/content/schema";
import type { StepViewProps } from "../StepRouter";

export default function ReadStepView({
  step,
  profile,
}: StepViewProps<ReadStep>) {
  const body = step.personalize ? interpolate(step.body, profile) : step.body;

  return (
    <div className="flex flex-col gap-5">
      <div className="prose max-w-none text-ink-200">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        >
          {body}
        </ReactMarkdown>
      </div>
    </div>
  );
}
