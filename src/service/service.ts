import axios from "axios";
import { IAuthLoginResponse } from "../interfaces/auth.interface";
import {
  IDocumentFormData,
  IDocumentOperationResponse,
  IDocumentResponse,
  IDocumentsResponse,
} from "../interfaces/document.interface";

const API_HOST = "https://test.v5.pryaniky.com";
const api = axios.create({
  baseURL: `${API_HOST}/ru/data/v3/testmethods/docs`,
});

let authToken: string | null = localStorage.getItem("token");

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
};

api.interceptors.request.use((config) => {
  if (authToken && config.url?.includes("/userdocs")) {
    config.headers["x-auth"] = authToken;
  }
  return config;
});

export const authService = {
  login: (username: string, password: string) =>
    api.post<IAuthLoginResponse>("/login", { username, password }),
};

export const documentService = {
  getAll: () => api.get<IDocumentsResponse>("/userdocs/get"),
  create: (data: IDocumentFormData) =>
    api.post<IDocumentResponse>("/userdocs/create", data),
  update: (id: string, data: IDocumentFormData) =>
    api.post<IDocumentOperationResponse>(`/userdocs/set/${id}`, data),
  delete: (id: string) =>
    api.post<IDocumentOperationResponse>(`/userdocs/delete/${id}`, {}),
};
