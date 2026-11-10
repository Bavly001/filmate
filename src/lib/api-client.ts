// ==============================================================================
// FILMATE CLIENT API CLIENT (src/lib/api-client.ts)
// Directly aligned with kitcheniano-client-FE architecture
// ==============================================================================

export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const ImageURL = 'https://image.tmdb.org/t/p/original';
export const mediumImageURL = 'https://image.tmdb.org/t/p/w500';
export const lowImageURL = 'https://image.tmdb.org/t/p/w300';

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiClient<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, headers = {}, ...customConfig } = options;

  const token =
    process.env.NEXT_PUBLIC_TMDB_READ_ACCESS_TOKEN ||
    process.env.TMDB_READ_ACCESS_TOKEN ||
    '';

  const apiKey =
    process.env.NEXT_PUBLIC_TMDB_API_KEY ||
    process.env.TMDB_API_KEY ||
    '';

  let url = `${TMDB_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const searchParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
  }

  if (!token && apiKey && !searchParams.has('api_key')) {
    searchParams.append('api_key', apiKey);
  }

  const queryString = searchParams.toString();
  if (queryString) {
    url += `?${queryString}`;
  }

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...customConfig,
    headers: requestHeaders,
  });

  if (!response.ok) {
    let errorData: any = {};
    try {
      errorData = await response.json();
    } catch {
      // response might be empty or non-JSON
    }

    const errorMessage =
      errorData.status_message ||
      errorData.message ||
      `Request failed with status ${response.status}`;
    throw new ApiError(response.status, errorMessage, errorData);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

apiClient.get = function <T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  return apiClient<T>(endpoint, { ...options, method: 'GET' });
};

apiClient.post = function <T = any>(
  endpoint: string,
  body?: any,
  options: RequestOptions = {}
): Promise<T> {
  return apiClient<T>(endpoint, {
    ...options,
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
};
