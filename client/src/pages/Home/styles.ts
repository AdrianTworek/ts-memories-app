import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2.5rem',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: '4rem',
    },
    '& .MuiPagination-root': {
      display: 'grid',
      placeItems: 'center',
      [theme.breakpoints.up('md')]: {
        placeItems: 'start',
      },
    },
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
      justifyContent: 'flex-start',
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: 900,
      alignItems: 'flex-start',
    },
  },
  selectContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    margin: '0 auto',
    [theme.breakpoints.up('md')]: {
      justifyContent: 'flex-start',
    },
  },
  emptyCategoryContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  infoTitle: {
    fontSize: '1.5rem',
    fontWeight: 300,
    color: '#777',
    marginBottom: '1.1rem',
    textAlign: 'center',
  },
  limitContainer: {
    width: '100%',
    display: 'grid',
    placeItems: 'center',
    [theme.breakpoints.up('md')]: {
      placeItems: 'start',
    },
  },
  limitLabel: {
    minWidth: 110,
    m: 1,
  },
  pagination: {
    width: '100%',
  },
  paginationButtonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    padding: theme.spacing(2),
  },
}))

export default useStyles
