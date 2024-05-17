import { User } from 'src/types/user.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const userService = {
  getUserById(id: string) {
    return http.get<SuccessResponse<User>>(`users/${id}`)
  },

  getListUsers() {
    return http.get<SuccessResponse<User[]>>('users/list')
  },

  deleteUser(id: string) {
    return http.delete(`users/delete/${id}`)
  }
}

export default userService
