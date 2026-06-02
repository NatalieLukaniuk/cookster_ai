"use client";

import {
  DishType,
  ComplexityDescription,
  Ingredient,
  MeasuringUnitText,
  NewRecipy,
  emptyRecipy,
} from "@/app/_lib/definitions";
import { useState } from "react";

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
  const prep = ingredient.prep?.length ? ingredient.prep.join(", ") : "";

  return (
    [amount, unit, name].filter(Boolean).join(" ") + (prep ? `, ${prep}` : "")
  );
}

function groupIngredients(ingredients: Ingredient[]) {
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

export default function RecipyCard() {
  const [recipy, setRecipy] = useState<NewRecipy>(emptyRecipy);

  function addIngredient(ingredient: Ingredient) {
    setRecipy((prev) => ({
      ...prev,
      ingrediends: [...(prev.ingrediends || []), ingredient],
    }));
  }

  function addStep(step: { description: string; timeActive: number; timePassive: number }) {
    setRecipy((prev) => ({
      ...prev,
      steps: [...(prev.steps || []), { ...step, id: prev.steps?.length }],
    }));
  }


  const complexityLabel =
    ComplexityDescription[recipy.complexity] ?? "не вказано";
  const categoryLabel = recipy.type?.[0] ? DishType[recipy.type[0]] : "Рецепт";
  const ingredientGroups = groupIngredients(recipy.ingrediends ?? []);
  const totalTime = recipy.steps?.reduce(
    (sum, step) => sum + (step.timeActive || 0) + (step.timePassive || 0),
    0,
  );

  return (
    <article className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950">
      <div className="space-y-6 p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
          <span>{categoryLabel}</span>
          <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          <span>{complexityLabel}</span>
          {recipy.portionSize ? (
            <>
              <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
              <span>{recipy.portionSize} порц.</span>
            </>
          ) : null}
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-zinc-950 dark:text-white">
            {recipy.name}
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {recipy.source ?? "Джерело не вказано"}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
            <p className="font-medium text-zinc-900 dark:text-white">Автор</p>
            <p>{recipy.author}</p>
          </div>
          <div className="rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
            <p className="font-medium text-zinc-900 dark:text-white">
              Інгредієнти
            </p>
            <p>{recipy.ingrediends?.length ?? 0}</p>
          </div>
          <div className="rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
            <p className="font-medium text-zinc-900 dark:text-white">Кроки</p>
            <p>{recipy.steps?.length ?? 0}</p>
          </div>
        </div>

        <section className="space-y-4">
          <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-zinc-950 dark:text-white">
                Інгредієнти
              </h3>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {recipy.ingrediends?.length ?? 0} шт.
              </span>
            </div>

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
                      <span className="mt-1 min-w-6 text-right font-medium text-zinc-500 dark:text-zinc-400">
                        {index + 1}.
                      </span>
                      <span>{formatIngredientLabel(ingredient)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-zinc-950 dark:text-white">
                  Підготовка
                </h3>
                {typeof totalTime === "number" ? (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Загальний час: {totalTime} хв
                  </p>
                ) : null}
              </div>
              <span className="rounded-full bg-zinc-200 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                {recipy.steps?.length ?? 0} кроки
              </span>
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
