import { useEffect, useState } from "react";

export const useLocalStorage = <T,>(key: string, defaultValue: T): [T, (value: T) => void] => {
  const [value, setValue] = useState<T>(() => {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    try {
      return JSON.parse(item) as T;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};
