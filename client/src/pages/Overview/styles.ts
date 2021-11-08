import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(6),
  },
  title: {
    color: '#444',
    fontWeight: 300,
    margin: '0 auto',
    [theme.breakpoints.up('sm')]: {
      textAlign: 'left',
    },
  },
  signupBtn: {
    marginTop: theme.spacing(3),
  },
  usersNumber: {
    fontWeight: 700,
    textShadow: `3px 2px ${theme.palette.primary.light}`,
  },
}))

export default useStyles
