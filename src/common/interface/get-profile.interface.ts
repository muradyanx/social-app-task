export interface GetProfileInterface {
  id: number;
  first_name: string;
  last_name: string;
  age: number;
  email: string;
  role_id: number;
}

export interface ProfileResponseInterface {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  roleId: number;
}

export interface GetProfileResponseInterface {
  status: number;
  user: ProfileResponseInterface;
}
