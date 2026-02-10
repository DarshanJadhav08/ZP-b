export interface IUser {
  id: string;
  name?: string;
  phone: string;
  password: string;
  role_id: string;
  client_id?: string;
  is_active?: boolean;
  created_at?: Date;
}

export interface IUserCreation
  extends Omit<IUser, "id" | "created_at"> {}
