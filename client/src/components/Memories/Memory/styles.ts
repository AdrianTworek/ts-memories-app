import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  card: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 12,
    height: 360,
    boxShadow: '0 3px 6px 3px rgba(0, 0, 0, 0.15)',
    transition: 'transform 250ms ease-out',
    '&:hover': {
      transform: 'scale(1.02)',
    },
    [theme.breakpoints.down('sm')]: {
      width: 250,
      maxWidth: '100%',
    },
    [theme.breakpoints.up('sm')]: {
      flex: '0 0 250px',
    },
    [theme.breakpoints.up('md')]: {
      flex: '0 0 255px',
      height: 365,
    },
    [theme.breakpoints.up('lg')]: {
      flex: '0 0 265px',
    },
  },
  media: {
    paddingTop: '56.25%',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    backgroundBlendMode: 'darken',
  },
  imageModalContainer: {
    position: 'relative',
    display: 'grid',
    placeItems: 'center',
    outline: 'none',
    height: '100vh',
  },
  imageModal: {
    width: '90vw',
    minWidth: 300,
    borderRadius: 5,
    outline: '2px solid #fefefe',
    [theme.breakpoints.down('sm')]: {
      maxWidth: 350,
      height: 270,
    },
    [theme.breakpoints.up('sm')]: {
      maxWidth: 550,
      height: 450,
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: 700,
      height: 550,
    },
    [theme.breakpoints.up('lg')]: {
      maxWidth: 900,
      height: 650,
    },
  },
  imageModalVertical: {
    width: '90vw',
    minWidth: 300,
    aspectRatio: '1 / 1',
    borderRadius: 5,
    outline: '2px solid #fefefe',
    [theme.breakpoints.down('sm')]: {
      maxWidth: 300,
      height: '80vh',
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: 350,
      height: '85vh',
    },
    [theme.breakpoints.up('lg')]: {
      maxWidth: 400,
      height: '90vh',
    },
  },
  imageWrapper: {
    position: 'absolute',
  },
  imageModalVerticalIcon: {
    position: 'absolute',
    right: 60,
    top: 12,
    width: 40,
    height: 40,
    backgroundColor: '#555',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#555',
    },
  },
  imageModalCloseIcon: {
    position: 'absolute',
    right: 15,
    top: 12,
    width: 40,
    height: 40,
    backgroundColor: '#555',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#555',
    },
  },
  imageModalIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
    color: '#fff',
    cursor: 'pointer',
  },
  mediaOverlay: {
    position: 'absolute',
    top: 15,
    left: 20,
  },
  author: {
    fontWeight: 300,
    color: 'white',
    fontSize: '1.6rem',
    width: 218,
    height: '100%',
    overflow: 'scroll',
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  timestamp: {
    fontSize: '0.75rem',
    display: 'inline-block',
    color: 'white',
    opacity: '0.7',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: '2px 4px',
    transform: 'translateY(-3px)',
  },
  dateContainer: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  date: {
    fontSize: '0.8rem',
    fontWeight: 300,
  },
  calendarIcon: {
    width: 15,
    height: 15,
  },
  addIcon: {
    color: theme.palette.primary.main,
    marginLeft: '1rem',
  },
  deleteIcon: {
    color: theme.palette.secondary.main,
    marginLeft: '1rem',
  },
  title: {
    width: 218,
    height: 35,
    overflowX: 'scroll',
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  description: {
    color: '#777',
    height: 72,
    overflow: 'scroll',
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  footer: {
    '& .MuiIconButton-root': {
      marginLeft: 'auto',
    },
  },
  categoryDialogList: {
    minWidth: 200,
  },
}))

export default useStyles
