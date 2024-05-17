import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Button } from 'src/components/ui/button'
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from 'src/components/ui/dialog'
import { Input } from 'src/components/ui/input'
import { Label } from 'src/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'src/components/ui/select'
import { queryResources } from 'src/hooks/resources/query.resources'
import useFetchListUsers from 'src/hooks/services/useFetchListUsers'
import useFetchUserById from 'src/hooks/services/useFetchUserById'
import useMutationCreateUser from 'src/hooks/services/useMutationCreateUser'
import useMutationUpdateUser from 'src/hooks/services/useMutationUpdateUser'

interface DialogContentProps {
  dialogTitle: string
  dialogBtnTitle: string
  actionType: 'create' | 'update'
  userId?: string
}
const DialogContentUser = ({ dialogTitle, dialogBtnTitle, actionType, userId }: DialogContentProps) => {
  const [formDataUser, setFormDataUser] = useState({
    fullname: '',
    gender: 'nam',
    university: ''
  })

  const queryClient = useQueryClient()

  const { createUserMutate } = useMutationCreateUser()
  const { updateUserMutate } = useMutationUpdateUser()
  const { user, isPendingFetchUserByid } = useFetchUserById(userId as string)!
  const { refetchListUsers } = useFetchListUsers()

  const handleChangeDataUser = (e: any) => {
    const { name, value } = e.target
    setFormDataUser({
      ...formDataUser,
      [name]: value
    })
  }

  const handleActionSubmit = (e: any, actionType: 'create' | 'update', userId?: string) => {
    e.preventDefault()
    if (actionType === 'create') {
      createUserMutate(
        { user: formDataUser },
        {
          onSuccess: () => {
            toast.success('Create user successfully')
            refetchListUsers()
            setFormDataUser({
              fullname: '',
              gender: 'nam',
              university: ''
            })
          }
        }
      )
    } else if (actionType === 'update') {
      updateUserMutate(
        { userId: userId as string, body: formDataUser },
        {
          onSuccess: () => {
            toast.success('Update user successfully')
            queryClient.invalidateQueries({ queryKey: [queryResources.user.list] })
          }
        }
      )
    }
  }

  useEffect(() => {
    if (actionType === 'update' && user) {
      setFormDataUser({
        fullname: user.fullname,
        gender: user.gender,
        university: user.university
      })
    }
  }, [userId, user])

  if (userId && isPendingFetchUserByid) return null

  return (
    <form>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='fullname' className='text-right'>
              Fullname
            </Label>
            <Input
              id='fullname'
              name='fullname'
              value={formDataUser.fullname}
              onChange={handleChangeDataUser}
              className='col-span-3'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='gender' className='text-right'>
              Gender
            </Label>
            <Select
              name='gender'
              onValueChange={(value) => handleChangeDataUser({ target: { name: 'gender', value } } as any)}
              value={formDataUser.gender}
            >
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Nam' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='nam'>Nam</SelectItem>
                <SelectItem value='nữ'>Nữ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='university' className='text-right'>
              University
            </Label>
            <Input
              id='university'
              name='university'
              value={formDataUser.university}
              onChange={handleChangeDataUser}
              className='col-span-3'
            />
          </div>
        </div>
        <DialogFooter>
          <Button type='submit' onClick={(e: any) => handleActionSubmit(e, actionType, userId)}>
            {dialogBtnTitle}
          </Button>
        </DialogFooter>
      </DialogContent>
    </form>
  )
}

export default DialogContentUser
