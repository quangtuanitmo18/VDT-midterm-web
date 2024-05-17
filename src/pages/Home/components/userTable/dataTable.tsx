import { UseMutateFunction } from '@tanstack/react-query'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { useState } from 'react'
import { Button } from 'src/components/ui/button'
import { Dialog, DialogTrigger } from 'src/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from 'src/components/ui/dropdown-menu'
import { Input } from 'src/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'src/components/ui/table'
import DialogContentUser from './dialogContentUser'
import useMutationCreateUser from 'src/hooks/services/useMutationCreateUser'
import { toast } from 'react-toastify'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const { createUserMutate } = useMutationCreateUser()

  const [formDataUser, setFormDataUser] = useState({
    fullname: '',
    gender: 'nam',
    university: ''
  })
  console.log(formDataUser)

  const handleChangeDataUser = (e: any) => {
    const { name, value } = e.target
    setFormDataUser({
      ...formDataUser,
      [name]: value
    })
  }
  const handleCreateUser = (e: any) => {
    e.preventDefault()
    console.log(formDataUser)
    createUserMutate(
      { user: formDataUser },
      {
        onSuccess: () => {
          toast.success('Create user successfully')
          setFormDataUser({
            fullname: '',
            gender: 'nam',
            university: ''
          })
        }
      }
    )
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility
    }
  })

  return (
    <div>
      <div className='flex items-center justify-between py-4'>
        <Input
          placeholder='Filter fullname...'
          value={(table.getColumn('fullname')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('fullname')?.setFilterValue(event.target.value)}
          className='max-w-sm'
        />
        <div className='space-x-2'>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant='outline'>Add user</Button>
            </DialogTrigger>
            <DialogContentUser
              dialogTitle='Add user'
              dialogBtnTitle='Add'
              dialogAction={handleCreateUser}
              handleChangeInput={handleChangeDataUser}
              dialogFormData={formDataUser}
            ></DialogContentUser>
          </Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' className='ml-auto'>
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className='capitalize'
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <Button variant='outline' size='sm' onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant='outline' size='sm' onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  )
}
