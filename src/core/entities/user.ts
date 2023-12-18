import { Farmacia, FarmaciaPayload } from "./farmacia"

export interface User {
  uuid: string
  firebase: string
  password: string
  fullname: string
  cf: string
  citta: string
  favourite?: FarmaciaPayload
  worksIn?: FarmaciaPayload
};

export type UserPayload = Omit<User, 'uuid'|'password'|'firebase'>

export interface UserToken {
  payload: {uuid: string},
  user: UserPayload,
  iat: number
}

export class User implements User {
  constructor(obj: UserPayload){
    Object.assign(this, obj)
  }
}