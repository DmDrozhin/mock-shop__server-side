const fs = require('fs')
const path = require('path')

// const dbPath = path.join(__dirname, 'server', 'db.json')
const ordersFile = path.join(__dirname, 'server', 'orders.json')
const ordersDir = path.join(__dirname, 'server', 'orders')

let events = []
fs.watch(ordersFile, (ev, name) => {
  events.push(ev)
  console.log(events)
  if (name && ev === 'change') {
    console.log('Changed')
    fs.readFile(ordersFile, 'utf-8', (err, dt) => {
      if (err) console.log(err)
      if (dt) {
        const orderLast = JSON.parse(dt).orders.slice(-1)
        const orderNum = Object.getOwnPropertyNames(orderLast[0])[0]
        const orderLastJSON = JSON.stringify(orderLast)
        fs.writeFile(path.join(ordersDir, `${orderNum}.json`), orderLastJSON, (err, dt) => {
          if (err) console.log(err)
          if (dt) console.log(dt)
        })
      }
    })    
  }
})

