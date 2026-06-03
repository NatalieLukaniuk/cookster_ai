"use client";
import { CopilotSidebar, useAgentContext, useFrontendTool } from "@copilotkit/react-core/v2";
import { useUserEmail } from "../_lib/UserContext";
import { emptyRecipy, NewRecipy, NewRecipySchema, Product } from "../_lib/definitions";
import { useState } from "react";
import FullRecipyCard from "@/components/recipy";
import { mockRecipy } from "@/components/mock-recipy";

const ChatHeader = () => {
  const userEmail = useUserEmail();
  return (
    <div className="text-green-800 p-4 text-center">
      {userEmail && <span>{userEmail}</span>}
      {!userEmail && <span>Noname</span>}, давайте готувати разом! 🍳
    </div>
  );
};

export default function RecipyCollaboration({
  products,
}: {
  products: Product[];
}) {
  const [recipy, setRecipy] = useState<NewRecipy | null>(null);

  function updateRecipy(updates: Partial<NewRecipy>) {
    setRecipy((prev: NewRecipy | null) => {
      if (!prev) return { ...emptyRecipy, ...updates };
      return { ...prev, ...updates };
    });
  }

  useAgentContext({
    description:
      "An array of the products that can be used in the recipe. A recipy that is being collaboratively created by the user and the AI. The AI can update the recipy based on the user's requests and suggestions.",
    value: { products, recipy },
  });

  useFrontendTool({
    name: "updateRecipy",
    description: "Update the recipy with the given updates",
    parameters: NewRecipySchema,
    handler: async (updates) => {
      updateRecipy(updates);
    }
  });

  const mainPanel = recipy ? (
    <FullRecipyCard recipy={recipy} />
  ) : (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-semibold text-zinc-950 dark:text-white mb-4">
          Вітаю! Я допоможу вам створити рецепт на основі ваших продуктів. Просто скажіть мені, що ви хочете приготувати, або виберіть продукти зі списку, і я запропоную вам рецепт!
        </h2>
        <button
          onClick={() => setRecipy(emptyRecipy)}
          className="px-4 py-2 bg-green-800 text-white rounded-md hover:bg-green-700"
        >
          Почати створення рецепту
        </button>
      </div>
  );

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full flex-col items-center justify-between py-4 px-16 bg-white dark:bg-black sm:items-start">
        {mainPanel}
      </main>
      <CopilotSidebar
        labels={{
          welcomeMessageText: "Let me help you create a recipe!",
          chatInputPlaceholder: "Paste your product list or ask for suggestions...",
          chatDisclaimerText: "AI responses may be inaccurate.",
        }}
        defaultOpen={true}
        header={ChatHeader}
        input={{
          textArea: "pr-0 rounded-none text-xs",
          className: "px-0",
        }}
        className="p-0"
      ></CopilotSidebar>
    </div>
  );
}
