"use client";

import { useEffect, useState } from "react";

function getSavedValue(key: string, initialValue: unknown) {
    if (typeof window === "undefined") {
        return initialValue instanceof Function ? initialValue() : initialValue;
    }

    try {
        const savedValue = window.localStorage.getItem(key);
        if (savedValue) return JSON.parse(savedValue);
    } catch {
        // Ignore access errors during hydration or when storage is unavailable
    }

    return initialValue instanceof Function ? initialValue() : initialValue;
}

export default function useLocalStorage(key: string, initialValue: unknown) {
    const [value, setValue] = useState(() => getSavedValue(key, initialValue));

    useEffect(() => {
        if (typeof window === "undefined") return;
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch {
            // Ignore storage write errors
        }
    }, [value, key]);

    return [value, setValue];
}