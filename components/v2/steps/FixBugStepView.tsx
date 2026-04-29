"use client";

import type { FixBugStep } from "@/lib/content/schema";
import type { StepViewProps } from "../StepRouter";
import StepPlaceholder from "./_placeholder";

export default function FixBugStepView(props: StepViewProps<FixBugStep>) {
  return <StepPlaceholder step={props.step} label="fix" />;
}
