import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { queryResources } from '../resources/query.resources'
import userService from 'src/services/user.service'
import { User } from 'src/types/user/user.type'

export default function useFetchUserById(id: string) {
  const {
    data: userResponse,
    isError,
    error,
    refetch,
    isPending
  } = useQuery({
    queryKey: [queryResources.user.getById, id],
    queryFn: () => userService.getUserById(id),
    enabled: !!id
  })

  if (isError) {
    toast('Load user thất bại', {
      position: 'top-right',
      autoClose: 1000
    })
  }
  return {
    user: userResponse?.data.data as User,
    isPendingFetchUserByid: isPending,
    refetchUserById: refetch,
    isErrorFetchUserById: isError,
    error
  }
}
