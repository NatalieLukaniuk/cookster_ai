"use client";

import {
  DishType,
  Ingredient,
  MeasuringUnitText,
  NewRecipy,
} from "@/app/_lib/definitions";
import { Badge } from "./ui/badge";

function formatAmount(amount: number) {
  if (!Number.isFinite(amount)) return "";
  if (Number.isInteger(amount)) return String(amount);
  return amount.toFixed(2).replace(/\.?(0+)$/, "");
}

function formatIngredientLabel(ingredient: Ingredient) {
  const amount = ingredient.amount ? formatAmount(ingredient.amount) : "";
  const unit = ingredient.defaultUnit
    ? MeasuringUnitText[ingredient.defaultUnit]
    : "";
  const name =
    ingredient.ingredient?.trim() || ingredient.product || "Інгредієнт";

  return [name, amount, unit].filter(Boolean).join(" ");
}

function groupIngredients(ingredients: Ingredient[]): Record<string, Ingredient[]> {
  return ingredients.reduce<Record<string, Ingredient[]>>(
    (groups, ingredient) => {
      const groupKey = ingredient.group?.trim() || "Основні";
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(ingredient);
      return groups;
    },
    {},
  );
}

function formatStepTime(step: { timeActive: number; timePassive: number }) {
  const active = step.timeActive ? `${step.timeActive} хв` : null;
  const passive = step.timePassive ? `${step.timePassive} хв пас.` : null;

  if (active && passive) return `${active} / ${passive}`;
  return active || passive || "-";
}

export default function FullRecipyCard({ recipy }: { recipy: NewRecipy }) {
  console.log("Rendering FullRecipyCard with recipy:", recipy);
  const ingredientGroups = groupIngredients(recipy.ingrediends);
  const totalTime = recipy.steps.reduce(
    (sum, step) => sum + step.timeActive + step.timePassive,
    0,
  );

  return (
    <article className="overflow-hidden w-full rounded-3xl border border-zinc-200 bg-white shadow-sm hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950">
      <div className="space-y-6 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-40">
          <div>
            <h2 className="text-2xl font-semibold text-zinc-950 dark:text-white">
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
              <Badge key={type} className=" text-green-800 text-xs bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300">
                {DishType[type]}
              </Badge>
            ))}
          </div>
        </div>

        <section className="space-y-4">
          <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-zinc-950 dark:text-white">
                Інгредієнти
              </h3>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
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
                        key={`${group}-${index}`}
                        className="flex items-start gap-3"
                      >
                        <span>{formatIngredientLabel(ingredient)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
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
              {recipy.steps?.map((step, index) => (
                <li
                  key={index}
                  className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <div className="mb-2 flex items-center justify-between gap-3 text-xs uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                    <span>Крок {index + 1}</span>
                    <span>{formatStepTime(step)}</span>
                  </div>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>
    </article>
  );
}
