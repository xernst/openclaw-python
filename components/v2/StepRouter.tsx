"use client";

import type {
  CheckpointStep,
  FillBlankStep,
  FixBugStep,
  MultipleChoiceStep,
  PredictStep,
  ReadStep,
  ReorderStep,
  Step,
  StepAttempt,
  UserProfile,
  WriteStep,
} from "@/lib/content/schema";
import type { RunResult } from "./PersistentIDE";

/**
 * Every step view renders only the prompt panel. The IDE is owned by the
 * shell, so a step view should not mount its own editor — it reads from /
 * writes to the shared IDE via callbacks the shell provides.
 *
 * The router intentionally stays thin: it discriminates on `step.type` and
 * forwards a typed view-specific step to the matching view.
 */
export type StepIDEBridge = {
  /** Run the active editor file through Pyodide and return its result. */
  run: () => Promise<RunResult | null>;
  /** Read the current contents of the active editor file. */
  getActiveCode: () => string;
};

export type StepViewProps<T extends Step = Step> = {
  step: T;
  profile: UserProfile;
  onAttempt: (attempt: StepAttempt) => void;
  ide: StepIDEBridge;
};

type Props = StepViewProps<Step>;

export default function StepRouter(props: Props) {
  const { step } = props;
  switch (step.type) {
    case "read":
      return <ReadView {...(props as StepViewProps<ReadStep>)} />;
    case "mc":
      return <MultipleChoiceView {...(props as StepViewProps<MultipleChoiceStep>)} />;
    case "fill":
      return <FillBlankView {...(props as StepViewProps<FillBlankStep>)} />;
    case "predict":
      return <PredictView {...(props as StepViewProps<PredictStep>)} />;
    case "fix":
      return <FixBugView {...(props as StepViewProps<FixBugStep>)} />;
    case "write":
      return <WriteView {...(props as StepViewProps<WriteStep>)} />;
    case "reorder":
      return <ReorderView {...(props as StepViewProps<ReorderStep>)} />;
    case "checkpoint":
      return <CheckpointView {...(props as StepViewProps<CheckpointStep>)} />;
    default:
      return <UnknownStep step={step} />;
  }
}

function UnknownStep({ step }: { step: Step }) {
  return (
    <div className="rounded-md border border-ink-800 bg-ink-900 p-4 text-sm text-ink-400">
      <p className="text-ink-200">
        This step type isn&rsquo;t available yet.
      </p>
      <p className="mt-1 font-mono text-xs text-ink-500">
        type: {(step as { type?: string }).type ?? "unknown"}
      </p>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// View imports — wired as views land. Until a view ships, the router falls
// back to a placeholder so the build stays green and authors can iterate.
// ──────────────────────────────────────────────────────────────────────────

import ReadView from "./steps/ReadStepView";
import MultipleChoiceView from "./steps/MultipleChoiceStepView";
import FillBlankView from "./steps/FillBlankStepView";
import PredictView from "./steps/PredictStepView";
import FixBugView from "./steps/FixBugStepView";
import WriteView from "./steps/WriteStepView";
import ReorderView from "./steps/ReorderStepView";
import CheckpointView from "./steps/CheckpointStepView";
