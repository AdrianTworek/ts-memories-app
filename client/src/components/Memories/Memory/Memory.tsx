import {
  FC,
  useState,
  useRef,
  forwardRef,
  MutableRefObject,
  useEffect,
} from 'react'
import { v4 as uuid } from 'uuid'
import { useHistory } from 'react-router'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import {
  deleteMemoryActionCreator,
  deleteUserMemory,
  getUserMemories,
} from '../../../redux/slices/memory'
import { setMemoriesLoadingActionCreator } from '../../../redux/slices/memoriesLoading'
import { setLastChangedMemoryActionCreator } from '../../../redux/slices/lastChangedMemory'
import {
  toggleCreateModeActionCreator,
  toggleEditModeActionCreator,
} from '../../../redux/slices/editMode'
import {
  clearCurrentMemoryActionCreator,
  setCurrentMemoryActionCreator,
} from '../../../redux/slices/currentMemory'
import {
  addMemoryToFavorites,
  deleteFromFavoritesActionCreator,
  removeFavoriteMemory,
} from '../../../redux/slices/favorites'
import { decrementMemoriesNumberActionCreator } from '../../../redux/slices/auth'
import {
  addUserMemoryToCategory,
  getUserCategories,
  removeUserMemoryFromCategory,
} from '../../../redux/slices/category'
import { showDrawerActionCreator } from '../../../redux/slices/drawer'
import {
  Category,
  CategoryState,
  CurrentMemoryState,
  FavoritesState,
  MemoryState,
  SelectedCategoryState,
} from '../../../type'

import DeleteDialog from '../../DeleteDialog/DeleteDialog'
import Snackbar from '../../Snackbar/Snackbar'
import { Spinner } from '../..'

import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Modal,
  Typography,
  IconButton,
  Tooltip,
  Avatar,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from '@material-ui/core'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import { AddRounded } from '@material-ui/icons'
import HeightIcon from '@mui/icons-material/Height'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'
import CloseIcon from '@mui/icons-material/Close'
import AspectRatioIcon from '@mui/icons-material/AspectRatio'
import FavoriteIcon from '@material-ui/icons/Favorite'
import ImportContactsIcon from '@mui/icons-material/ImportContacts'
import RemoveIcon from '@mui/icons-material/Remove'
import useStyles from './styles'

interface Props {
  _id: string
  author: string
  createdAt?: number
  date: string
  title: string
  description: string
  image?: string
  overviewPage?: boolean
  style?: {}
  ref?: MutableRefObject<HTMLDivElement>
  favoritesPage?: boolean
}

