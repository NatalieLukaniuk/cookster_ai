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
    <div className="bg-green-100 text-green-800 p-4 text-center">
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
  const [recipy, setRecipy] = useState<NewRecipy>(mockRecipy);
  const [isRecipyInitiated, setIsRecipyInitiated] = useState(false);

  function updateRecipy(updates: Partial<NewRecipy>) {
    setRecipy((prev) => ({ ...prev, ...updates }));
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

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full flex-col items-center justify-between py-4 px-16 bg-white dark:bg-black sm:items-start">
        <FullRecipyCard recipy={recipy} />
      </main>
      <CopilotSidebar
        labels={{
          welcomeMessageText: "How can I help you today?",
          chatInputPlaceholder: "Ask for help with your recipe...",
          chatDisclaimerText: "AI responses may be inaccurate.",
        }}
        defaultOpen={true}
        header={ChatHeader}
        input={{
          textArea: "pr-0 rounded-none text-xs",
          className: "px-0 bg-green-100",
        }}
        className="p-0 bg-green-100"
      ></CopilotSidebar>
    </div>
  );
}
