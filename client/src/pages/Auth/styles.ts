import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: theme.spacing(6, 2, 5),
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: theme.palette.secondary.light,
    marginBottom: theme.spacing(3),
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(4),
  },
  submitBtn: {
    margin: theme.spacing(3, 0, 2),
    width: '96%',
  },
}))

export default useStyles
