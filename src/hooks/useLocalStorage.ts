import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // 获取初始值
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      // 如果没有数据，先检查是否有备份
      if (!item) {
        const backup = window.localStorage.getItem(`${key}_backup`);
        if (backup) {
          return JSON.parse(backup);
        }
      }
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error loading data:', error);
      return initialValue;
    }
  });

  // 监听存储变化并创建备份
  useEffect(() => {
    try {
      // 主存储
      window.localStorage.setItem(key, JSON.stringify(storedValue));
      // 备份存储
      window.localStorage.setItem(`${key}_backup`, JSON.stringify(storedValue));
      
      // 额外保存到 IndexedDB（更大的存储空间）
      if (window.indexedDB) {
        const request = window.indexedDB.open('ProductsDB', 1);
        
        request.onerror = () => {
          console.error('IndexedDB error');
        };

        request.onsuccess = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          const transaction = db.transaction(['products'], 'readwrite');
          const store = transaction.objectStore('products');
          store.put({ id: key, data: storedValue });
        };

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains('products')) {
            db.createObjectStore('products', { keyPath: 'id' });
          }
        };
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }, [key, storedValue]);

  // 自定义设置函数
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
    } catch (error) {
      console.error('Error setting value:', error);
    }
  };

  return [storedValue, setValue] as const;
}