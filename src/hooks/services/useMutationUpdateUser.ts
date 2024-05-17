import { useMutation } from '@tanstack/react-query'
import userService from 'src/services/user.service'
import { CreateUserBody, UpdateUserBody } from 'src/types/user/user.api.type'

export default function useMutationUpdateUser() {
  const { isError, isPending, isSuccess, mutate } = useMutation({
    mutationFn: ({ userId, body }: { userId: string; body: UpdateUserBody }) => userService.updateUser(userId, body)
  })

  return {
    updateUserMutate: mutate,
    isPendingUpdateUser: isPending,
    isSuccessUpdateUser: isSuccess,
    isErrorUpdateUser: isError
  }
}
