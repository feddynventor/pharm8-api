import { UserPayload } from '../entities/user'
import { NewUserParams, UpdateUserParams, VerifyUserParams } from '../schemas/user.schema'

export interface IUserRepository {
  getUser: (user_id: string) => Promise<UserPayload>
  createUser: (u: NewUserParams) => Promise<string>
  verifyUser: (u: VerifyUserParams) => Promise<string>
  updateFarmaciaPreferita: (u: string, f: UpdateUserParams) => Promise<void>
}
