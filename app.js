if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const axios = require('axios')
const fetch = require('node-fetch')
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
  let encodeKeyword = encodeURI(keyword)

  let URL1 = `https://graph.facebook.com/search?type=adinterest&q=[%27${encodeKeyword}%27]&limit=10000&locale=zh_TW&access_token=${process.env.ACCESS_TOKEN}`
  console.log(URL1)

  let promise1 = axios.get(URL1)

  let promise2 = new Promise(resolve => {
    resolve({ data: { name: 'hi' } })
  })

  // adinterestsuggestion not support chinese character
  if (!req.query.keyword.match(/[\u3400-\u9FBF]/)) {
    let URL2 = `https://graph.facebook.com/search?type=adinterestsuggestion&interest_list=['${encodeKeyword}']&limit=1000&locale=en_US&access_token=${process.env.ACCESS_TOKEN}`
    promise2 = axios.get(URL2)
  }

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
