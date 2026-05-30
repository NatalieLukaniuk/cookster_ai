'use client';
import React, { useState, createContext, useContext } from "react";

export type UserEmail = string | null;

const UserEmailContext = createContext<UserEmail>(null);

const UserUpdateContext = createContext<(email: string | null) => void>(() => {});

const UserLogoutContext = createContext<() => void>(() => {});

export function useUserEmail() {
  const userEmail = useContext(UserEmailContext);
  return userEmail;
}

export function useSetUserInfo() {
  const setUserInfo = useContext(UserUpdateContext);
  return setUserInfo;
}

export function useLogout() {
  const logout = useContext(UserLogoutContext);
  return logout;
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userEmail, setUserEmail] = useState<UserEmail>(null);

  function setUserInfo(email: string | null) {
    setUserEmail(email);
  }

  function logout() {
    setUserEmail(null);
  }



  return (
    <UserEmailContext.Provider value={userEmail}>
      <UserUpdateContext.Provider value={setUserInfo}>
        <UserLogoutContext.Provider value={logout}>
          {children}
        </UserLogoutContext.Provider>
      </UserUpdateContext.Provider>
    </UserEmailContext.Provider>
  );
}
