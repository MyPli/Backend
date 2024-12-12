export class User {
  id: number;
  email: string;
  nickname: string;
  profileImage?: string;
  authProvider: string; // 'email' or 'google'
  createdAt: Date;
  updatedAt: Date;
}
