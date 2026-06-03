"use client";
import { CopilotSidebar } from "@copilotkit/react-core/v2";
import { useUserEmail } from "../_lib/UserContext";

const ChatHeader = () => {
  const userEmail = useUserEmail();
  return (
    <div className="bg-green-100 text-green-800 p-4 text-center">
      {userEmail && <span>{userEmail}</span>}
      {!userEmail && <span>Noname</span>}, давайте готувати разом! 🍳
    </div>
  );
};

export default function RecipyCollaboration() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-4xl font-bold text-zinc-950 dark:text-white mb-8">
          Рецепт спільної роботи
        </h1>
        <p className="text-lg text-zinc-700 dark:text-zinc-300 mb-4">
          Створіть та редагуйте рецепти разом з іншими користувачами
        </p>
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
          textArea: "pr-0 rounded-none",
          className: "px-0 bg-green-100",
        }}
        className="p-0 bg-green-100"
      ></CopilotSidebar>
    </div>
  );
}
