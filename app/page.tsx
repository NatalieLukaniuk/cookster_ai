import LoginForm from "@/components/forms/login-form";

import { ref, get } from "firebase/database";
import { database } from "./_lib/firebase";

async function getProducts() {
      const headerRef = ref(database, 'products'); // Get ref of 'data'
      const snapshot = await get(headerRef); // Get data of 'data'
      return snapshot.val();
  };

export default async function Home() {
const data = await getProducts();
console.log('Data from Firebase:', data);
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <LoginForm />
      </main>
    </div>
  );
}
