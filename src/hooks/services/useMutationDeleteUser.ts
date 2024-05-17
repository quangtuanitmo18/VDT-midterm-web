import { useMutation } from '@tanstack/react-query'
import userService from 'src/services/user.service'

export default function useMutationDeleteUser() {
  const { isError, isPending, isSuccess, mutate } = useMutation({
    mutationFn: ({ userId }: { userId: string }) => userService.deleteUser(userId)
  })

  return {
    deleteUserMutate: mutate,
    isPendingDeleteUser: isPending,
    isSuccessDeleteUser: isSuccess,
    isErrorDeleteUser: isError
  }
}
