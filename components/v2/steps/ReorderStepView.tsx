"use client";

import type { ReorderStep } from "@/lib/content/schema";
import type { StepViewProps } from "../StepRouter";
import StepPlaceholder from "./_placeholder";

export default function ReorderStepView(props: StepViewProps<ReorderStep>) {
  return <StepPlaceholder step={props.step} label="reorder" />;
}
