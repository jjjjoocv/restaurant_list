
const express = require('express')
const app = express()
const restaurantList = require('./restaurant.json')
const port = 3000


// 使用handlebars前的設定
// require handlebars in the project
// app.engine: 定義要使用的樣板引擎 ( '樣板引擎的名稱', 預設佈局使用 'main' 檔案 )
// app.set: 設定view engine 是 handlebars
const exphbs = require('express-handlebars')
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// app.use(express.static(<folder_path>))
// 告訴 Express 靜態檔案放在'public' 的資料夾中
app.use(express.static('public'))


// routes setting --> 設定該路徑所渲染的內容
// Express會根據輸入的URL，依據 index.handlebars 回傳對應的 HTML 給browser。
// 第二個參數處放一個物件，這個物件則會在 index.handlebars 這個樣板中被使用。
app.get('/', (req, res) => {
  res.render('index', { restaurant: restaurantList.results })
})

app.get('/restaurants/:id', (req, res) => {
  const restaurant = restaurantList.results.find(store => {
    return store.id === Number(req.params.id)
  })
  res.render('show', { restaurant: restaurant })
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const keywordLowercaseNonSpace = keyword.toLowerCase().split(" ").join("")

  //搜尋餐廳種類、名稱,消除空白與轉成小寫作比對
  const restaurant = restaurantList.results.filter(store => {
    const storeLowercaseNonSpace = store.name.toLowerCase()
    const categoryLowercaseNonSpace = store.category.toLowerCase()
    const locationLowercaseNonSpace = store.location.toLowerCase()
    return (storeLowercaseNonSpace.includes(keywordLowercaseNonSpace) || categoryLowercaseNonSpace.includes(keywordLowercaseNonSpace) || locationLowercaseNonSpace.includes(keywordLowercaseNonSpace))
  })
  const noSearchResult = restaurant.length === 0 ? 'No searching result.' : null
  //還差搜尋沒有結果時也有對應頁面提示
  res.render('index', { restaurant: restaurant, keyword: keyword, noSearchResult: noSearchResult })

})

app.listen(port, () => {
  console.log(`Express is listening on /localhost:${port}`)

})
