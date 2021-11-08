import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: '0 auto',
    borderRadius: 8,
    padding: theme.spacing(3),
    minWidth: 280,
    maxWidth: 300,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'flex-start',
    [theme.breakpoints.up('sm')]: {
      minWidth: 300,
    },
    [theme.breakpoints.up('md')]: {
      margin: 0,
    },
  },
  title: {
    fontSize: '1.2rem',
    fontWeight: 500,
    color: '#555',
  },
  form: {
    width: '100%',
    margin: `${theme.spacing(3)}px auto 0`,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.7rem',
  },
  uploadBtn: {
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
  },
  spinnerContainer: {
    display: 'grid',
    placeItems: 'center',
    minWidth: 280,
    height: 477,
  },
}))

export default useStyles
