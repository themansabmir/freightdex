export const generatePageTitle = (isForm: boolean, isEdit: boolean, isView: boolean, moduleName: string): string => {
  if (isForm && isView) return `View ${moduleName} Details`;
  if (isForm && isEdit) return `Update ${moduleName}`;
  if (isForm && !isEdit) return `Create New ${moduleName}`;
  return `${moduleName}s`;
};

/**
 * Constructs a URL with query parameters based on provided options.
 *
 * @param {string} baseUrl - The base URL without any query parameters (e.g., '/vendor').
 * @param {object} options - An object containing the parameters for the URL.
 * @param {number} [options.limit] - The number of items to return.
 * @param {number} [options.skip] - The number of items to skip.
 * @param {string} [options.sortBy] - The field to sort by.
 * @param {'asc' | 'desc'} [options.sortOrder] - The sort order ('asc' or 'desc').
 * @param {string} [options.search] - The search query string. This will be trimmed before appending.
 * @returns {string} The full URL with query parameters.
 */
export function buildUrlWithSearchParams(
  baseUrl: string,
  options: {
    limit: string;
    skip: string;
    sortBy: string;
    sortOrder: string;
    search: string;
  } = { limit: '', skip: '', sortBy: '', sortOrder: '', search: '' }
): string {
  const params = new URLSearchParams();

  const { limit, skip, sortBy, sortOrder, search } = options;

  if (limit !== undefined && skip !== undefined) {
    params.append('limit', String(limit));
    params.append('skip', String(skip));
  }

  if (sortBy && sortOrder) {
    params.append('sortBy', sortBy);
    params.append('sortOrder', sortOrder);
  }

  if (search && search.trim()) {
    params.append('search', search.trim());
  }

  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

export const returnSelectedRecord = (data: any, selectedId: string) => {
  const record = data?.filter((row: any) => row._id === selectedId)[0];
  return record;
};

export const hydratePayload = <T extends Record<string, any>>(formData: T): T => {
  const cleanPayload = (Object.keys(formData) as (keyof T)[]).reduce((acc, key) => {
    const value = formData[key];
    // Cast the accumulator to a mutable indexable type just for this write
    (acc as Record<string, any>)[key as string] = value === '' ? null : value;
    return acc;
  }, {} as T);

  return cleanPayload;
};

export function removeNulls(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(removeNulls).filter((item) => item != null && (typeof item !== 'object' || Object.keys(item).length > 0));
  }

  if (typeof obj === 'object' && obj !== null) {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      const cleanedValue = removeNulls(value);
      if (cleanedValue !== null && cleanedValue !== undefined && !(typeof cleanedValue === 'object' && Object.keys(cleanedValue).length === 0)) {
        cleaned[key] = cleanedValue;
      }
    }
    return cleaned;
  }

  return obj;
}

// export const hydratePayload = <T extends Record<string, any>>(formData: T): T => {
//   const cleanPayload = Object.keys(formData).reduce((acc, key) => {
//     const value = formData[key];
//     acc[key] = value === '' ? null : value;
//     return acc;
//   }, {} as T);

//   return cleanPayload;
// };

export const splitCompositeFields = (userPayload: any, keys: any) => {
  const payload = { ...userPayload };
  for (const key of keys) {
    if (payload[key]) {
      const [name, address] = payload[key].split('|');
      payload[key] = name;
      payload[`${key}_address`] = address;
    }
  }

  return payload;
};

export const joinCompositeFields = (userPayload: any, keys: any) => {
  const payload = { ...userPayload };
  for (const key of keys) {
    if (payload[key] && payload[`${key}_address`]) {
      payload[key] = `${payload[key]}|${payload[`${key}_address`]}`;
    }
  }

  return payload;
};
