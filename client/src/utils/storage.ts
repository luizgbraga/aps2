export class Storage {
    static get(key: string) {
      const value = localStorage.getItem(key);
      if (!value) return null;
      return value;
    }
  
    static set(key: string, value: string) {
      localStorage.setItem(key, value);
    }
  
    static remove(key: string) {
      localStorage.removeItem(key);
    }
  }
  