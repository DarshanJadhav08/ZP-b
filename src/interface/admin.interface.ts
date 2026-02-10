export interface IAdmin {
  id: string;
  user_id: string;
  designation?: string;
}

export interface IAdminCreation extends Omit<IAdmin, "id"> {}
