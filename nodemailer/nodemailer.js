const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport(
  // {
  //   host: process.env.ETHEREAL_ORDER_EMAIL_HOST,
  //   port: process.env.ETHEREAL_ORDER_EMAIL_PORT,
  //   auth: {
  //     user: process.env.ETHEREAL_ORDER_EMAIL,
  //     pass: process.env.ETHEREAL_ORDER_EMAIL_PASS
  //   }
  // },
  // {
  //   from: `'Mailer test <${process.env.ETHEREAL_ORDER_EMAIL}>`
  // }
  {
    host: process.env.ADM_TOOLS_ORDER_EMAIL_HOST,
    port: process.env.ADM_TOOLS_ORDER_EMAIL_PORT,
    secure: true,
    rejectUnauthorized: false,
    auth: {
      user: process.env.ADM_TOOLS_ORDER_EMAIL,
      pass: process.env.ADM_TOOLS_ORDER_EMAIL_PASS
    }
  },
  {
    from: `'Vuex-shop <${process.env.ADM_TOOLS_ORDER_EMAIL}>`
  }
)

const mailer = msg => {
  transporter.sendMail(msg, (err, info) => {
    if (err) return console.error(err)
    console.log('Email sent: ', info)
  })
}

module.exports = mailer

