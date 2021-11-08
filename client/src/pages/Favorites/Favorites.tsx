import { FC, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { v4 as uuid } from 'uuid'
import {
  FavoritesState,
  MemoriesLoadingState,
  ProfileState,
  SelectedCategoryState,
} from '../../type'

import Memory from '../../components/Memories/Memory/Memory'
import { Spinner } from '../../components'

import {
  Container,
  Grow,
  Typography,
  Button,
  Box,
  LinearProgress,
} from '@material-ui/core'
import useStyles from './styles'
import { useHistory } from 'react-router'
import { getFavoriteMemories } from '../../redux/slices/favorites'
import { setLastChangedMemoryActionCreator } from '../../redux/slices/lastChangedMemory'

const Favorites: FC = () => {
  const favorites = useSelector((state: FavoritesState) => state.favorites)
  const profile = useSelector((state: ProfileState) => state.profile)
  const memoriesLoading = useSelector(
    (state: MemoriesLoadingState) => state.memoriesLoading
  )
  const selectedCategory = useSelector(
    (state: SelectedCategoryState) => state.selectedCategory
  )
  const [loading, setLoading] = useState<boolean>(false)
  const dispatch = useDispatch()
  const history = useHistory()
  const classes = useStyles()

  useEffect(() => {
    // Deny access to not logged in user
    if (!profile.token) {
      return history.push('/')
    }

    ;(async () => {
      if (!favorites.length) {
        setLoading(true)
        await dispatch(getFavoriteMemories())
        setLoading(false)
      }
    })()
  }, [])

  return (
    <Grow in>
      <Container className={classes.container} maxWidth="xl">
        {memoriesLoading ? (
          <Box style={{ width: '50%', marginTop: '40vh' }}>
            <Typography variant="h6" align="center" gutterBottom>
              Loading "{selectedCategory}"...
            </Typography>
            <LinearProgress />
          </Box>
        ) : (
          <>
            {loading ? (
              <Spinner />
            ) : (
              <>
                <Button
                  onClick={() => {
                    dispatch(setLastChangedMemoryActionCreator(''))
                    history.push('/home')
                  }}
                  variant="contained"
                  color="primary"
                >
                  Home Page
                </Button>
                {favorites.length > 0 && (
                  <Typography className={classes.infoTitle}>
                    Your favorite memories
                  </Typography>
                )}

                <div className={classes.memoriesContainer}>
                  {favorites.length > 0 ? (
                    <>
                      {favorites.map((memory) => (
                        <Memory
                          key={uuid()}
                          _id={memory._id}
                          author={memory.author}
                          createdAt={memory.createdAt}
                          date={memory.date}
                          title={memory.title}
                          description={memory.description}
                          image={memory.image}
                          favoritesPage
                        />
                      ))}
                    </>
                  ) : (
                    <Typography
                      className={classes.infoTitle}
                      variant="h4"
                      align="center"
                    >
                      You've not made any memory as your favorite one!
                    </Typography>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </Container>
    </Grow>
  )
}

export default Favorites
