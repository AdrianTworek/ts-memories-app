import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  sidebarContainer: {
    textAlign: 'center',
    padding: theme.spacing(3),
    height: '100%',
  },
  sidebarTitle: {
    fontSize: '1.5rem',
    color: '#555',
    paddingBottom: theme.spacing(2),
    margin: '0 auto',
  },
  form: {
    marginTop: theme.spacing(3),
  },

  submitBtn: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    color: '#fff',
    backgroundColor: theme.palette.success.main,
    '&:hover': {
      backgroundColor: theme.palette.success.dark,
    },
  },
  categoriesContainer: {
    padding: theme.spacing(2),
    height: 270,
    overflow: 'scroll',
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  categoriesTitle: {
    marginTop: theme.spacing(4),
    fontWeight: 300,
  },
  categoryItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  categoryName: {
    maxWidth: 100,
    whiteSpace: 'nowrap',
    overflowX: 'scroll',
    fontSize: '1rem',
    fontWeight: 500,
    color: theme.palette.info.main,
    cursor: 'pointer',
    transition: 'all 200ms ease-in-out',
    '&:hover': {
      transform: 'scale(1.03)',
      fontWeight: 700,
    },
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  closeIcon: {
    color: theme.palette.secondary.main,
    position: 'absolute',
    right: '0.5rem',
    bottom: '0.5rem',
  },
  deleteIcon: {
    color: theme.palette.secondary.main,
  },
}))

export default useStyles
