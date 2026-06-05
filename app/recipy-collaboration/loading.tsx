import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full flex-col items-center justify-center py-32 px-16 gap-3.5 bg-white dark:bg-black sm:items-start">
        <h1 className="text-2xl font-bold">Loading the page, please give us a few seconds</h1>
        <Spinner/>
      </main>
    </div>
  );
}