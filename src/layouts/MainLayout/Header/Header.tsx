const Header = () => {
  return (
    <div className='container'>
      <header>
        <div className='flex  flex-col items-center justify-center gap-7 p-8'>
          <img src='/vdt-2024.jpg' alt='' className='h-full w-full object-cover' />
          <h1 className='text-4xl font-semibold text-red-500'>VDT Midterm 2024</h1>
        </div>
      </header>
    </div>
  )
}

export default Header
