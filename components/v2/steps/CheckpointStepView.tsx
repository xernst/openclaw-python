"use client";

import type { CheckpointStep } from "@/lib/content/schema";
import type { StepViewProps } from "../StepRouter";
import StepPlaceholder from "./_placeholder";

export default function CheckpointStepView(props: StepViewProps<CheckpointStep>) {
  return <StepPlaceholder step={props.step} label="checkpoint" />;
}
