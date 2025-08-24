export interface GetUserInterface {
  first_name: string;
  last_name: string;
  age: number;
  email: string;
  role_id: number;
}

export interface UserResponseInterface {
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  roleId: number;
}

export interface GetUsersResponseInterface {
  status: number;
  data: {
    users: UserResponseInterface[];
  };
  page: number;
  limit: number;
  total: number;
}

