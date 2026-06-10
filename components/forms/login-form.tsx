"use client";
import { useSetUserInfo, useUserEmail } from "@/app/_lib/UserContext";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { useEffect, useRef } from "react";
import useLocalStorage from "@/app/_lib/customHooks/useLocalStorage";
import NavCard, { NavCardItem } from "../nav-card";

export const LOCAL_STORAGE_USER_EMAIL_KEY = "user-email";

export default function LoginForm() {
  const userEmail = useUserEmail();
  const setUserEmail = useSetUserInfo();
  const [savedUserEmail, setSavedUserEmail] = useLocalStorage(
    LOCAL_STORAGE_USER_EMAIL_KEY,
    "",
  );

  useEffect(() => {
    if (savedUserEmail) {
      setUserEmail(savedUserEmail);
    }
  }, []);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const email = inputRef.current?.value;

    if (email) {
      setUserEmail(email);
      setSavedUserEmail(email);
    }
  };

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const navCards: NavCardItem[] = [
    {
      title: "recipe collaboration assistant",
      link: "/recipy-collaboration",
      description: `Paste your text recipe in the ai chat and the assistant
      will prepare it to be added to Cookster recipe database.
      Add missing products to Cookster database`,
      isExternal: false,
      isExperimental: false,
    },
    {
      title: "cookster app",
      link: "https://cookster-12ac8.web.app",
      description: `View recipies, add to calendar, prepare shopping list based on the planned recipies`,
      isExternal: true,
      isExperimental: false,
    },
    {
      title: "source code",
      link: "https://github.com/NatalieLukaniuk/cookster_ai",
      description: `Click to view the github repo`,
      isExternal: true,
      isExperimental: false,
    },   
    {
      title: "recipe chat assistant",
      link: "/add-recipy-chat",
      description: "Test app designed to check how useComponent works in copilotkit",
      isExternal: false,
      isExperimental: true,
    },
     
  ];
  return (
    <>
      {userEmail && (
        <div className="w-full flex flex-col md:flex-row flex-wrap items-start space-y-3 md:gap-6 md:items-stretch md:justify-center">
          
          {navCards.map((card) => (
            <NavCard key={card.title} navCard={card} />
          ))}
        </div>
      )}
      {!userEmail && (
        <FieldSet className="w-full items-center px-4">
          <FieldGroup className="w-full max-w-2xl">
            <Field>
              <FieldLabel htmlFor="username">
                Please enter your email address.
              </FieldLabel>
              <Input
                id="username"
                type="email"
                placeholder="example@gmail.com"
                ref={inputRef}
                onKeyDown={(e) => {
                  if(e.key === 'Enter'){
                    handleSubmit()
                  }
                }}
              />
              <FieldDescription>
                This is needed for internal purposes only.
              </FieldDescription>
            </Field>
            <Field orientation="horizontal" className="justify-between">
              <Button type="submit" className="flex-1" onClick={handleSubmit}>
                Submit
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                type="button"
                onClick={handleClear}
              >
                Clear
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      )}
    </>
  );
}
