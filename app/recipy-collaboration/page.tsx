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
    </div>
  );
}