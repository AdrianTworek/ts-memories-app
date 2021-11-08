import { FC, MutableRefObject, useRef, useState } from 'react'
import { useHistory } from 'react-router'
import { v4 as uuid } from 'uuid'
import { useDispatch, useSelector } from 'react-redux'
import {
  createUserCategory,
  deleteUserCategory,
  updateUserCategory,
} from '../../redux/slices/category'
import { hideDrawerActionCreator } from '../../redux/slices/drawer'
import { setLastChangedMemoryActionCreator } from '../../redux/slices/lastChangedMemory'
import { setPageActionCreator } from '../../redux/slices/page'
import { setCurrentCategoryActionCreator } from '../../redux/slices/selectedCategory'
import { getUserMemories } from '../../redux/slices/memory'
import { setMemoriesLoadingActionCreator } from '../../redux/slices/memoriesLoading'
import { CategoryState, DrawerState, SelectedCategoryState } from '../../type'
import useForm from '../../hooks/useForm'

import Input from '../controls/Input'
import Snackbar from '../Snackbar/Snackbar'
import { Spinner, DeleteDialog } from '..'

import {
  Box,
  Drawer,
  Divider,
  IconButton,
  Typography,
  Button,
} from '@material-ui/core'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import useStyles from './styles'

const initialFormData = {
  category: '',
}

