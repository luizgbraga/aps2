// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const queryfy = (filters: Record<string, any>) => {
    if (!filters) return '';
    let query = '';
    for (const key of Object.keys(filters)) {
      if (filters[key] === undefined) continue;
      query += `${key}=${filters[key]}&`;
    }
    return query.slice(0, -1);
  };
  