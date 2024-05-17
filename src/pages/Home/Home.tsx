import LoadingSpin from 'src/components/loading'
import useFetchListUsers from 'src/hooks/services/useFetchListUsers'
import { DataTable } from './components/userTable/dataTable'
import { columns } from './components/userTable/columns'
import useMutationDeleteUser from 'src/hooks/services/useMutationDeleteUser'

const Home = () => {
  const { listUsers, isPendingFetchListUsers } = useFetchListUsers()

  if (isPendingFetchListUsers) return <LoadingSpin></LoadingSpin>
  return (
    <div className='container'>
      <DataTable columns={columns} data={listUsers} />
    </div>
  )
}

export default Home
