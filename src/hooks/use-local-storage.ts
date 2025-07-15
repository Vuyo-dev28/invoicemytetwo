"use client";

import { useState, useEffect } from 'react';

function getValueFromLocalStorage<T>(key: string) {
    if (typeof window === 'undefined') {
        return null;
    }
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
}

function saveValueToLocalStorage<T>(key: string, value: T) {
    if (typeof window === 'undefined') {
        return;
    }
    window.localStorage.setItem(key, JSON.stringify(value));
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const fromStorage = getValueFromLocalStorage<T>(key);
    return fromStorage !== null ? fromStorage : initialValue;
  });
  
  // This effect runs on client side after mount to sync with localStorage
  useEffect(() => {
    const fromStorage = getValueFromLocalStorage<T>(key);
    if (fromStorage !== null) {
        setValue(fromStorage);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    saveValueToLocalStorage(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}
