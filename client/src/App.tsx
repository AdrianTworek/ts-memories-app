import { FC } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
// @ts-ignore
import * as smoothscroll from 'smoothscroll-polyfill'

import { Navbar } from './components'
import { Overview, Auth, Home, Favorites } from './pages'

import { CssBaseline } from '@material-ui/core'

smoothscroll.polyfill()

const App: FC = () => {
  return (
    <Router>
      <CssBaseline />
      <Navbar />
      <Switch>
        <Route exact path="/" component={Overview} />
        <Route exact path="/auth" component={Auth} />
        <Route exact path="/home" component={Home} />
        <Route exact path="/favorites" component={Favorites} />
      </Switch>
    </Router>
  )
}

export default App
