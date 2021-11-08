import { FC, forwardRef, ReactElement, Ref } from 'react'

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Slide,
} from '@material-ui/core'
import { TransitionProps } from '@material-ui/core/transitions'

interface Props {
  dialogTitle: string
  dialogContentText: string
  openDialog: boolean
  setOpenDialog: Function
  handleDelete: Function
  itemToRemove: string
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children?: ReactElement<any, any>
  },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

const DeleteDialog: FC<Props> = ({
  dialogTitle,
  dialogContentText,
  openDialog,
  setOpenDialog,
  handleDelete,
  itemToRemove,
}) => {
  const handleClose = () => setOpenDialog(false)

  return (
    <Dialog
      open={openDialog}
      onClose={handleClose}
      TransitionComponent={Transition}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {dialogContentText}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="primary" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleDelete(itemToRemove)}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteDialog
