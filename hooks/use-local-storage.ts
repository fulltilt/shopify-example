"use client";

import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const item = window.localStorage.getItem(key);
        if (item && item !== "null" && item !== "undefined") {
          const parsedValue = JSON.parse(item);
          setStoredValue(parsedValue);
          console.log(`📦 Loaded from localStorage [${key}]:`, parsedValue);
        } else {
          console.log(
            `📦 No value found in localStorage for [${key}], using initial value:`,
            initialValue
          );
        }
      }
    } catch (error) {
      console.error(`❌ Error reading localStorage key "${key}":`, error);
    } finally {
      setIsLoaded(true);
      console.log(`✅ LocalStorage loaded for [${key}]`);
    }
  }, [key, initialValue]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (typeof window !== "undefined") {
        if (valueToStore === null || valueToStore === undefined) {
          window.localStorage.removeItem(key);
          console.log(`🗑️ Removed from localStorage [${key}]`);
        } else {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          console.log(`💾 Saved to localStorage [${key}]:`, valueToStore);
        }
      }
    } catch (error) {
      console.error(`❌ Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, isLoaded] as const;
}
