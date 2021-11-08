import { FC, useEffect } from 'react'
import { useHistory } from 'react-router'
import { useDispatch } from 'react-redux'
import { setUserActionCreator } from '../../redux/slices/auth'
import { toggleSignUpActionCreator } from '../../redux/slices/signupMode'

import { Memory } from '../../components'

import { Container, Grid, Button, Typography, Grow } from '@material-ui/core'
import useStyles from './styles'

const Overview: FC = () => {
  const dispatch = useDispatch()
  const classes = useStyles()
  const history = useHistory()

  useEffect(() => {
    if (JSON.parse(localStorage.getItem('profile') as string)) {
      dispatch(setUserActionCreator())
      history.push('/home')
    }
  }, [])

  return (
    <Container className={classes.container} maxWidth="md">
      <Grow in>
        <Grid container spacing={5} justifyContent="center" alignItems="center">
          <Grid item xs={10} sm={6}>
            <Grid item sm={12}>
              <Typography
                className={classes.title}
                variant="h4"
                align="center"
                color="primary"
                gutterBottom
              >
                Join to{' '}
                <Typography
                  className={classes.usersNumber}
                  variant="h4"
                  color="secondary"
                  component="span"
                >
                  17 873
                </Typography>{' '}
                users and create your unforgettable memories.
              </Typography>
            </Grid>
            <Grid container justifyContent="flex-start">
              <Grid item xs={12} sm={10}>
                <Button
                  className={classes.signupBtn}
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => {
                    dispatch(toggleSignUpActionCreator())
                    history.push('/auth')
                  }}
                >
                  Sign Up now for free
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={10} sm={6}>
            <Memory
              style={{ maxWidth: 275, margin: '0 auto' }}
              _id="Overview memory"
              author="Neville"
              date="2021-25-07"
              createdAt={Date.now()}
              title="Harvest moon"
              description="That was a superb day with my friends! At the end of it, we were marvelling at the red sky."
              image="./home-memory.jpg"
              overviewPage
            />
          </Grid>
        </Grid>
      </Grow>
    </Container>
  )
}

export default Overview
