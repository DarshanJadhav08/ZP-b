export interface ITeacher {
  id: string;
  user_id: string;
  subject?: string;
  qualification?: string;
}

export interface ITeacherCreation extends Omit<ITeacher, "id"> {}
