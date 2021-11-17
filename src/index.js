const express = require('express')
const userRouter = require('./routers/users')
const driversRequestsRouter = require('./routers/driversRequests')
const adminRouter = require('./routers/admin')
const ridesRouter = require('./routers/rides')

require('dotenv').config()

// npm i cors
const cors = require('cors')
const app = express()

const port = process.env.PORT
// Parse automatic 
app.use(express.json())
// connection
require('./db/mongoose')
// npm i cors
app.use(cors())

app.use(userRouter)
app.use(driversRequestsRouter)
app.use(adminRouter)
app.use(ridesRouter)

app.listen(port,()=>{console.log('Server is running '+ port)})