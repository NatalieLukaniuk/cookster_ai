import { database } from "../_lib/firebase";
import { mapProductsToArray } from "../_lib/utils";
import RecipyCollaboration from "./recipy-collaboration-client-wrapper";
import { ref, get } from "firebase/database";

async function getProducts() {
  const headerRef = ref(database, "products"); // Get ref of 'data'
  const snapshot = await get(headerRef); // Get data of 'data'
  return snapshot.val();
}

export default async function RecipyCollaborationPage() {
  const data = await getProducts();
  const products = mapProductsToArray(data);

  return <RecipyCollaboration products={products} />;
}
