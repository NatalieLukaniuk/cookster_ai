"use client";
import {
  CopilotChat,
  useAgent,
  useComponent,
  useConfigureSuggestions,
} from "@copilotkit/react-core/v2";
import RecipyCard from "@/components/recipy-card";
import { z } from "zod";
import { useEffect, useState } from "react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { ChevronRightIcon } from "lucide-react";

export const recipyCardSchema = z.object({
  name: z.string(),
  ingredients: z.array(z.string()),
  preparationSteps: z.array(z.string()),
});

export type RecipeCardProps = z.infer<typeof recipyCardSchema>;

export default function AddRecipyPage() {
  const { agent } = useAgent();

  const [messages, setMessages] = useState<string[]>([
    "Почніть розмову, щоб згенерувати рецепт!",
    'Спробуйте, наприклад, "Згенеруй рецепт салату"',
  ]);

  function updateMessages() {
    setMessages(
      agent.messages
        .filter((msg: any) => msg.toolCalls?.length > 0)
        .map((msg: any) =>
          msg.toolCalls[0].function.arguments
            ? JSON.parse(msg.toolCalls[0].function.arguments).name
            : "",
        ),
    );
  }

  useEffect(() => {
    const { unsubscribe } = agent.subscribe({
      onRunStartedEvent: () => console.log("Started"),
      onRunFinalized: () => updateMessages(),
    });

    return unsubscribe;
  });

  useComponent(
    {
      name: "showRecipyCard",
      description:
        "Render a recipe card in chat for the requested recipe. Translate the recipe name, ingredients and preparation steps to Ukrainian. Use the provided parameters to fill in the card details. Do not add the recipe outside the card. Always use all the provided parameters to create a complete recipe card.",
      parameters: recipyCardSchema,
      render: RecipyCard,
    },
    [],
  );

  useConfigureSuggestions({
    suggestions: [
      {
        title: "Generate a cake recipe",
        message: "Generate a new recipe of a cake",
      },
      {
        title: "Generate a pasta recipe",
        message: "Generate a new recipe of pasta",
      },
      {
        title: "Generate a salad recipe",
        message: "Generate a new recipe of a salad",
      },
    ],
    available: "before-first-message",
  });

  useConfigureSuggestions({
    instructions:
      "Suggest follow-up questions based on the conversation so far. " +
      "Focus on actionable next steps the user might want to take. The titles should be in Ukrainian and clearly indicate the action that will be taken if the suggestion is selected. Do not suggest to show it in a card, always show recipe cards. ",
    available: "after-first-message",
  });



  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full items-center justify-end py-10 px-6 bg-white dark:bg-black sm:items-start">
        <div className="max-w-60 flex flex-col items-start justify-start space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
          {messages.map((message, index) => (
            <Item
              key={index}
              render={
                <a href="#">
                  <ItemContent>
                    <ItemDescription>{message}</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <ChevronRightIcon className="size-4" />
                  </ItemActions>
                </a>
              }
            />
          ))}
        </div>
        <CopilotChat
          className="w-full self-end"
          labels={{
            modalHeaderTitle: "Your Recipe Assistant",
            welcomeMessageText: "How can I help you today?",
          }}
          chatView="max-h-[90vh]"
        />
      </main>
    </div>
  );
}
