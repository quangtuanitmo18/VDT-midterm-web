import { useMutation } from '@tanstack/react-query'
import userService from 'src/services/user.service'
import { CreateUserBody } from 'src/types/user/user.api.type'
import { User } from 'src/types/user/user.type'

export default function useMutationCreateUser() {
  const { isError, isPending, isSuccess, mutate } = useMutation({
    mutationFn: ({ user }: { user: CreateUserBody }) => userService.createUser(user)
  })

  return {
    createUserMutate: mutate,
    isPendingCreateUser: isPending,
    isSuccessCreateUser: isSuccess,
    isErrorCreateUser: isError
  }
}
