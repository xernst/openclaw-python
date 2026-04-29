"use client";

import type { FillBlankStep } from "@/lib/content/schema";
import type { StepViewProps } from "../StepRouter";
import StepPlaceholder from "./_placeholder";

export default function FillBlankStepView(props: StepViewProps<FillBlankStep>) {
  return <StepPlaceholder step={props.step} label="fill" />;
}
