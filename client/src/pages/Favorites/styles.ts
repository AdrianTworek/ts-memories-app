import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2.5rem',
    marginBottom: theme.spacing(3),
  },
  memoriesContainer: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
    gap: theme.spacing(4),
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      maxWidth: 538,
      justifyContent: 'center',
    },
    [theme.breakpoints.up('md')]: {
      justifyContent: 'center',
      minWidth: 700,
      flexDirection: 'row',
    },
    [theme.breakpoints.up('lg')]: {
      minWidth: 1000,
      juststifyContent: 'center',
      alignItems: 'flex-start',
    },
  },
  infoTitle: {
    fontSize: '1.7rem',
    fontWeight: 500,
    textAlign: 'center',
    color: theme.palette.secondary.main,
    textShadow: `1px 3px ${theme.palette.primary.main}`,
    [theme.breakpoints.up('sm')]: {
      fontSize: '1.8rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '2.1rem',
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: '2.5rem',
    },
    [theme.breakpoints.up('xl')]: {
      fontSize: '3rem',
    },
  },
}))

export default useStyles
