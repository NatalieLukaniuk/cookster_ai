"use client";

import { useEffect, useState } from "react";

function getSavedValue(key: string, initialValue: unknown){
    const savedValue = localStorage.getItem(key);
    if(savedValue) return JSON.parse(savedValue);

    if(initialValue instanceof Function) return initialValue();

    return initialValue
}

export default function useLocalStorage(key: string, initialValue: unknown){
    const [value, setValue] = useState(() => getSavedValue(key, initialValue))

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value))
    }, [value, key])

    return [value, setValue]
}