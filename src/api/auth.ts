import { apiRequest } from './client';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AuthSession = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};

export type LoginBody = {
  email: string;
  password: string;
};

export type LoginResult = AuthSession;

export function loginRequest(body: LoginBody) {
  return apiRequest<LoginResult>('/auth/login', {
    method: 'POST',
    body,
  });
}
