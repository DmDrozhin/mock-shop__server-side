const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')
const mailer = require('./nodemailer/nodemailer.js')

// const ordersFile = path.join(__dirname, 'server', 'orders', 'main.json')
// const ordersDir = path.join(__dirname, 'server', 'orders')
// const ordersMain = path.resolve(__dirname, 'server', 'orders', 'main.json')
const ordersMain = './server/orders_consolidated/orders.json'
const ordersDir = './server/orders/'

// const watcher = chokidar.watch([ordersFile, ordersDir], { ignoreInitial: true })
const watcher1 = chokidar.watch(ordersMain, { persistent: true, ignoreInitial: true })
const watcher2 = chokidar.watch(ordersDir, { ignored: ordersMain, ignoreInitial: true })
const log = console.log.bind(console)

watcher1.on('change', changedPath => {
  fs.readFile(changedPath, 'utf-8', (err, data) => {
    log('WATCHER1: ', changedPath)
    if (err) console.error('Err while reading the main.json', err)
    if (data) {
      const ordersArr = JSON.parse(data).orders
      const orderLatest = ordersArr.slice(-1)[0]
      const orderLatestJSON = JSON.stringify(orderLatest)
      const orderNum = Object.getOwnPropertyNames(orderLatest)[0]
      fs.writeFile(path.join(ordersDir, `${orderNum}.json`), orderLatestJSON, (err) => {
        if (err) console.log(err)
      })
    }
  })
}).on('error', err => console.error('WATCHER1 ERROR: ', err))

watcher2.on('add', (newOrder, stats) => {
  // log('WATCHER2', newOrder);
  // log(stats)
  fs.readFile(newOrder, 'utf-8', (err, dt) => {
    if (err) console.error(err)
    if (dt) {
      const currOrder = JSON.parse(dt)
      createMailMessage(currOrder)
    }
  })
}).on('error', err => console.error('WATCHER2 ERROR: ', err))


let createMailMessage = (currOrder) => {
      const orderNum = +Object.keys(currOrder)[0]
      const orderDataArr = Object.values(currOrder)[0]
      const customer = currOrder['customer']
      const ID = currOrder['id']
      // log(orderArr, customer, ID)
      let orderTotalSum = 0
      let orderReceivedTime = (() => new Date().toLocaleString())()
      let orderTime = undefined
      let orderLayout = `
      <h2 style="color: green;">ORDER # ${orderNum}</h2>
      <hr>
      <table style="table-layout: fixed; width: 100%; text-align: center;">
        <tr>
          <th>#</th>
          <th>Image</th>
          <th>Name</th>
          <th>Article</th>
          <th>Category</th>
          <th>Qt.</th>
          <th>Size</th>
          <th>Price</th>
          <th>Sum</th>
        </tr>`
      const imgArr = []
      orderDataArr.forEach((el, idx) => {
        const tRow = `
        <tr>
          <td>${idx + 1}</td>
          <td><img src='cid:${el.image}${process.env.ADM_TOOLS_ORDER_EMAIL_DOMAIN}' height=100px;></td>
          <td>${el["prod-name"]}</td>
          <td>${el.article}</td>
          <td>${el.category}</td>
          <td>${el.orderQt}</td>
          <td>${el.prodSize.toUpperCase()}</td>
          <td>${el.price.toFixed(2)}</td>
          <td>${el.orderSum.toFixed(2)}</td>
        </tr>
        `
        orderTotalSum += el.orderSum
        orderTime = el.time
        orderLayout += tRow
        imgArr.push({filename: el.image, path: './assets/images/' + el.image, cid: el.image + process.env.ADM_TOOLS_ORDER_EMAIL_DOMAIN})
      })
      orderLayout += `</table>
      <hr>
      <p><b>Order time:</b> ${orderTime}</p>
      <p><b>Order received to process time:</b> ${orderReceivedTime}</p>
      <p><b>Order total sum:</b> <span style="font-size: 1.2rem; color: green;"> ${orderTotalSum.toFixed(2)}</span>`
      
      orderLayout += `<hr>
      <h3>ЗАМОВНИК:</h3>
      <p><b>Ім'я: </b> ${customer.name1}</p>
      <p><b>Прізвище: </b>${customer.name2}</p>
      <p><b>По батькові: </b>${customer.name3}</p>
      <p><b>Тел.: </b>${customer.tel}</p>
      <p><b>Ел. пошта.: </b>${customer.email}</p>
      <p><b>Адреса: </b>${customer.address}</p>`

      emailOrderNotification(orderLayout, orderNum, imgArr)
      // log(orderLayout)
}

let emailOrderNotification = (orderLayout, orderNum, imgArr) => {
  // log(process.env)
  const message = {
    to: 'dmdcomm@gmail.com',
    subject: `Received new order# ${orderNum}`,
    text: 'Hello from server',
    html: `${orderLayout}`,
    attachments: imgArr
  }
  mailer(message) 
}