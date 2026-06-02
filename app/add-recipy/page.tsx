import RecipyCard from "@/components/recipy";
import { CopilotSidebar } from "@copilotkit/react-core/v2";

export default function AddRecipyPage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <RecipyCard />
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