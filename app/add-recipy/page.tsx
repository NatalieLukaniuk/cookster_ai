import { CopilotSidebar } from "@copilotkit/react-core/v2";

export default function AddRecipyPage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-4xl font-bold mb-4">Add a New Recipe</h1>
        {/* Add your form or content for adding a new recipe here */}
      </main>
      <CopilotSidebar
        defaultOpen={true}
        labels={{
          modalHeaderTitle: "Your Recipe Assistant",
          welcomeMessageText: "How can I help you today?",
        }}
      />
    </div>
  );
}