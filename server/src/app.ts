import express from 'express'
import config from 'config'
import cors from 'cors'
import log from './logger'
import connect from './db/connect'
import routes from './routes'
import apiErrorHandler from './controllers/error.controller'

const PORT = (config.get('PORT') || 3001) as number

const app = express()

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: false }))

app.use(cors())

app.listen(PORT, async () => {
  log.info(`Server is running at ${PORT}`)
  await connect()
  routes(app)
  app.use(apiErrorHandler)
})
