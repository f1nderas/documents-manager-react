export interface IAuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
}
export interface IAuthLoginResponse {
  data: {
    token: string;
  };
}
