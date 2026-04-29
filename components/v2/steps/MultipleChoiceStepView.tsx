"use client";

import type { MultipleChoiceStep } from "@/lib/content/schema";
import type { StepViewProps } from "../StepRouter";
import StepPlaceholder from "./_placeholder";

export default function MultipleChoiceStepView(
  props: StepViewProps<MultipleChoiceStep>,
) {
  return <StepPlaceholder step={props.step} label="mc" />;
}
