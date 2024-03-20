const express = require('express')
const app = express()
require('dotenv').config()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authors')
const bookRouter = require('./routes/books')
const { errorhandling } = require('./Middleware/errorHandling.js')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false }))
const connectDB = require('./db.js')

app.use('/', indexRouter)
app.use('/authors', authorRouter)
app.use('/books', bookRouter)
app.use(errorhandling)
const apprun = () => {
	connectDB()
	app.listen(process.env.PORT || 3000);
}
apprun();



