if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const axios = require('axios')
const exphbs = require('express-handlebars')

app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')

app.get('/', function(req, res) {
  res.render('home')
})

app.get('/:keyword', (req, res) => {
  const keyword = req.params.keyword.toUpperCase()
  axios
    .get(
      `https://graph.facebook.com/search?type=adinterest&q=[${keyword}]&limit=10000&locale=en_US&access_token=${
        process.env.ACCESS_TOKEN
      }`
    )
    .then(response => {
      res.json(response.data)
    })
})

app.listen(port, () => {
  console.log(`Express is running on ${port}`)
})
