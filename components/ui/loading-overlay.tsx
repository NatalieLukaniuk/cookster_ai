import { Spinner } from "./spinner";

export default function LoadingOverlay({isLoading}: {isLoading: boolean}) {
  return (
    <>
      {isLoading && (
        <div className="h-full w-full absolute flex items-center justify-center top-0 left-0 backdrop-brightness-50 backdrop-blur-xs z-[1300] flex-col gap-3.5">
          <Spinner className="size-10 text-green-50" />
          <h1 className="text-3xl font-bold text-green-50">Зачекайте будь ласка</h1>
        </div>
      )}
    </>
  );
}
