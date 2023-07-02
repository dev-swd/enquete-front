import client from "./client";

// テンプレート一覧
export const getTemplates = () => {
  return client.get(`/api/template`);
}

// テンプレート登録
export interface addTemplateParams {
  name: string;
  type: string;
  title: string;
  maxLength: number;
  items: string;
}
export const addTemplate = (params: addTemplateParams) => {
  return client.post(`/api/template`, params);
}

// アンケート一覧
export const getEnquetes = () => {
  return client.get(`/api/enquete`);
}

// アンケート登録
export interface addEnqueteItemParams {
  enqueteTemplateId: number | null;
  type: string;
  title: string;
  maxLength: number | null;
  items: string;
}
export interface addEnqueteParams {
  name: string;
  description: string;
  items: addEnqueteItemParams[];
}
export const addEnquete = (params: addEnqueteParams) => {
  return client.post(`/api/enquete`, params);
}

// 宛先一覧
export const getClients = () => {
  return client.get(`/api/client`);
}

// 宛先登録
export interface addClientParams {
  company: string;
  division: string;
  person: string;
  email: string;
}
export const addClient = (params: addClientParams) => {
  return client.post(`/api/client`, params);
}

// 依頼一覧
export const getRequests = () => {
  return client.get(`/api/request`);
}

// 依頼登録
export interface addRequestParams {
  clientId: number | null;
  enqueteId: number | null;
  enqueteCode: string;
}
export const addRequest = (params: addRequestParams) => {
  return client.post(`/api/request`, params);
}

// 回答参照
export const getResponse = (id: number | null) => {
  return client.get(`/api/response/${id}`);
}

// サインイン
export interface SignInParams {
  email: string
  enqueteCode: string
}
export const signIn = (params: SignInParams) => {
  return client.post(`/api/enquete-signin`, params);
}

// アンケート登録
export interface EnqueteItemParams {
  enqueteItemId: number | null;
  value: string;
}
export interface EnqueteParams {
  requestId: number | null;
  items: EnqueteItemParams[];
}
export const writeEnquete = (params: EnqueteParams) => {
  return client.post(`/api/enquete-response`, params);
}
