export interface UserEntity {
  id: string;
  name: string;
  email?: string;
  password: string;
  phone?: string;
  username: string;
  admin: boolean;
}

export interface AppEntity {
  id: string;
  proxy_pass: string;
  port: string;
  name: string;
  description?: string;
  image?: string;
}

export interface UserAppEntity {
  userId: string;
  appId: string;
}

export interface RefreshTokenEntity {
  id?: string;
  token: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
}
