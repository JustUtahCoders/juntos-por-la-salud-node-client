const fetch = require('node-fetch')
const tough = require('tough-cookie')
const Cookie = tough.Cookie
// const HttpsProxyAgent = require('https-proxy-agent')

// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

const cookieJar = new tough.CookieJar()
cookieJar.setCookie('language=en-US', 'https://ventanillasjpls.org/', {loose: true}, err => {
  if (err) {
    throw err
  }
})

let lastUrl = 'https://ventanillasjpls.org/Cuentas/Login.aspx'

module.exports = function easyFetch(url, init = {}) {
  init = Object.assign({}, {
    method: 'GET',
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-US,en;q=0.5',
      'Connection': 'keep-alive',
      'Cookie': cookieJar.getCookieStringSync(url),
      'Content-Type': 'application/x-www-form-urlencoded',
      'Host': 'ventanillasjpls.org',
      'Referer': lastUrl,
      'Upgrade-Insecure-Requests': 1,
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:68.0) Gecko/20100101 Firefox/68.0',
    },
    redirect: 'manual',
    // agent: new HttpsProxyAgent('http://127.0.0.1:8866'),
    body: null,
  }, init)

  if (typeof init.body === 'string') {
    // init.headers['Content-Length'] = init.body.length
  }

  lastUrl = url

  console.log('------------------------------------------------------')
  console.log(`${init.method} ${url}`)
  Object.entries(init.headers).forEach(([headerName, headerValue]) => {
    console.log(`${headerName}: ${headerValue}`)
  })
  console.log(`\n${init.body || ''}`)
  console.log('------------------------------------------------------')

  return fetch(url, init)
    .then(r => {
      if (cookieJar && r.headers.get('Set-Cookie')) {
        cookieJar.setCookieSync(Cookie.parse(r.headers.get('Set-Cookie')), url)
      }

      if (r.ok) {
        return r.text().then(text => {
          console.log(r.status)
          for (let entry of r.headers.entries()) {
            console.log(`${entry[0]}: ${entry[1]}`)
          }
          if (init.logBody) {
            console.log(`\n${text}`)
          }
          console.log('------------------------------------------------------')
          return text
        })
      } else if (r.status >= 300 && r.status < 400) {
        if (cookieJar && r.headers.get('Set-Cookie')) {
          cookieJar.setCookieSync(Cookie.parse(r.headers.get('Set-Cookie')), url)
        }
        return easyFetch(r.headers.get('location'))
      } else {
        return r.text().then(text => {
          if (init.logBody) {
            console.log(`\n${text}`)
          }
          console.log('------------------------------------------------------')
          let errMessage = 'Unknown Error'
          try {
            errMessage = cheerio.load(text)('title').text()
          } catch (err) {
          }

          throw Error(`ventanillasjpls.org responded with status ${r.status} for url '${url}'. Error was ${errMessage}`)
        })
      }
    })
}