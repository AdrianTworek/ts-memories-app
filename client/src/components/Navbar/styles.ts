import { makeStyles } from '@material-ui/core'

const commonFlexGap = {
  display: 'flex',
  gap: '0.75rem',
}

const useStyles = makeStyles((theme) => ({
  appBar: {
    padding: '0.2rem',
    marginBottom: theme.spacing(6),
  },
  menu: {
    '& div': {
      padding: '0.2rem',
    },
    '& li': {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: '0.5rem',
      margin: '0 auto',
      padding: '5px',
    },
    '& li:nth-child(3)': {
      marginBottom: theme.spacing(1),
    },
    // Log out menu item
    '& li:nth-child(5)': {
      display: 'flex',
      justifyContent: 'center',
      color: theme.palette.secondary.main,
    },
  },
  logo: {
    marginRight: '0.75rem',
    width: '2.5rem',
    height: '2.5rem',
  },
  title: {
    marginRight: 'auto',
  },
  buttonsContainer: commonFlexGap,
  profile: commonFlexGap,
  avatar: {
    backgroundColor: theme.palette.secondary.main,
    width: '2rem',
    height: '2rem',
    [theme.breakpoints.up('sm')]: {
      width: '2.5rem',
      height: '2.5rem',
    },
  },
  avatarLetter: {
    fontWeight: 700,
    fontSize: '1rem',
  },
  hamburgerIcon: {
    color: 'white',
    marginLeft: 'auto',
  },
}))

export default useStyles
