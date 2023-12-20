import { UserPayload } from '../entities/user'
import { NewUserParams, UpdateUserParams, VerifyUserParams } from '../schemas/user.schema'

export interface IUserRepository {
  getUser: (user_id: string) => Promise<UserPayload>
  deleteUser: (user_id: string, farmacia_uuid?: string) => Promise<void>
  createUser: (u: NewUserParams) => Promise<string>
  verifyUser: (u: VerifyUserParams) => Promise<string>
  updateFarmaciaPreferita: (user_id: string, codice_farmacia: string) => Promise<void>
  removeFarmaciaPreferita: (user_id: string) => Promise<void>
  updateCitta: (user_id: string, citta: string) => Promise<void>
}
