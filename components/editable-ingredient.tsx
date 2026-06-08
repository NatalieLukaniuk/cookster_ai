"use client";

import {
  Ingredient,
  MeasuringUnitOptions,
  MeasuringUnitText,
} from "@/app/_lib/definitions";
import { useRef, useState } from "react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Check, Undo2 } from "lucide-react";

export interface EditableIngredientProps {
    editedIngredient: Ingredient;
    onIngredientUpdated: (updatedIngredient: Ingredient) => void
}

export default function EditableIngredient({
  editedIngredient,
  onIngredientUpdated
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

  // Keep state updated as the user types
  const handleAmountChange = (e) => {
    setIngredient((ing) => ({ ...ing, amount: e.target.value }));
  };

  const handleUnitChange = (e) => {
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
    <div className="flex gap-3 items-center">
      <span>{ingredient.ingredient} </span>
      {isEditing ? (
        <>
          <Input
            className="max-w-16"
            value={ingredient.amount}
            onChange={handleAmountChange}
          />
          <Select
            items={selectOptions()}
            value={ingredient.defaultUnit}
            onValueChange={handleUnitChange}
          >
            <SelectTrigger className="max-w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {selectOptions().map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={applyChange} variant="outline" size="icon">
            <Check />
          </Button>
          <Button onClick={discardChange} variant="destructive" size="icon">
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
    </div>
  );
}
