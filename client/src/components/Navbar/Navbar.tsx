import { FC, useState, useEffect } from 'react'
import decode from 'jwt-decode'
import { useHistory, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  getProfile,
  logoutUserActionCreator,
  setUserActionCreator,
} from '../../redux/slices/auth'
import {
  toggleSignUpActionCreator,
  toggleSignInActionCreator,
} from '../../redux/slices/signupMode'
import { clearMemoriesActionCreator } from '../../redux/slices/memory'
import { clearFavoritesActionCreator } from '../../redux/slices/favorites'
import { clearCategoriesActionCreator } from '../../redux/slices/category'
import { clearCurrentMemoryActionCreator } from '../../redux/slices/currentMemory'
import { setCurrentCategoryActionCreator } from '../../redux/slices/selectedCategory'
import { toggleCreateModeActionCreator } from '../../redux/slices/editMode'
import { showDrawerActionCreator } from '../../redux/slices/drawer'
import { setLastChangedMemoryActionCreator } from '../../redux/slices/lastChangedMemory'

import { DrawerState, ProfileState, SelectedCategoryState } from '../../type'

import { Sidebar } from '../../components'

import {
  AppBar,
  Menu,
  MenuItem,
  Avatar,
  Container,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Hidden,
  Divider,
} from '@material-ui/core'
import PeopleAltIcon from '@material-ui/icons/PeopleAlt'
import MenuIcon from '@material-ui/icons/Menu'
import GradeIcon from '@mui/icons-material/Grade'
import CategoryIcon from '@mui/icons-material/Category'
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew'
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary'
import useStyles from './styles'
import { setPageActionCreator } from '../../redux/slices/page'

const Navbar: FC = () => {
  const profile = useSelector((state: ProfileState) => state.profile)
  const selectedCategory = useSelector(
    (state: SelectedCategoryState) => state.selectedCategory
  )
  const isDrawer = useSelector((state: DrawerState) => state.isDrawer)
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()
  const classes = useStyles()

  useEffect(() => {
    ;(async () => {
      const token = profile?.token

      if (token) {
        const decoded: any = decode(token)

        // Logout user if his token has expired
        if (decoded.exp * 1000 < new Date().getTime()) return logout()

        await dispatch(getProfile(null))
        dispatch(setUserActionCreator())
      }

      dispatch(setLastChangedMemoryActionCreator(''))
    })()
  }, [location])

  const handleMenu = (e: any) => setAnchorEl(e.currentTarget)

  const handleClose = () => setAnchorEl(null)

  const logout = () => {
    localStorage.removeItem('profile')
    dispatch(clearMemoriesActionCreator())
    dispatch(clearFavoritesActionCreator())
    dispatch(clearCategoriesActionCreator())
    dispatch(setCurrentCategoryActionCreator('all'))
    dispatch(setLastChangedMemoryActionCreator(''))
    dispatch(clearCurrentMemoryActionCreator())
    dispatch(toggleCreateModeActionCreator())
    dispatch(setPageActionCreator(1))
    dispatch(logoutUserActionCreator())
    history.push('/')
  }

  return (
    <>
      <AppBar className={classes.appBar} position="static">
        <Container maxWidth="lg">
          <Toolbar>
            <PeopleAltIcon className={classes.logo} />
            <Typography className={classes.title} variant="h5">
              Memories
            </Typography>
            {profile?.token ? (
              <>
                <IconButton aria-label="menu" onClick={handleMenu}>
                  <Avatar className={classes.avatar}>
                    <Typography
                      className={classes.avatarLetter}
                      variant="subtitle1"
                    >
                      {profile?.user?.firstName.charAt(0)}
                    </Typography>
                  </Avatar>
                </IconButton>
                <Menu
                  className={classes.menu}
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  keepMounted
                  open={open}
                  onClose={handleClose}
                >
                  <MenuItem
                    onClick={() => {
                      handleClose()
                      dispatch(setLastChangedMemoryActionCreator(''))
                      history.push('/home')
                    }}
                  >
                    <PhotoLibraryIcon />
                    Memories
                  </MenuItem>
                  <MenuItem
                    disabled={selectedCategory !== 'all'}
                    onClick={() => {
                      handleClose()
                      dispatch(clearCurrentMemoryActionCreator())
                      dispatch(toggleCreateModeActionCreator())
                      // Reset category to display all favorite memories
                      // and not only from particular category (fixed bug)
                      dispatch(setCurrentCategoryActionCreator('all'))
                      dispatch(setLastChangedMemoryActionCreator(''))
                      history.push('/favorites')
                    }}
                  >
                    <GradeIcon />
                    Favorites
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleClose()
                      dispatch(showDrawerActionCreator())
                    }}
                  >
                    <CategoryIcon />
                    Categories
                  </MenuItem>
                  <Divider style={{ marginBottom: '0.5rem' }} />
                  <MenuItem
                    onClick={() => {
                      logout()
                      handleClose()
                    }}
                  >
                    <PowerSettingsNewIcon />
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <div className={classes.buttonsContainer}>
                <Hidden xsDown>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      dispatch(toggleSignInActionCreator())
                      history.push('/auth')
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      dispatch(toggleSignUpActionCreator())
                      history.push('/auth')
                    }}
                  >
                    Sign Up
                  </Button>
                </Hidden>
                <Hidden smUp>
                  <IconButton
                    className={classes.hamburgerIcon}
                    edge="end"
                    color="secondary"
                    aria-label="menu"
                    onClick={handleMenu}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    keepMounted
                    open={open}
                    onClose={handleClose}
                  >
                    <MenuItem
                      onClick={() => {
                        dispatch(toggleSignInActionCreator())
                        handleClose()
                        history.push('/auth')
                      }}
                    >
                      Sign In
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        dispatch(toggleSignUpActionCreator())
                        handleClose()
                        history.push('/auth')
                      }}
                    >
                      Sign Up
                    </MenuItem>
                  </Menu>
                </Hidden>
              </div>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {isDrawer && <Sidebar />}
    </>
  )
}

export default Navbar
