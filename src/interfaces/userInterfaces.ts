export interface RegisterControllerParams {
  email: string;
  password: string;
  name: string;
  role: string;
  isActive: boolean;
}

export interface LoginControllerParams {
  email: string;
  password: string;
}

export interface VerificationParams {
  email: string;
  username: string;
}
