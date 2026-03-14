export interface IUser {
  id: string;
  email: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}
export interface IAuthUser extends Pick<IUser, 'id' | 'email'> {
  roles: string[];
}
