import { User } from './user.type'

export type CreateUserBody = Omit<User, '_id' | 'created_at' | 'updated_at'>
