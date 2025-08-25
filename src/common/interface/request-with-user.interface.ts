import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    id: number;
    email: string;
    role_id: number;
    securityStamp: string;
  };
}