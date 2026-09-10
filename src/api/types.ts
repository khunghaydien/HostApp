export type ApiMessage = string | string[];

export type ApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message: ApiMessage;
  data: T | null;
  timestamp?: string;
  path?: string;
  method?: string;
  error?: string;
};

export type ApiResult<T> = {
  data: T;
  message: string;
};

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

/** Backend may return `message` as string or string[]. */
export function normalizeApiMessage(
  message: ApiMessage | null | undefined,
  fallback: string,
): string {
  if (Array.isArray(message)) {
    const joined = message
      .map((item) => String(item).trim())
      .filter(Boolean)
      .join('\n');
    return joined || fallback;
  }

  if (typeof message === 'string' && message.trim()) {
    return message.trim();
  }

  return fallback;
}
