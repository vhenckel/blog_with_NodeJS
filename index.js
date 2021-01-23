const express = require("express")
const app = express()
const bodyParser = require("body-parser")

const connection = require("./database/database")
connection
  .authenticate()
  .then(() => {
    console.log('DB success')
  })
  .catch((error) => {
    console.log('DbError: ', error)
  })

const categoriesController = require("./categories/CategoriesController")
const articlesController = require("./articles/ArticlesController")

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

app.use("/", categoriesController)
app.use("/", articlesController)

app.get("/", (req, res) => {
  res.render("index")
})

app.listen(8080, () => {
  console.log('Server is running...')
})