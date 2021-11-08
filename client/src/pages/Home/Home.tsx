import { FC, useState, useEffect, ChangeEvent } from 'react'
import { v4 as uuid } from 'uuid'
import { useHistory } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { getUserMemories } from '../../redux/slices/memory'
import { getFavoriteMemories } from '../../redux/slices/favorites'
import { getUserCategories } from '../../redux/slices/category'
import { setCurrentCategoryActionCreator } from '../../redux/slices/selectedCategory'
import { setPageActionCreator } from '../../redux/slices/page'
import { setLimitActionCreator } from '../../redux/slices/limit'
import { setLastChangedMemoryActionCreator } from '../../redux/slices/lastChangedMemory'
import { toggleCreateModeActionCreator } from '../../redux/slices/editMode'
import { setMemoriesLoadingActionCreator } from '../../redux/slices/memoriesLoading'
import {
  CategoryState,
  FormModeState,
  MemoriesLoadingState,
  MemoryState,
  ProfileState,
  SelectedCategoryState,
} from '../../type'

import { Form, MemoriesList, Spinner } from '../../components'

import {
  Container,
  Button,
  Typography,
  Grow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core'
import { Pagination } from '@material-ui/lab'
import useStyles from './styles'
import { setCurrentMemoryActionCreator } from '../../redux/slices/currentMemory'

const initialFormData = {
  author: '',
  date: '',
  title: '',
  description: '',
  image: '',
}

const Home: FC = () => {
  const profile = useSelector((state: ProfileState) => state.profile)
  const memories = useSelector((state: MemoryState) => state.memories)
  const memoriesLoading = useSelector(
    (state: MemoriesLoadingState) => state.memoriesLoading
  )
  const categories = useSelector((state: CategoryState) => state.categories)
  const selectedCategory = useSelector(
    (state: SelectedCategoryState) => state.selectedCategory
  )
  const isEdit = useSelector((state: FormModeState) => state.isEdit)
  const page = useSelector((state: { page: number }) => state.page)
  const limit = useSelector((state: { limit: number }) => state.limit)
  const [count, setCount] = useState(1)
  const dispatch = useDispatch()
  const history = useHistory()
  const classes = useStyles()

  useEffect(() => {
    // Deny access to not logged in user
    if (!profile.token) {
      return history.push('/')
    }

    // Fetch memories and favorites
    ;(async () => {
      dispatch(setMemoriesLoadingActionCreator(true))

      if (!memories.length) {
        await dispatch(
          getUserMemories({ page, limit, categoryName: selectedCategory })
        )

        await dispatch(getFavoriteMemories())
        await dispatch(getUserCategories())
      }

      dispatch(setMemoriesLoadingActionCreator(false))
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      dispatch(setLastChangedMemoryActionCreator(''))

      // Set pagination count
      if (profile?.user?.memoriesNumber && profile?.user?.memoriesNumber > 0) {
        setCount(Math.ceil(profile.user.memoriesNumber / limit))
      }

      // Fetch memories from the previous page if user deletes
      // the last memory on the current page
      if (!memories.length && page > 1) {
        dispatch(setMemoriesLoadingActionCreator(true))
        dispatch(setPageActionCreator(page - 1))
        await dispatch(
          getUserMemories({
            page: page - 1,
            limit,
            categoryName: selectedCategory,
          })
        )
        dispatch(setMemoriesLoadingActionCreator(false))
      }

      // Set pagination when there is selected a category
      if (selectedCategory && selectedCategory !== 'all') {
        let memoriesNum: number = 0

        categories.forEach((el) => {
          if (el.name === selectedCategory) memoriesNum += el.memories.length
        })

        setCount(Math.ceil(memoriesNum / limit))
      }
    })()
  }, [profile.user.memoriesNumber, limit, selectedCategory])

  useEffect(() => {
    ;(async () => {
      // Set pagination when there is selected a category
      if (selectedCategory && selectedCategory !== 'all') {
        let memoriesNum: number = 0

        // If user deleted a current category then fetch all memories
        const category = categories.find((el) => el.name === selectedCategory)
        if (!category) {
          dispatch(setCurrentCategoryActionCreator('all'))
          dispatch(setMemoriesLoadingActionCreator(true))
          await dispatch(
            getUserMemories({ page: 1, limit, categoryName: 'all' })
          )
          dispatch(setMemoriesLoadingActionCreator(false))
          return
        }

        categories.forEach((el) => {
          if (el.name === selectedCategory) memoriesNum += el.memories.length
        })

        setCount(Math.ceil(memoriesNum / limit))
      }
    })()
  }, [categories])

  const handleSelectCategory = async (e: ChangeEvent<any>) => {
    dispatch(setPageActionCreator(1))
    dispatch(setLastChangedMemoryActionCreator(''))
    window.scrollTo({ top: 0 })

    if (isEdit) {
      dispatch(toggleCreateModeActionCreator())
      dispatch(setCurrentMemoryActionCreator(initialFormData))
    }

    const category = e.target.value
    dispatch(setCurrentCategoryActionCreator(category))

    dispatch(setMemoriesLoadingActionCreator(true))
    await dispatch(getUserMemories({ limit, categoryName: category }))
    dispatch(setMemoriesLoadingActionCreator(false))
  }

  const handleLimit = async (e: ChangeEvent<any>) => {
    const { value } = e.target
    window.scrollTo({ top: 0 })

    dispatch(setMemoriesLoadingActionCreator(true))

    // Show all memories
    if (value === 10) {
      dispatch(setPageActionCreator(1))
      dispatch(setLimitActionCreator(10))
      await dispatch(
        getUserMemories({ page: 1, limit: 10, categoryName: selectedCategory })
      )
    } else {
      // Show limited number of memories
      dispatch(setLimitActionCreator(value))
      await dispatch(
        getUserMemories({
          page,
          limit: value,
          categoryName: selectedCategory,
        })
      )
    }

    dispatch(setMemoriesLoadingActionCreator(false))
  }

  const handlePagination = async (e: ChangeEvent<any>, value: number) => {
    dispatch(setLastChangedMemoryActionCreator(''))
    window.scrollTo({ top: 0 })
    dispatch(setMemoriesLoadingActionCreator(true))

    dispatch(setPageActionCreator(value))
    await dispatch(
      getUserMemories({
        page: value,
        limit,
        categoryName: selectedCategory,
      })
    )
    dispatch(setMemoriesLoadingActionCreator(false))
  }

  const handlePreviousPage = async (beginning?: boolean) => {
    dispatch(setMemoriesLoadingActionCreator(true))

    if (beginning) {
      dispatch(setPageActionCreator(1))
      await dispatch(
        getUserMemories({ page: 1, limit, categoryName: selectedCategory })
      )
    } else {
      dispatch(setPageActionCreator(page - 1))
      if (page - 1 > 1) {
        await dispatch(
          getUserMemories({
            page: page - 1,
            limit,
            categoryName: selectedCategory,
          })
        )
      } else {
        await dispatch(
          getUserMemories({ page: 1, limit, categoryName: selectedCategory })
        )
      }
    }

    dispatch(setMemoriesLoadingActionCreator(false))
  }

  return (
    <>
      {profile && !profile?.error && (
        <Grow in>
          <Container className={classes.container} maxWidth="lg">
            <Form />

            {/* MEMORIES LIST */}
            {memoriesLoading ? (
              <Spinner color="secondary" />
            ) : (
              <>
                {memories.length > 0 && (
                  <div className={classes.memoriesContainer}>
                    <div className={classes.selectContainer}>
                      <FormControl style={{ width: 120 }}>
                        <InputLabel id="select-autowidth-label">
                          Category
                        </InputLabel>
                        <Select
                          labelId="select-autowidth-label"
                          id="select-autowidth"
                          value={selectedCategory}
                          autoWidth
                          label="Category"
                          onChange={handleSelectCategory}
                        >
                          <MenuItem value="all">
                            <em>All</em>
                          </MenuItem>
                          {categories.map((category) => (
                            <MenuItem value={category.name} key={uuid()}>
                              {category.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>

                    <MemoriesList limit={limit} page={page} />

                    <div className={classes.limitContainer}>
                      <FormControl className={classes.limitLabel}>
                        <InputLabel id="limit-label">Cards per page</InputLabel>
                        <Select
                          labelId="limit-label"
                          id="limit"
                          value={limit}
                          label="Limit"
                          onChange={handleLimit}
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((el) => (
                            <MenuItem key={uuid()} value={el}>
                              {el === 10 ? 'Show All' : el}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                    <Pagination
                      className={classes.pagination}
                      variant="outlined"
                      color="secondary"
                      count={count}
                      size="medium"
                      page={page}
                      // Disable pagination when "Show All" has been clicked
                      disabled={limit === 10}
                      onChange={handlePagination}
                    />
                  </div>
                )}
              </>
            )}

            {/* NO MEMORIES FALLBACK*/}
            {!memories.length && !memoriesLoading && (
              <div>
                {selectedCategory && selectedCategory !== 'all' && (
                  <div className={classes.emptyCategoryContainer}>
                    <Typography className={classes.infoTitle} variant="h5">
                      You haven't added any memories in this category page (
                      {page})
                    </Typography>
                    {page === 1 && (
                      <Button
                        style={{ maxWidth: 100 }}
                        variant="outlined"
                        color="secondary"
                        onClick={async () => {
                          dispatch(setMemoriesLoadingActionCreator(true))

                          dispatch(setCurrentCategoryActionCreator('all'))
                          await dispatch(getUserMemories({ limit }))
                          dispatch(setMemoriesLoadingActionCreator(false))
                        }}
                      >
                        Go Back
                      </Button>
                    )}
                  </div>
                )}

                {selectedCategory === 'all' && !memories.length && (
                  <Typography className={classes.infoTitle} variant="h5">
                    You haven't added any memories on this page ({page})
                  </Typography>
                )}

                {page > 1 && (
                  <div className={classes.paginationButtonsContainer}>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => handlePreviousPage()}
                    >
                      Previous page
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={() => handlePreviousPage(true)}
                    >
                      Go to the beginning
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Container>
        </Grow>
      )}
    </>
  )
}

export default Home
