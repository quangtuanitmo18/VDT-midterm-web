import { ColumnDef } from '@tanstack/react-table'
import { User } from 'src/types/user.type'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from 'src/components/ui/dropdown-menu'
import { Button } from 'src/components/ui/button'
import useMutationDeleteUser from 'src/hooks/services/useMutationDeleteUser'
import { toast } from 'react-toastify'
import useFetchListUsers from 'src/hooks/services/useFetchListUsers'

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'fullname',
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <p className='font-semibold text-red-500'>Fullname</p>
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    }
  },
  {
    accessorKey: 'gender',
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <p className='font-semibold text-red-500'>Gender</p>
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    }
  },
  {
    accessorKey: 'university',
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <p className='font-semibold text-red-500'>University</p>
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original
      const { deleteUserMutate } = useMutationDeleteUser()
      const { refetchListUsers } = useFetchListUsers()

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user._id)}>Copy user ID</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                deleteUserMutate(
                  { userId: user._id },
                  {
                    onSuccess: () => {
                      toast.success('Delete user successfully!')
                      refetchListUsers()
                    }
                  }
                )
              }
            >
              Delete user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]
