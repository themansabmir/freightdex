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
  }={ limit: '', skip: '', sortBy: '', sortOrder: '', search: '' },
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



export const returnSelectedRecord = (data, selectedId) => {
  const record = data?.filter((row) => row._id === selectedId)[0];
  return record;
};