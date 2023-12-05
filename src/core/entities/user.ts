import { Farmacia } from "./farmacia"

export enum Role {
  Admin, //"0"
  Farmacia,
  Utente
}
export interface User {
  uuid: string
  password: string
  fullname: string
  cf: string
  role: Role
  farmacia_preferita: Farmacia
};
export type UserPayload = Omit<User, 'uuid'|'password'>
export type UserTokenVerification = Omit<User, 'password'>

export interface UserToken {
  payload: {uuid: string},
  user: User,
  iat: number
}