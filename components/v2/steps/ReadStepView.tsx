"use client";

import type { ReadStep } from "@/lib/content/schema";
import type { StepViewProps } from "../StepRouter";
import StepPlaceholder from "./_placeholder";

export default function ReadStepView(props: StepViewProps<ReadStep>) {
  return <StepPlaceholder step={props.step} label="read" />;
}
