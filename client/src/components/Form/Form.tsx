import { FC, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createUserMemory, updateUserMemory } from '../../redux/slices/memory'
import { clearCurrentMemoryActionCreator } from '../../redux/slices/currentMemory'
import { incrementMemoriesNumberActionCreator } from '../../redux/slices/auth'
import { toggleCreateModeActionCreator } from '../../redux/slices/editMode'
import { setLastChangedMemoryActionCreator } from '../../redux/slices/lastChangedMemory'
import {
  CurrentMemoryState,
  FormModeState,
  MemoryFormData,
  ProfileState,
  SelectedCategoryState,
} from '../../type'

import { Input } from '../controls'

import Spinner from '../Spinner/Spinner'
import useForm from '../../hooks/useForm'

import { Button, Paper, Typography } from '@material-ui/core'
import { Stack } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import { styled } from '@material-ui/core'
import useStyles from './Form.styles'
import { getFavoriteMemories } from '../../redux/slices/favorites'

const initialFormData: MemoryFormData = {
  author: '',
  date: '',
  title: '',
  description: '',
  image: '',
}

const InputFile = styled('input')({
  display: 'none',
})

const Form: FC = () => {
  const profile = useSelector((state: ProfileState) => state.profile)
  const isEdit = useSelector((state: FormModeState) => state.isEdit)
  const currentMemory = useSelector(
    (state: CurrentMemoryState) => state.currentMemory
  )
  const selectedCategory = useSelector(
    (state: SelectedCategoryState) => state.selectedCategory
  )
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
  const [fileName, setFileName] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const dispatch = useDispatch()
  const fileInput = document.querySelector(
    'input[type=file]'
  ) as HTMLInputElement
  const classes = useStyles()

  useEffect(() => {
    // Fill the form with current memory's data
    setFormData({
      author: currentMemory.author,
      date: currentMemory.date,
      title: currentMemory.title,
      description: currentMemory.description,
      image: currentMemory.image,
    })

    // Reset file name
    if (currentMemory.image) {
      setFileName(currentMemory.image)
    }

    // Reset errors
    setErrors(initialFormData)
  }, [currentMemory])

  useEffect(() => {
    if (!isEdit) {
      setFileName('')
    }
  }, [selectedCategory])

  function validate(values = formData) {
    let currentErrors: any = { ...errors }

    if ('author' in values) {
      currentErrors.author = values.author ? '' : 'Please provide an author'
    }
    if ('title' in values) {
      currentErrors.title = values.title ? '' : 'Please provide a title'
      if (values.title && values.title.length > 50)
        currentErrors.title = 'Title cannot have more than 50 characters'
    }
    if ('description' in values) {
      currentErrors.description = values.description
        ? ''
        : 'Please provide a description'
      if (values.description && values.description.length > 200)
        currentErrors.description =
          'Description cannot have more than 200 characters'
    }
    if ('date' in values) {
      currentErrors.date = values.date
        ? ''
        : 'Please provide a date of your memory'
    }

    setErrors({ ...currentErrors })

    if (values === formData)
      return Object.values(currentErrors).every((el) => el === '')
  }

  const handleClear = () => {
    setFormData(initialFormData)
    setErrors(initialFormData)
    setFileName('')
  }

  const handleCancel = () => {
    // Fixes Snackbar bug
    dispatch(setLastChangedMemoryActionCreator(''))

    dispatch(clearCurrentMemoryActionCreator())
    dispatch(toggleCreateModeActionCreator())
    setErrors(initialFormData)
    setFileName('')
    fileInput.value = ''
  }

  const handleInputFile = (e: any) => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(e.target.files[0])
    setFileName(e.target.files[0].name)
    fileReader.onload = (e) => {
      setFormData({ ...formData, image: e?.target?.result })
    }
  }

  const handleClickInputFile = (e: any) => (e.target.value = null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    fileInput.value = ''

    if (validate()) {
      setLoading(true)
      dispatch(setLastChangedMemoryActionCreator(''))

      // Create memory
      if (!isEdit) {
        await dispatch(
          createUserMemory({ ...formData, user: profile.user._id })
        )
        dispatch(incrementMemoriesNumberActionCreator())
      } else {
        // If user didn't change anything then don't send requests
        // and clear the form
        if (
          formData.author === currentMemory.author &&
          formData.title === currentMemory.title &&
          formData.description === currentMemory.description &&
          formData.date === currentMemory.date &&
          formData.image === currentMemory.image
        ) {
          handleClear()
          dispatch(toggleCreateModeActionCreator())
          setLoading(false)
          return
        }

        // Update memory
        await dispatch(
          updateUserMemory({ ...formData, _id: currentMemory._id })
        )

        // Update favorites
        dispatch(getFavoriteMemories())

        // Reset form mode
        dispatch(clearCurrentMemoryActionCreator())
        dispatch(toggleCreateModeActionCreator())
      }

      handleClear()
      setLoading(false)
    }
  }

  return (
    <Paper className={classes.paper} elevation={3}>
      {loading ? (
        <div className={classes.spinnerContainer}>
          <Spinner />
        </div>
      ) : (
        <>
          <Typography className={classes.title}>
            {!isEdit ? 'Create a memory' : 'Edit a memory'}
          </Typography>
          <form
            className={classes.form}
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <Input
              name="author"
              label="Author"
              type="text"
              value={formData.author || ''}
              onChange={handleInputChange}
              error={errors.author}
            />
            <Input
              name="title"
              label="Title"
              type="text"
              value={formData.title || ''}
              onChange={handleInputChange}
              error={errors.title}
            />
            <Input
              name="description"
              label="Description"
              type="text"
              multiline={true}
              minRows={2}
              maxRows={2}
              value={formData.description || ''}
              onChange={handleInputChange}
              error={errors.description}
            />
            <Input
              name="date"
              label="Select date"
              type="date"
              value={formData.date || ''}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
              error={errors.date}
            />
            <Stack direction="row" alignItems="center" spacing={1}>
              <label htmlFor="outlined-button-file">
                <InputFile
                  accept="image/*"
                  id="outlined-button-file"
                  multiple={false}
                  type="file"
                  onChange={handleInputFile}
                  onClick={handleClickInputFile}
                />
                <Button
                  className={classes.uploadBtn}
                  variant="outlined"
                  component="span"
                  size="small"
                >
                  Upload
                </Button>
              </label>
              <label htmlFor="icon-button-file">
                <InputFile
                  accept="image/*"
                  id="icon-button-file"
                  multiple={false}
                  type="file"
                  onChange={handleInputFile}
                  onClick={handleClickInputFile}
                />
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                >
                  <PhotoCamera />
                </IconButton>
              </label>
              <Typography variant="body2" component="span">
                {fileName.length > 18
                  ? `${fileName.slice(0, 12)}...`
                  : fileName}
              </Typography>
            </Stack>
            <Button
              variant="contained"
              type="submit"
              size="medium"
              style={{ marginTop: '0.5rem' }}
              color="primary"
            >
              Submit
            </Button>

            {!isEdit ? (
              <Button
                variant="contained"
                size="small"
                color="secondary"
                onClick={handleClear}
              >
                Clear all fields
              </Button>
            ) : (
              <Button
                variant="contained"
                size="small"
                color="secondary"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            )}
          </form>
        </>
      )}
    </Paper>
  )
}

export default Form
