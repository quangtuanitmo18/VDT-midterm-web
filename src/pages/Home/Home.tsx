import useFetchUserById from 'src/hooks/services/useFetchUserById'

const Home = () => {
  const { user } = useFetchUserById('664632556cfefb42c351d1a5')
  console.log(user)

  return <div className='text-3xl text-red-500'>Home</div>
}

export default Home
