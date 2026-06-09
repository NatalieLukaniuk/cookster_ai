"use client";

import {
  DishType,
  Ingredient,
  NewRecipy,
  PreparationStep,
} from "@/app/_lib/definitions";
import { Badge } from "./ui/badge";
import EditableIngredient from "./editable-ingredient";
import EditableStep from "./editable-prep-step";
import { v4 as uuidv4 } from "uuid";

function groupIngredients(
  ingredients: Ingredient[],
): Record<string, Ingredient[]> {
  return ingredients.reduce<Record<string, Ingredient[]>>(
    (groups, ingredient, i) => {
      const groupKey = ingredient.group?.trim() || "Основні";
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push({ ...ingredient, originalIndex: i });
      console.log(groups);
      return groups;
    },
    {},
  );
}

export interface FullRecipyCardProps {
  recipy: NewRecipy;
  onIngredientUpdated: (
    updatedIngredient: Ingredient,
    index: number | undefined,
  ) => void;
  onIngredientDeleted: (index: number | undefined) => void;
  onStepUpdated: (updatedStep: PreparationStep, index: number) => void;
  onStepDeleted: (index: number) => void;
}

export default function FullRecipyCard({
  recipy,
  onIngredientUpdated,
  onIngredientDeleted,
  onStepUpdated,
  onStepDeleted,
}: FullRecipyCardProps) {
  console.log("Rendering FullRecipyCard with recipy:", recipy);
  const ingredientGroups = groupIngredients(recipy.ingrediends);
  const mappedSteps = recipy.steps.map(step => ({...step, id: uuidv4()}))
  const totalTime = recipy.steps.reduce(
    (sum, step) => sum + step.timeActive + step.timePassive,
    0,
  );

  return (
    <article className="overflow-hidden relative w-full sm:rounded-3xl sm:border sm:border-zinc-200 bg-white shadow-sm hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950">
      <div className="space-y-6 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-40">
          <div>
            <h2 className="sm:text-2xl font-semibold text-zinc-950 dark:text-white">
              {recipy.name}
            </h2>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              {recipy.source ? (
                <a
                  href={recipy.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Джерело рецепту: {recipy.source}
                </a>
              ) : (
                "Джерело не вказано"
              )}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {recipy.type.map((type) => (
              <Badge
                key={type}
                className=" text-green-800 sm:text-xs bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300"
              >
                {DishType[type]}
              </Badge>
            ))}
          </div>
        </div>

        <section className="space-y-8 sm:space-y-4">
          <div className="rounded-3xl sm:border border-zinc-200 sm:bg-zinc-50 sm:p-5 dark:border-zinc-800 sm:dark:bg-zinc-900">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between">
              <h3 className="text-lg font-semibold text-zinc-950 dark:text-white">
                Інгредієнти
              </h3>
              <span className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                Рекомендована порція: {recipy.portionSize ?? 0} грамів
              </span>
            </div>
            <div className="flex gap-10 sm:flex-row flex-col">
              {Object.entries(ingredientGroups).map(([group, items]) => (
                <div key={group} className="space-y-3">
                  {group !== "Основні" ? (
                    <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-600 dark:text-zinc-400">
                      {group}
                    </h4>
                  ) : null}
                  <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                    {items.map((ingredient, index) => (
                      <li
                        key={`${group}-${ingredient.product}`}
                        className="flex items-start gap-3"
                      >
                        <EditableIngredient
                          editedIngredient={ingredient}
                          onIngredientUpdated={(ing) =>
                            onIngredientUpdated(ing, ingredient.originalIndex)
                          }
                          onIngredientDeleted={() =>
                            onIngredientDeleted(ingredient.originalIndex)
                          }
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl sm:border border-zinc-200 sm:bg-zinc-50 sm:p-5 dark:border-zinc-800 sm:dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3 justify-between w-full">
                <h3 className="text-lg font-semibold text-zinc-950 dark:text-white">
                  Приготування
                </h3>
                {typeof totalTime === "number" ? (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Загальний час: {totalTime} хв
                  </p>
                ) : null}
              </div>
            </div>

            <ol className="space-y-4 text-sm text-zinc-700 dark:text-zinc-300">
              {mappedSteps?.map((step, index) => (
                <li
                  key={step.id}
                  className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <EditableStep
                    index={index}
                    editedStep={step}
                    onStepUpdated={(step) => onStepUpdated(step, index)}
                    onStepDeleted={() => onStepDeleted(index)}
                  />
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>
    </article>
  );
}
