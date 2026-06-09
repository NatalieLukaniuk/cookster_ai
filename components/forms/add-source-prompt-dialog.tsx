"use client";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";

export interface SourcePromptProps {
  isOpen: boolean;
  onSubmit: (source: string) => void;
  onClose: () => void;
}

export default function AddSourcePromptDialog({
  isOpen,
  onSubmit,
  onClose,
}: SourcePromptProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Вкажіть джерело рецепту</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Input id="link" ref={inputRef} />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose
            render={
              <Button
                type="button"
                onClick={() => onSubmit(inputRef.current?.value || "")}
              >
                Close
              </Button>
            }
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
