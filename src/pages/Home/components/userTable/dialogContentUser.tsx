import { Button } from 'src/components/ui/button'
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from 'src/components/ui/dialog'
import { Input } from 'src/components/ui/input'
import { Label } from 'src/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'src/components/ui/select'
import { User } from 'src/types/user/user.type'

interface DialogContentProps {
  dialogTitle: string
  dialogBtnTitle: string
  handleChangeInput: (e: React.ChangeEvent<HTMLInputElement>) => void
  dialogFormData: Omit<User, '_id' | 'created_at' | 'updated_at'>
  dialogAction: (e: React.FormEvent<HTMLFormElement>) => void
}
const DialogContentUser = ({
  dialogTitle,
  dialogBtnTitle,
  dialogAction,
  handleChangeInput,
  dialogFormData
}: DialogContentProps) => {
  return (
    <form onSubmit={dialogAction}>
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
              value={dialogFormData.fullname}
              onChange={handleChangeInput}
              className='col-span-3'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='gender' className='text-right'>
              Gender
            </Label>
            <Select
              name='gender'
              onValueChange={(value) => handleChangeInput({ target: { name: 'gender', value } } as any)}
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
              value={dialogFormData.university}
              onChange={handleChangeInput}
              className='col-span-3'
            />
          </div>
        </div>
        <DialogFooter>
          <Button type='submit' onClick={(e: any) => dialogAction(e)}>
            {dialogBtnTitle}
          </Button>
        </DialogFooter>
      </DialogContent>
    </form>
  )
}

export default DialogContentUser
