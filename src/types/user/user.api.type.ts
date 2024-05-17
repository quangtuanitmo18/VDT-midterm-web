import { User } from './user.type'

export type CreateUserBody = Omit<User, '_id' | 'created_at' | 'updated_at'>
export type UpdateUserBody = Omit<User, '_id' | 'created_at' | 'updated_at'>