const Sidebar: FC = () => {
  const [
    formData,
    setFormData,
    errors,
    setErrors,
    handleInputChange,
    resetForm,
  ] = useForm({
    initialState: initialFormData,
    validateOnChange: true,
    validate,
  })
  const categories = useSelector((state: CategoryState) => state.categories)
  const selectedCategory = useSelector(
    (state: SelectedCategoryState) => state.selectedCategory
  )
  const [editedCategory, setEditedCategory] = useState<string>('')
  const [currentCategory, setCurrentCategory] = useState<string>('')
  const limit = useSelector((state: { limit: number }) => state.limit)
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [snackbarMessage, setSnackbarMessage] = useState<string>('')
  const isDrawer = useSelector((state: DrawerState) => state.isDrawer)
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
  const [isSuccessSnackbar, setIsSuccessSnackbar] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const snackbarRef = useRef() as MutableRefObject<HTMLDivElement>
  const dispatch = useDispatch()
  const history = useHistory()
  const classes = useStyles()

  function validate(values = formData) {
    let currentErrors: any = { ...errors }

    if ('category' in values) {
      currentErrors.category = values.category
        ? ''
        : 'Please provide a category name'
      if (values.category.length > 50) {
        currentErrors.category = 'Category cannot have more than 50 characters'
      }
    }
    setErrors({ ...currentErrors })

    return currentErrors.category === '' ? true : false
  }

  const handleDialogOpen = (_id: string) => {
    setCurrentCategory(_id)
    setOpenDialog(true)
  }

  const handleDialogClose = () => {
    setOpenDialog(false)
  }

  const handleEdit = async (_id: string, name: string) => {
    setIsEdit(true)
    setEditedCategory(name)
    setFormData({ ...formData, category: name })
    setCurrentCategory(_id)
  }

  const handleCancel = () => {
    setIsEdit(false)
    resetForm()
  }

  const handleDelete = async () => {
    handleDialogClose()

    // Reset other snackbar if there is already
    if (openSnackbar) {
      setOpenSnackbar(false)
    }

    await setIsSuccessSnackbar(false)
    setOpenSnackbar(true)
    setLoading(true)
    await dispatch(deleteUserCategory(currentCategory))
    handleCancel()
    setLoading(false)
  }

  const handleClickCategory = async (category: string) => {
    if (category === selectedCategory) return

    dispatch(hideDrawerActionCreator())
    dispatch(setPageActionCreator(1))
    dispatch(setLastChangedMemoryActionCreator(''))
    window.scrollTo({ top: 0 })
    dispatch(setCurrentCategoryActionCreator(category))
    dispatch(setMemoriesLoadingActionCreator(true))
    await dispatch(getUserMemories({ limit, categoryName: category }))
    dispatch(setMemoriesLoadingActionCreator(false))
    history.push('/home')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (validate()) {
      setLoading(true)

      dispatch(setLastChangedMemoryActionCreator(''))

      // Reset other snackbar if there is already
      if (openSnackbar) {
        setOpenSnackbar(false)
      }

      if (isEdit) {
        if (editedCategory === formData.category) {
          setLoading(false)
          setIsEdit(false)
          resetForm()
          return
        }

        await dispatch(
          updateUserCategory({ _id: currentCategory, name: formData.category })
        )
        setIsEdit(false)
        setSnackbarMessage("You've just edited this category!")

        // Update selected category name in Select MUI component when user
        // edits the same category
        if (selectedCategory === editedCategory) {
          dispatch(setCurrentCategoryActionCreator(formData.category))
        }
      } else {
        await dispatch(createUserCategory(formData.category))
        setSnackbarMessage("You've just added this category!")
      }

      setLoading(false)

      setIsSuccessSnackbar(true)
      setOpenSnackbar(true)
      resetForm()
    }
  }

  return (
    <>
      <Drawer
        anchor="right"
        open={isDrawer}
        onClose={() => dispatch(hideDrawerActionCreator())}
      >
        <Box
          className={classes.sidebarContainer}
          role="presentation"
          sx={{ maxWidth: 340 }}
        >
          <Typography
            className={classes.sidebarTitle}
            variant="h4"
            align="center"
            gutterBottom
          >
            Create your own categories to store your memory cards
          </Typography>
          <Divider />
          <form
            className={classes.form}
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <Input
              name="category"
              label="Category name"
              type="text"
              variant="filled"
              value={formData.category || ''}
              onChange={handleInputChange}
              error={errors.category}
            />
            <Button
              className={classes.submitBtn}
              variant="contained"
              type="submit"
              size="medium"
            >
              {isEdit ? 'Edit Category' : 'Add category'}
            </Button>
            <br />
            {isEdit && (
              <Button
                variant="contained"
                type="submit"
                size="medium"
                color="secondary"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            )}
          </form>

          <IconButton
            className={classes.closeIcon}
            onClick={() => dispatch(hideDrawerActionCreator())}
          >
            <CloseIcon />
          </IconButton>

          {!loading ? (
            <>
              <Typography
                className={classes.categoriesTitle}
                variant="h5"
                align="center"
              >
                {categories.length > 0
                  ? 'Categories list'
                  : "You haven't added any category yet"}
              </Typography>
              <div className={classes.categoriesContainer} key={uuid()}>
                {categories.map((category) => (
                  <div className={classes.categoryItem} key={uuid()}>
                    <span
                      className={classes.categoryName}
                      onClick={() => handleClickCategory(category.name)}
                    >
                      {category.name}
                    </span>

                    <div>
                      <IconButton
                        onClick={() => handleEdit(category._id, category.name)}
                      >
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        onClick={() => handleDialogOpen(category._id)}
                      >
                        <DeleteIcon className={classes.deleteIcon} />
                      </IconButton>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <Spinner gutterTop="2rem" color="secondary" />
          )}

          {openSnackbar && (
            <Snackbar
              style={{ maxWidth: 300, marginLeft: 'auto' }}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              snackbarSuccessTitle={snackbarMessage}
              snackbarWarningTitle="You've removed this category!"
              openSnackbar={openSnackbar}
              setOpenSnackbar={setOpenSnackbar}
              severity={isSuccessSnackbar}
              ref={snackbarRef}
              duration={3000}
            />
          )}
        </Box>
      </Drawer>

      {openDialog && (
        <DeleteDialog
          dialogTitle="Are you sure you want to delete this category?"
          dialogContentText={`After deleting this category you will not be able to recover it.
        Click CANCEL if you've changed your mind or DELETE if you want
        to get rid of this category.`}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          handleDelete={handleDelete}
          itemToRemove={currentCategory}
        />
      )}
    </>
  )
}

export default Sidebar
