export interface IUser {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  phone: string;
  password: string;
  role_id: string;
  client_id?: string | null;
  is_active?: boolean;
  profile_image?: string;
  date_of_birth?: Date;
  gender?: 'male' | 'female' | 'other';
  created_at?: Date;
}

export interface IUserCreation
  extends Omit<IUser, "id" | "created_at"> {}
