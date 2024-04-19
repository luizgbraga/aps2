export class Record<T> {
    private initialState: T;
    private changes: Partial<T>;
  
    constructor(entity: T) {
      this.initialState = { ...entity };
      this.changes = {};
    }
  
    hasChanges(key?: keyof T): boolean {
      if (key) {
        return this.changes[key] !== undefined;
      } else {
        for (const key in this.changes) {
          if (this.changes[key] !== this.initialState[key]) {
            return true;
          }
        }
        return false;
      }
    }
  
    set(key: keyof T, value: T[keyof T]) {
      this.changes[key] = value;
    }
  
    get<K extends keyof T>(key: K): T[K] {
      return this.changes[key] ?? this.initialState[key];
    }
  
    get changed(): Partial<T> {
      return this.changes;
    }
  
    get initial(): T {
      return this.initialState;
    }
  }
  