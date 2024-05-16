import { User } from 'src/types/user.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const userService = {
  getUserById(id: string) {
    return http.get<SuccessResponse<User>>(`users/${id}`)
  }
  // updateProfile(body: BodyUpdateProfile) {
  //   return http.put<SuccessResponse<User>>('user', body)
  // },
}

export default userService
