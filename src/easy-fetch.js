const fetch = require('node-fetch')
const tough = require('tough-cookie')
const Cookie = tough.Cookie

module.exports = function createEasyFetch(log) {
  const cookieJar = new tough.CookieJar()
  cookieJar.setCookie('language=en-US', 'https://ventanillasjpls.org/', {loose: true}, err => {
    if (err) {
      throw err
    }
  })

  let lastUrl = 'https://ventanillasjpls.org/Cuentas/Login.aspx'

  return function easyFetch(url, init = {}) {
    init = Object.assign({}, {
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.5',
        'Cache-Control': 'max-age=0',
        'Connection': 'keep-alive',
        'Cookie': cookieJar.getCookieStringSync(url),
        'Content-Type': 'application/x-www-form-urlencoded',
        'Host': 'ventanillasjpls.org',
        'Origin': 'https://ventanillasjpls.org',
        'Referer': lastUrl,
        'Upgrade-Insecure-Requests': 1,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:68.0) Gecko/20100101 Firefox/68.0',
      },
      redirect: 'manual',
      // agent: new HttpsProxyAgent('http://127.0.0.1:8866'),
      body: null,
    }, init)

    if (typeof init.body === 'string') {
      init.headers['Content-Length'] = init.body.length
    }

    lastUrl = url

    log('------------------------------------------------------')
    log(`${init.method} ${url}`)
    Object.entries(init.headers).forEach(([headerName, headerValue]) => {
      log(`${headerName}: ${headerValue}`)
    })
    log(`\n${init.body || ''}`)
    log('------------------------------------------------------')

    return fetch(url, init)
      .then(r => {
        if (cookieJar && r.headers.get('Set-Cookie')) {
          cookieJar.setCookieSync(Cookie.parse(r.headers.get('Set-Cookie')), url)
        }

        if (r.ok) {
          return r.text().then(text => {
            log(r.status)
            for (let entry of r.headers.entries()) {
              log(`${entry[0]}: ${entry[1]}`)
            }
            if (init.logBody) {
              log(`\n${text}`)
            }
            log('------------------------------------------------------')
            return text
          })
        } else if (r.status >= 300 && r.status < 400) {
          if (cookieJar && r.headers.get('Set-Cookie')) {
            cookieJar.setCookieSync(Cookie.parse(r.headers.get('Set-Cookie')), url)
          }
          log('REDIRECTING', r.status, r.headers.get('location'))
          return easyFetch(r.headers.get('location'))
        } else {
          return r.text().then(text => {
            if (init.logBody) {
              log(`\n${text}`)
            }
            log('------------------------------------------------------')
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
}
