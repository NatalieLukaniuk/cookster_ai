"use client";

import {
  Ingredient,
  MeasuringUnit,
  MeasuringUnitOptions,
  MeasuringUnitText,
} from "@/app/_lib/definitions";
import { useRef, useState } from "react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Check, Trash2, Undo2 } from "lucide-react";
import clsx from 'clsx';

export interface EditableIngredientProps {
    editedIngredient: Ingredient;
    onIngredientUpdated: (updatedIngredient: Ingredient) => void;
    onIngredientDeleted: () => void;
}

export default function EditableIngredient({
  editedIngredient,
  onIngredientUpdated,
  onIngredientDeleted
}: EditableIngredientProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [ingredient, setIngredient] = useState<Ingredient>(editedIngredient);
  const initialIngredient = useRef(editedIngredient);

  const selectOptions = () => {
    return MeasuringUnitOptions.map((option) => ({
      value: option,
      label: MeasuringUnitText[option],
    }));
  };

  const handleToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleAmountChange = (e: { target: { value: string; }; }) => {
    setIngredient((ing) => ({ ...ing, amount: +e.target.value }));
  };

  const handleUnitChange = (e: MeasuringUnit | null) => {
    if(!e) return;
    setIngredient((ing) => ({ ...ing, defaultUnit: e }));
  };

  const applyChange = () => {
    onIngredientUpdated(ingredient);
    setIsEditing(false);
  };

  const discardChange = () => {
    setIngredient(initialIngredient.current);
    setIsEditing(false);
  };

  return (
    <div className={clsx("flex items-center h-9", isEditing? 'gap-3' : 'gap-1')}>
      <span>{ingredient.ingredient} </span>
      {isEditing ? (
        <>
          <Input
            className="max-w-16 w-auto h-9"
            value={ingredient.amount}
            onChange={handleAmountChange}
          />
          <Select
            items={selectOptions()}
            value={ingredient.defaultUnit}
            onValueChange={handleUnitChange}
          >
            <SelectTrigger className="max-w-20" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              {selectOptions().map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={applyChange} variant="outline" size="icon-sm">
            <Check />
          </Button>
          <Button onClick={discardChange} variant="destructive" size="icon-sm">
            <Undo2 />
          </Button>
        </>
      ) : (
        <>
          <span onClick={handleToggle}>{ingredient.amount}</span>
          <span onClick={handleToggle}>
            {MeasuringUnitText[ingredient.defaultUnit]}
          </span>
        </>
      )}
      <Button onClick={onIngredientDeleted} variant="ghost" size="icon-sm">
            <Trash2 />
          </Button>
    </div>
  );
}