interface Props {
  ref?: MutableRefObject<HTMLDivElement>
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

// @ts-ignore
const Memory: FC<Props> = forwardRef(
  (
    {
      _id,
      style,
      author,
      createdAt,
      date,
      title,
      description,
      image,
      overviewPage,
      favoritesPage,
    },
    ref
  ) => {
    const memories = useSelector((state: MemoryState) => state.memories)
    const currentMemory = useSelector(
      (state: CurrentMemoryState) => state.currentMemory
    )
    const lastChangedMemory = useSelector(
      (state: { lastChangedMemory: string }) => state.lastChangedMemory
    )
    const favorites = useSelector((state: FavoritesState) => state.favorites)
    const categories = useSelector((state: CategoryState) => state.categories)
    const selectedCategory = useSelector(
      (state: SelectedCategoryState) => state.selectedCategory
    )
    const page = useSelector((state: { page: number }) => state.page)
    const limit = useSelector((state: { limit: number }) => state.limit)
    const [imageModal, setImageModal] = useState<{
      image: string | undefined
      show: boolean
      isVertical: boolean
    }>({
      image: '' || undefined,
      show: false,
      isVertical: false,
    })
    const [openDialog, setOpenDialog] = useState<boolean>(false)
    const [openCategoryDialog, setOpenCategoryDialog] = useState<boolean>(false)
    const [isFavorite, setIsFavorite] = useState<boolean>(() => {
      // Check if the memory is currently in favorites section
      // If yes, then card's Heart icon will be filled
      return Boolean(favorites.find((el) => el?._id === _id))
    })
    // Array of categories which the memory belongs to
    const [categoriesMembership, setCategoriesMembership] = useState<string[]>(
      []
    )
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [openTooltip, setOpenTooltip] = useState<boolean>(false)
    const snackbarRef = useRef() as MutableRefObject<HTMLDivElement>
    const [loading, setLoading] = useState<boolean>(false)
    const [categoryLoading, setCategoryLoading] = useState<boolean>(false)
    const [showMemory, setShowMemory] = useState<boolean>(true)
    const dispatch = useDispatch()
    const history = useHistory()
    const classes = useStyles()

    // It fixes the disappearing snackbar bug
    useEffect(() => {
      if (lastChangedMemory === _id) {
        setOpenSnackbar(true)
      }
    }, [isFavorite])

    // This effect prevents from displaying memory which does not
    // belong to the current category
    useEffect(() => {
      const category = categories.find((el) => el.name === selectedCategory)
      if (category) {
        const belongsToCurrentCategory = category.memories.find(
          (memory) => memory._id === _id
        )

        belongsToCurrentCategory ? setShowMemory(true) : setShowMemory(false)
      }
    }, [memories])

    useEffect(() => {
      ;(() => {
        const categoryNames: string[] = []
        categories.forEach((el) => {
          el.memories.forEach((memory) => {
            if (memory._id === _id) categoryNames.push(el.name)
          })
        })

        setCategoriesMembership(categoryNames)
      })()
    }, [categories])

    const handleDialogOpen = () => setOpenDialog(true)

    const handleCloseImageModal = () =>
      setImageModal({ image: undefined, show: false, isVertical: false })

    const handleFavorites = async () => {
      setLoading(true)
      setOpenTooltip(false)
      dispatch(setLastChangedMemoryActionCreator(_id))

      // Reset other snackbar if there is
      if (openSnackbar) {
        setOpenSnackbar(false)
      }

      if (isFavorite) {
        await dispatch(removeFavoriteMemory(_id))
        setIsFavorite(false)
      } else {
        await dispatch(addMemoryToFavorites(_id))
        setIsFavorite(true)
      }

      setLoading(false)
    }

    const handleEdit = () => {
      if (favoritesPage) {
        history.push('/home')
        // Set position at the top to provide a better user experience
        window.scrollTo(0, 0)
      } else {
        // Scroll smoothly when user clicks edit button from
        // the page other than favorites
        document.body.scrollIntoView({ behavior: 'smooth' })
      }

      // It fixes the bug displaying adding/removing Snackbar
      // after clicking edit button
      dispatch(setLastChangedMemoryActionCreator(''))

      dispatch(toggleEditModeActionCreator())
      dispatch(
        setCurrentMemoryActionCreator({
          _id,
          author,
          date,
          title,
          description,
          image,
        })
      )
    }

    const handleDelete = async (_id: any) => {
      setOpenDialog(false)
      await dispatch(deleteUserMemory(_id))
      dispatch(deleteMemoryActionCreator(_id))

      // Reset form fields and change the form mode if deleted
      // memory was in editing mode
      if (currentMemory._id === _id) {
        dispatch(clearCurrentMemoryActionCreator())
        dispatch(toggleCreateModeActionCreator())
      }

      dispatch(deleteFromFavoritesActionCreator(_id))
      dispatch(decrementMemoriesNumberActionCreator())
      dispatch(getUserCategories())
      dispatch(getUserMemories({ page, limit, categoryName: selectedCategory }))
    }

    const handleAddToCategory = async (categoryId: string) => {
      setCategoryLoading(true)
      dispatch(setLastChangedMemoryActionCreator(''))
      await dispatch(addUserMemoryToCategory({ _id, categoryId }))
      setCategoryLoading(false)

      // Closes the dialog also on the favorites page
      setOpenCategoryDialog(false)
    }

    const handleRemoveFromCategory = async (
      categoryId: string,
      categoryName: string
    ) => {
      setCategoryLoading(true)
      dispatch(setLastChangedMemoryActionCreator(''))
      await dispatch(removeUserMemoryFromCategory({ _id, categoryId }))

      // When user removes a memory in its own category then it
      // deletes that memory from redux state to visually filter
      // the current page
      if (selectedCategory === categoryName) {
        dispatch(deleteMemoryActionCreator(_id))
      }
      // Close the dialog also on the favorites page
      setOpenCategoryDialog(false)
      setCategoryLoading(false)

      // Update memories
      if (selectedCategory !== 'all') {
        dispatch(setMemoriesLoadingActionCreator(true))
        await dispatch(
          getUserMemories({ page, limit, categoryName: selectedCategory })
        )
        dispatch(setMemoriesLoadingActionCreator(false))
      }
    }

    return (
      <>
        {showMemory && (
          <>
            <Card style={style} className={classes.card} ref={ref}>
              <CardMedia
                className={classes.media}
                image={image || './default-empty-image.png'}
              />
              <div className={classes.mediaOverlay}>
                <Tooltip title="Show bigger image" arrow>
                  <AspectRatioIcon
                    className={classes.imageModalIcon}
                    onClick={() =>
                      setImageModal({ image, show: true, isVertical: false })
                    }
                  />
                </Tooltip>
                <Typography
                  className={classes.author}
                  variant="h6"
                  component="div"
                >
                  {author}
                </Typography>
                <Typography className={classes.timestamp} component="span">
                  {moment(createdAt).fromNow()}
                </Typography>
              </div>
              <CardContent className={classes.cardContent}>
                <div className={classes.dateContainer}>
                  <CalendarTodayIcon className={classes.calendarIcon} />
                  <Typography className={classes.date}>{date}</Typography>
                </div>
                <Typography className={classes.title} variant="h6">
                  {title}
                </Typography>
                <Typography className={classes.description} variant="body2">
                  {description}
                </Typography>
              </CardContent>
              <CardActions className={classes.footer}>
                <Button
                  size="small"
                  color="primary"
                  disabled={overviewPage}
                  onClick={handleEdit}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="secondary"
                  disabled={overviewPage}
                  onClick={handleDialogOpen}
                >
                  Delete
                </Button>
                {!overviewPage && (
                  <>
                    <Tooltip title="Add to a category" arrow>
                      <IconButton
                        onClick={() => setOpenCategoryDialog(true)}
                        disabled={overviewPage}
                      >
                        <AddRounded />
                      </IconButton>
                    </Tooltip>
                    <Tooltip
                      title={
                        isFavorite
                          ? 'Remove from favorites'
                          : 'Add to favorites'
                      }
                      open={openTooltip}
                      onOpen={() => setOpenTooltip(true)}
                      onClose={() => setOpenTooltip(false)}
                      arrow
                    >
                      <IconButton
                        disabled={loading || overviewPage}
                        onClick={handleFavorites}
                      >
                        {loading ? (
                          <Spinner size={20} />
                        ) : (
                          <FavoriteIcon
                            fontSize="small"
                            color={isFavorite ? 'secondary' : 'inherit'}
                          />
                        )}
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </CardActions>
            </Card>

            {/* Image modal showing bigger image */}
            {imageModal.show && (
              <Modal
                className={classes.imageModalContainer}
                open={imageModal.show}
                onClose={handleCloseImageModal}
              >
                <div className={classes.imageWrapper}>
                  <CardMedia
                    className={
                      imageModal.isVertical
                        ? classes.imageModalVertical
                        : classes.imageModal
                    }
                    image={image || './default-empty-image.png'}
                  />
                  <Tooltip
                    title={
                      imageModal.isVertical
                        ? 'Switch to the horizontal view'
                        : 'Switch to the vertical view'
                    }
                    arrow
                  >
                    <IconButton
                      className={classes.imageModalVerticalIcon}
                      onClick={() =>
                        setImageModal({
                          ...imageModal,
                          isVertical: !imageModal.isVertical,
                        })
                      }
                    >
                      {imageModal.isVertical ? (
                        <ArrowRightAltIcon />
                      ) : (
                        <HeightIcon />
                      )}
                    </IconButton>
                  </Tooltip>
                  <IconButton
                    className={classes.imageModalCloseIcon}
                    onClick={handleCloseImageModal}
                  >
                    <CloseIcon />
                  </IconButton>
                </div>
              </Modal>
            )}

            {/* Adding / removing snackbar */}
            {openSnackbar && (
              <Snackbar
                openSnackbar={openSnackbar}
                setOpenSnackbar={setOpenSnackbar}
                snackbarSuccessTitle="You've added this memory to the favorites!"
                snackbarWarningTitle="You've removed this memory from the favorites!"
                severity={isFavorite}
                ref={snackbarRef}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                duration={3000}
              />
            )}

            {/* Delete dialog showing after clicking delete button */}
            {openDialog && (
              <DeleteDialog
                dialogTitle="Are you sure you want to delete this memory?"
                dialogContentText={`After deleting this memory you will not be able to recover it.
            Click CANCEL if you've changed your mind or DELETE if you want
            to get rid of this memory.`}
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                handleDelete={handleDelete}
                itemToRemove={_id}
              />
            )}

            {/* Category dialog showing after clicking "plus" icon */}
            {openCategoryDialog && (
              <Dialog
                open={openCategoryDialog}
                onClose={() => setOpenCategoryDialog(false)}
              >
                {categoryLoading ? (
                  <Spinner
                    gutterTop="2.3rem"
                    size={27}
                    color="secondary"
                    thickness={3}
                  />
                ) : (
                  <DialogTitle>Select category</DialogTitle>
                )}
                <List className={classes.categoryDialogList}>
                  {categories.map((category: Category) => (
                    <ListItem key={uuid()}>
                      <ImportContactsIcon style={{ marginRight: '0.5rem' }} />
                      <ListItemText primary={category.name} />

                      {categoriesMembership.includes(category.name) ? (
                        <IconButton
                          className={classes.deleteIcon}
                          disabled={categoryLoading}
                          onClick={() =>
                            handleRemoveFromCategory(
                              category._id,
                              category.name
                            )
                          }
                        >
                          <RemoveIcon />
                        </IconButton>
                      ) : (
                        <IconButton
                          className={classes.addIcon}
                          disabled={categoryLoading}
                          onClick={() => handleAddToCategory(category._id)}
                        >
                          <AddRounded />
                        </IconButton>
                      )}
                    </ListItem>
                  ))}
                  <Divider />
                  <ListItem
                    autoFocus
                    button
                    onClick={() => {
                      dispatch(showDrawerActionCreator())
                      setOpenCategoryDialog(false)
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <AddRounded />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Add category" />
                  </ListItem>
                </List>
              </Dialog>
            )}
          </>
        )}
      </>
    )
  }
)

export default Memory
