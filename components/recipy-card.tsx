"use client";
import { RecipeCardProps } from "@/app/add-recipy-chat/page";
import { Button } from "./ui/button";

export default function RecipyCard({
  name,
  ingredients,
  preparationSteps,
}: RecipeCardProps) {
  function saveRecipy(recipe: RecipeCardProps) {
    console.log("Saving recipe:", recipe);
  }

  return (
    <div className="border rounded-lg p-4 shadow-md bg-white dark:bg-gray-800 relative">
      <Button
        className="absolute top-2 right-2"
        variant="outline"
        onClick={() => saveRecipy({ name, ingredients, preparationSteps })}
      >
        Save
      </Button>
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Рецепт: {name}
      </h2>

      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
        Інгредієнти:
      </h3>
      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4">
        {ingredients?.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
        Інструкції:
      </h3>
      <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300">
        {preparationSteps?.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
    </div>
  );
}
