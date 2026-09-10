import { getAccessToken } from '@/auth/storage';
import { emitToast } from '@/ui/toast/toastBridge';

import { API_BASE_URL } from './config';
import {
  ApiError,
  normalizeApiMessage,
  type ApiResponse,
  type ApiResult,
} from './types';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  /** Override session token; pass null to skip Authorization. */
  token?: string | null;
};

const SUCCESS_TOAST_METHODS: ReadonlySet<HttpMethod> = new Set([
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
]);

export async function apiRequest<T>(
  path: string,
  { method = 'GET', body, token }: RequestOptions = {},
): Promise<ApiResult<T>> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  const bearer = token === undefined ? getAccessToken() : token;
  if (bearer) {
    headers.Authorization = `Bearer ${bearer}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    const error = new ApiError('Network request failed', 0);
    emitToast('error', error.message);
    throw error;
  }

  let payload: ApiResponse<T> | null = null;
  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    // Non-JSON body.
  }

  if (!response.ok || !payload?.success) {
    const message = normalizeApiMessage(
      payload?.message,
      payload?.error || `Request failed (${response.status})`,
    );
    emitToast('error', message);
    throw new ApiError(message, payload?.statusCode ?? response.status);
  }

  if (payload.data == null) {
    const message = normalizeApiMessage(payload.message, 'Empty response');
    emitToast('error', message);
    throw new ApiError(message, payload.statusCode);
  }

  const message = normalizeApiMessage(payload.message, 'OK');
  if (SUCCESS_TOAST_METHODS.has(method)) {
    emitToast('success', message);
  }

  return {
    data: payload.data,
    message,
  };
}
