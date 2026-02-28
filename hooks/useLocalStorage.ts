"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";

type UseLocalStorageReturn<T> = {
  value: T;
  setValue: Dispatch<SetStateAction<T>>;
  hydrated: boolean;
};

export function useLocalStorage<T>(key: string, initialValue: T): UseLocalStorageReturn<T> {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(key);

    if (raw !== null) {
      try {
        setValue(JSON.parse(raw) as T);
      } catch {
        setValue(initialValue);
      }
    }

    setHydrated(true);
  }, [initialValue, key]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [hydrated, key, value]);

  return { value, setValue, hydrated };
}
