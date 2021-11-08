import { FC, useEffect, forwardRef, MutableRefObject } from 'react'

import { Snackbar as SnackbarContainer } from '@material-ui/core'
import MuiAlert, { AlertProps } from '@mui/material/Alert'

interface Props {
  style?: any
  snackbarSuccessTitle: string
  snackbarWarningTitle: string
  openSnackbar: boolean
  setOpenSnackbar: Function
  severity: boolean
  anchorOrigin: {
    vertical: 'top' | 'bottom'
    horizontal: 'left' | 'right' | 'center'
  }
  duration?: number
}

interface Props {
  ref: MutableRefObject<HTMLDivElement>
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

let zIndex = '10'

// @ts-ignore
const Snackbar: FC<Props> = forwardRef(
  (
    {
      style,
      snackbarSuccessTitle,
      snackbarWarningTitle,
      openSnackbar,
      setOpenSnackbar,
      severity,
      anchorOrigin,
      duration,
    },
    ref
  ) => {
    useEffect(() => {
      // Change z-index of the newest snackbar to be at the top
      // @ts-ignore
      ref.current.style.zIndex = +zIndex++
    }, [])

    const handleCloseSnackbar = (_?: React.SyntheticEvent, reason?: string) => {
      if (reason === 'clickaway') {
        return
      }

      setOpenSnackbar(false)
    }

    return (
      <SnackbarContainer
        style={style}
        anchorOrigin={anchorOrigin}
        open={openSnackbar}
        onClose={handleCloseSnackbar}
        ref={ref}
        autoHideDuration={duration || 5000}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={severity ? 'success' : 'error'}
        >
          {severity ? snackbarSuccessTitle : snackbarWarningTitle}
        </Alert>
      </SnackbarContainer>
    )
  }
)

export default Snackbar
