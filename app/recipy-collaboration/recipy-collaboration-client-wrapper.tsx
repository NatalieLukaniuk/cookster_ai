"use client";
import {
  CopilotSidebar,
  useAgentContext,
  useComponent,
  useConfigureSuggestions,
  useFrontendTool,
} from "@copilotkit/react-core/v2";
import { useSetUserInfo, useUserEmail } from "../_lib/UserContext";
import {
  DishType,
  emptyRecipy,
  Ingredient,
  MeasuringUnitTextFull,
  NewRecipy,
  NewRecipySchema,
  Product,
  ProductSchema,
  ProductTypeText,
} from "../_lib/definitions";
import { useLayoutEffect, useState } from "react";
import FullRecipyCard from "@/components/recipy";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { prepareReciyForDatabase } from "../_lib/utils";
import { database } from "../_lib/firebase";
import { push, ref, set } from "firebase/database";
import { LOCAL_STORAGE_USER_EMAIL_KEY } from "@/components/forms/login-form";
import { redirect } from "next/navigation";
import LoadingOverlay from "@/components/ui/loading-overlay";
import NotificationAlert, {
  CooksterNotification,
  NotificationHidden,
} from "@/components/ui/notification";
import AddSourcePromptDialog from "@/components/forms/add-source-prompt-dialog";
import useLocalStorage from "../_lib/customHooks/useLocalStorage";
import { mockRecipy } from "../_lib/test-data";

const ChatHeader = () => {
  const userEmail = useUserEmail();
  return (
    <div className="text-green-800 p-4 text-center">
      {userEmail && <span>{userEmail}</span>}
      {!userEmail && <span>Noname</span>}, давайте готувати разом! 🍳
    </div>
  );
};

function addNewProductCard(product: Product) {
  async function addProduct() {
    const productssRef = ref(database, "products");
    const newProductRef = push(productssRef);
    const result = await set(newProductRef, product);
    console.log(result);
    console.log(newProductRef.key);
  }
  return (
    <div className="border rounded p-4 mb-4">
      <h3 className="text-lg font-bold">{product.name}</h3>
      <p>Тип: {ProductTypeText[product.type]}</p>
      <p>Калорійність: {product.calories} ккал</p>
      <p>Щільність: {product.density} кг/м3</p>
      <p>Одиниця виміру: {MeasuringUnitTextFull[product.defaultUnit]}</p>
      <p>Коефіцієнт зміни маси при приготуванні: {product.sizeChangeCoef}</p>
      <p>Вага 1шт. в грамах: {product.grInOneItem}</p>
      <Button className="w-full" onClick={addProduct}>
        Додати
      </Button>
    </div>
  );
}

export default function RecipyCollaboration({
  products,
}: {
  products: Product[];
}) {
  const [recipy, setRecipy] = useState<NewRecipy | null>(mockRecipy);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notification, setNotification] =
    useState<CooksterNotification>(NotificationHidden);
  const [isShowSourcePrompt, setIsShowSourcePrompt] = useState(false);
  const userEmail = useUserEmail();
  const setUserEmail = useSetUserInfo();
  const [savedUserEmail] = useLocalStorage(LOCAL_STORAGE_USER_EMAIL_KEY, "");

  function hideNotification() {
    setNotification(NotificationHidden);
  }

  function showNotification(newNotification: CooksterNotification) {
    setNotification(newNotification);
    setTimeout(() => {
      hideNotification();
    }, 6000);
  }

  useLayoutEffect(() => {
    if (!userEmail) {
      if (savedUserEmail) {
        setUserEmail(savedUserEmail);
      } else {
        redirect("/");
      }
    }
  }, []);

  function updateRecipy(updates: Partial<NewRecipy>) {
    setRecipy((prev: NewRecipy | null) => {
      if (!prev) return { ...emptyRecipy, ...updates };
      return { ...prev, ...updates };
    });
    showNotification({
      type: "success",
      title: "Action successful",
      message: "",
      isOpen: true,
    });
  }

  function updateIngredient(updatedIngredient: Ingredient, index: number) {
    if (!recipy) return;
    const updatedIngreds = recipy.ingrediends.map((ing, i) => {
      if (i === index) {
        return updatedIngredient;
      } else return ing;
    });
    updateRecipy({ ingrediends: updatedIngreds });
  }

  useAgentContext({
    description: `Products is an array of the products that can be used in the recipe.
    Thouroughly check the products array, majority of common products is available. 
If there is no needed product available, suggest adding the missing product.

Always check whether the ingredient id is correct and its name matches the product name in the products array.
Thoroughly check the measirung units, prefer the unit that is defined as default for the product in the products array.
Do not add ingredients that are not in the array.
A recipy that is being collaboratively created by the user and the AI.
The AI can update the recipy based on the user's requests and suggestions.
Do not include ingredient amound in the preparation steps, only in the ingredients list.
The recipy should be in Ukrainian.
      `,
    value: { products, recipy, type: DishType },
  });

  useComponent(
    {
      name: "suggestAddNewProduct",
      description: `Suggest adding new product to the products array,       
      leave id empty, it will be added at the backend
      `,
      parameters: ProductSchema,
      render: addNewProductCard,
    },
    [],
  );

  useFrontendTool({
    name: "updateRecipy",
    description: "Update the recipy with the given updates",
    parameters: NewRecipySchema,
    handler: async (updates) => {
      updateRecipy(updates);
    },
  });

  useConfigureSuggestions({
    suggestions: [
      {
        title: "Generate recipe of a salad",
        message: "Generate recipe of a salad",
      },
      {
        title: "Generate recipe of a soup",
        message: "Generate recipe of a soup",
      },
      {
        title: "Generate recipe of a dessert",
        message: "Generate recipe of a dessert",
      },
    ],
    available: "before-first-message",
  });

  useConfigureSuggestions({
    instructions:
      "Suggest follow-up questions based on the conversation so far. " +
      "Focus on actionable next steps the user might want to take. Provide titles in Ukrainian. ",
    minSuggestions: 1,
    available: "after-first-message",
  });

  async function saveRecipy(userEmail: string | null) {
    if (!recipy) return;

    if (!recipy.source?.length) {
      setIsShowSourcePrompt(true);
      return;
    }

    setIsLoading(true);

    const preparedForDb = prepareReciyForDatabase(recipy, products);
    const readyToSave = {
      ...preparedForDb,
      createdOn: Date.now(),
      author: userEmail || "test@gmail.com",
    };
    const validationResult = NewRecipySchema.safeParse(readyToSave);
    const isValid = validationResult.success;

    if (isValid) {
      const recipiesRef = ref(database, "recipies");
      const newRecipeRef = push(recipiesRef);
      await set(newRecipeRef, readyToSave)
        .catch((err) => {
          setIsLoading(false);
          showNotification({
            type: "error",
            title: "Something went wrong",
            message: err.message,
            isOpen: true,
          });
        })
        .then(() => {
          setIsLoading(false);
          showNotification({
            type: "success",
            title: "The recipe has been saved",
            message: "",
            isOpen: true,
          });
        });
    } else {
      setIsLoading(false);
      showNotification({
        type: "error",
        title: "The recipy could not be saved",
        message: "Reason: " + validationResult.error.message,
        isOpen: true,
      });
    }
  }

  function addRecipeSource(source: string) {
    if (source.length) {
      updateRecipy({ source });
    } else {
      showNotification({
        title: "No source has been indicated",
        message: "The recipy hasn't been updated",
        isOpen: true,
        type: "error",
      });
    }
  }

  const mainPanel = recipy ? (
    <div className="flex flex-col gap-1 w-full">
      <Button
        onClick={() => saveRecipy(userEmail)}
        className="mt-4 px-4 py-2 bg-green-800 text-white rounded-md hover:bg-green-700"
      >
        Зберегти
      </Button>
      <FullRecipyCard recipy={recipy} onIngredientUpdated={updateIngredient} />
    </div>
  ) : (
    <div className="flex flex-1 flex-col items-center justify-center h-full w-full gap-9">
      <Image
        src="/humster_sm.png"
        alt="Humster"
        className="mb-4"
        width={100}
        height={178}
      />
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-center text-zinc-950 dark:text-white mb-4">
          Вітаю, я ваш помічник у створенні рецептів! 🍳
        </h2>
        <h2 className="text-xl text-left font-semibold text-zinc-950 dark:text-white">
          Що я вмію:
        </h2>
        <ul className="flex flex-col gap-2 mt-4 text-left text-zinc-700 dark:text-zinc-300">
          <li>
            📋 Створювати рецепти на основі текстового опису або списку
            інгредієнтів
          </li>
          <li>
            🔄 Редагувати та вдосконалювати рецепти на основі ваших побажань
          </li>
          <li>🍽️ Пропонувати рецепти на основі наявних у вас інгредієнтів</li>
        </ul>
      </div>
    </div>
  );

  return (
    <>
      <NotificationAlert
        type={notification.type}
        message={notification.message}
        isOpen={notification.isOpen}
        title={notification.title}
      />
      <AddSourcePromptDialog
        isOpen={isShowSourcePrompt}
        onSubmit={addRecipeSource}
      />
      <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <main className="flex flex-1 w-full flex-col items-center justify-between py-4 px-16 bg-white dark:bg-black sm:items-start">
          {mainPanel}
        </main>
        <CopilotSidebar
          labels={{
            welcomeMessageText:
              "Вставте ваш рецепт в чат і я допоможу його зберегти в базу даних cookster!",
            chatInputPlaceholder: "",
            chatDisclaimerText: "AI responses may be inaccurate.",
          }}
          defaultOpen={true}
          header={ChatHeader}
          input={{
            className: "px-0",
          }}
        ></CopilotSidebar>
      </div>
      <LoadingOverlay isLoading={isLoading} />
    </>
  );
}
