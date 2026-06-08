"use client";

import { PreparationStep } from "@/app/_lib/definitions";
import { useRef, useState } from "react";
import { Input } from "./ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "./ui/input-group";
import { BicepsFlexed, Check, Sofa, Trash2, Undo2 } from "lucide-react";
import { Button } from "./ui/button";

export interface EditableStepProps {
  index: number;
  editedStep: PreparationStep;
  onStepUpdated: (updatedStep: PreparationStep) => void;
  onStepDeleted: () => void;
}
function formatStepTime(step: { timeActive: number; timePassive: number }) {
  const active = step.timeActive ? `${step.timeActive} хв` : null;
  const passive = step.timePassive ? `${step.timePassive} хв пас.` : null;

  if (active && passive) return `${active} / ${passive}`;
  return active || passive || "-";
}

export default function EditableStep({
  index,
  editedStep,
  onStepUpdated,
  onStepDeleted,
}: EditableStepProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [step, setStep] = useState<PreparationStep>(editedStep);
  const initialStep = useRef(editedStep);

  const handleToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleDescriptionChange = (e: { target: { value: string } }) => {
    setStep((step) => ({ ...step, description: e.target.value }));
  };

  const handleActiveTimeChange = (e: { target: { value: string } }) => {
    setStep((step) => ({ ...step, timeActive: +e.target.value }));
  };
  const handlePassiveTimeChange = (e: { target: { value: string } }) => {
    setStep((step) => ({ ...step, timePassive: +e.target.value }));
  };

  const applyChange = () => {
    onStepUpdated(step);
    setIsEditing(false);
  };

  const discardChange = () => {
    setStep(initialStep.current);
    setIsEditing(false);
  };

  return (
    <>
      <div className="mb-2 flex items-center justify-between gap-3 text-xs uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
        <span>Крок {index + 1}</span>
        <div className="flex gap-1.5">
          {isEditing ? (
            <>
              <InputGroup>
                <InputGroupInput
                  className="max-w-16 w-auto h-9"
                  value={step.timeActive}
                  onChange={handleActiveTimeChange}
                />
                <InputGroupAddon>
                  <BicepsFlexed />
                </InputGroupAddon>
              </InputGroup>
              <InputGroup>
                <InputGroupInput
                  className="max-w-16 w-auto h-9"
                  value={step.timePassive}
                  onChange={handlePassiveTimeChange}
                />
                <InputGroupAddon>
                  <Sofa />
                </InputGroupAddon>
              </InputGroup>
              <Button onClick={applyChange} variant="outline" size="icon-sm">
                <Check />
              </Button>
              <Button
                onClick={discardChange}
                variant="destructive"
                size="icon-sm"
              >
                <Undo2 />
              </Button>
            </>
          ) : (
            <span onClick={handleToggle}>{formatStepTime(step)}</span>
          )}
          <Button onClick={onStepDeleted} variant="ghost" size="icon-sm">
            <Trash2 />
          </Button>
        </div>
      </div>
      {isEditing ? (
        <Input value={step.description} onChange={handleDescriptionChange} />
      ) : (
        <p onClick={handleToggle}>{step.description}</p>
      )}
    </>
  );
}
