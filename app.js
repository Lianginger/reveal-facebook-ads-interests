if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const axios = require('axios')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function(req, res) {
  if (req.query.keyword === undefined) {
    return res.render('home')
  }

  let keyword = req.query.keyword.toUpperCase()
  keyword = keyword.charAt(0).toUpperCase() + keyword.slice(1).toLowerCase()

  let URL1 = `https://graph.facebook.com/search?type=adinterest&q=[${keyword}]&limit=10000&locale=zh_TW&access_token=${process.env.ACCESS_TOKEN}`
  let URL2 = `https://graph.facebook.com/search?type=adinterestsuggestion&interest_list=['${keyword}']&limit=1000&locale=en_US&access_token=${process.env.ACCESS_TOKEN}`

  const promise1 = axios.get(URL1)
  const promise2 = axios.get(URL2)

  Promise.all([promise1, promise2]).then(function(values) {
    console.log(values)
    const adinterest = values[0].data
    const adinterestsuggestion = values[1].data
    res.render('home', { keyword, adinterest, adinterestsuggestion })
  })
})

app.listen(port, () => {
  console.log(`Express is running on ${port}`)
})
