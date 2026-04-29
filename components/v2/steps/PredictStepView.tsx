"use client";

import type { PredictStep } from "@/lib/content/schema";
import type { StepViewProps } from "../StepRouter";
import StepPlaceholder from "./_placeholder";

export default function PredictStepView(props: StepViewProps<PredictStep>) {
  return <StepPlaceholder step={props.step} label="predict" />;
}
