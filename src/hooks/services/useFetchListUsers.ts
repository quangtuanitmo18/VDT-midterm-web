import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { queryResources } from '../resources/query.resources'
import userService from 'src/services/user.service'
import { User } from 'src/types/user/user.type'

export default function useFetchListUsers() {
  const {
    data: listUsersResponse,
    isError,
    error,
    refetch,
    isPending
  } = useQuery({
    queryKey: [queryResources.user.list],
    queryFn: () => userService.getListUsers()
  })

  if (isError) {
    toast('Load list users thất bại', {
      position: 'top-right',
      autoClose: 1000
    })
  }
  return {
    listUsers: listUsersResponse?.data.data as User[],
    isPendingFetchListUsers: isPending,
    refetchListUsers: refetch,
    isErrorFetchListUsers: isError,
    error
  }
}
