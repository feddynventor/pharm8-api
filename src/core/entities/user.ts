import { Farmacia } from "./farmacia"

export interface User {
  uuid: string
  // firebase: string
  password: string
  fullname: string
  cf: string
  favourite?: Farmacia
  worksIn?: Farmacia
};

export type UserPayload = Omit<User, 'password'>

export interface UserToken {
  payload: {uuid: string},
  user: User,
  iat: number
}

export class User implements User {
}