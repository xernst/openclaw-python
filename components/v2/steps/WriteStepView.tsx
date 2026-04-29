"use client";

import type { WriteStep } from "@/lib/content/schema";
import type { StepViewProps } from "../StepRouter";
import StepPlaceholder from "./_placeholder";

export default function WriteStepView(props: StepViewProps<WriteStep>) {
  return <StepPlaceholder step={props.step} label="write" />;
}
