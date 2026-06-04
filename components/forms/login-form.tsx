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
import Link from "next/link";
import { useEffect, useRef } from "react";


export const LOCAL_STORAGE_USER_EMAIL_KEY = "user-email";

export default function LoginForm() {
  const userEmail = useUserEmail();
  const setUserEmail = useSetUserInfo();

  useEffect(() => {
    const storedEmail = localStorage.getItem(LOCAL_STORAGE_USER_EMAIL_KEY);
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const email = inputRef.current?.value;
    console.log("Email entered:", email);
    if (email) {
      setUserEmail(email);
      localStorage.setItem(LOCAL_STORAGE_USER_EMAIL_KEY, email);
    }
  };

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };
  return (
    <>
      {userEmail && (
        <div className="flex flex-col items-start space-y-2">
          <p className="text-sm text-muted-foreground">
            Logged in as: {userEmail}
          </p>
          <Link
            href="/add-recipy-chat"
            className="text-sm text-blue-500 hover:underline"
          >
            Try the recipe chat assistant
          </Link>
          <Link
            href="/recipy-collaboration"
            className="text-sm text-blue-500 hover:underline"
          >
            Try the recipe collaboration assistant
          </Link>
        </div>
      )}
      {!userEmail && (
        <FieldSet className="w-full">
          <FieldGroup className="w-full">
            <Field>
              <FieldLabel htmlFor="username">
                Please enter your email address.
              </FieldLabel>
              <Input
                id="username"
                type="email"
                placeholder="example@gmail.com"
                ref={inputRef}
              />
              <FieldDescription>
                This is needed to associate your recipe history with your
                account. We will not share your email with anyone else.
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
