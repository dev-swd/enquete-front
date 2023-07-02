import client from "./client";

// サインアップ
export interface SignUpParams {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}
export const sanctum = () => {
  return client.get(`/sanctum/csrf-cookie`)
}
export const signUp = (params: SignUpParams) => {
  return client.post(`/register`, params);
}

// サインイン
export interface SignInParams {
  email: string
  password: string
}
export const signIn = (params: SignInParams) => {
  return client.post(`/login`, params);
}

// ログイン中ユーザ情報取得
export const getAuthUser = () => {
  return client.get(`/api/user`);
}

// サインアウト
export const signOut = () => {
  return client.post(`/logout`, undefined);
}
