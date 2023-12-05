import { UserTokenVerification } from '../entities/user'
import { NewUserParams, VerifyUserParams } from '../schemas/user.schema'

export interface IUserRepository {
  createUser: (u: NewUserParams) => Promise<string>
  verifyUser: (u: VerifyUserParams) => Promise<UserTokenVerification>
}
