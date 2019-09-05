const cheerio = require('cheerio')
const easyFetch = require('./easy-fetch')

const steps = {
  FETCHING_LOGIN_PAGE: 'FETCHING_LOGIN_PAGE',
  LOGGING_IN: 'LOGGING_IN',
  GETTING_NEW_PARTICIPANT_ID: 'GETTING_NEW_PARTICIPANT_ID',
  SUBMITTING_NEW_PARTICIPANT_FORM: 'SUBMITTING_NEW_PARTICIPANT_FORM',
}

let currentStep = steps.FETCHING_LOGIN_PAGE

easyFetch('https://ventanillasjpls.org/Cuentas/Login.aspx', {logBody: true})
.then(loginHtml => {
  currentStep = steps.LOGGING_IN
  const $ = cheerio.load(loginHtml)
  $('#mc_Email').attr('value', process.env.JPLS_USERNAME)
  $('#mc_Password').attr('value', process.env.JPLS_PASSWORD)
  return easyFetch('https://ventanillasjpls.org/Cuentas/Login.aspx?ReturnUrl=%2fRegistro%2f', {
    method: 'POST',
    body: $('form').serialize() + '&ctl00%24mc%24loginButton=Log+in',
  })
})
.then(registrationHtml => {
  currentStep = steps.GETTING_NEW_PARTICIPANT_ID
  const $ = cheerio.load(registrationHtml)
  const relativeNewParticipantLink = $('#mc_grid_header0_ASPxHyperLink2_0').attr('href')
  return easyFetch(`https://ventanillasjpls.org/Registro/${relativeNewParticipantLink}`)
})
.then(newParticipantHtml => {
  currentStep = steps.SUBMITTING_NEW_PARTICIPANT_FORM
  const $ = cheerio.load(newParticipantHtml)
  $('#mc_fv_NombreTextBox_I').attr('value', 'Test2')
  $('#mc_fv_ApellidostextBox_I').attr('value', 'Test')
  $('#mc_fv_cbFormaContacto_I').attr('value', 'Teléfono')
})

function getGenderIdToClick(gender) {
  switch (gender) {
    case 'male':
      return 'mc_fv_radSexo_RB0_I'
    case 'female':
      return 'mc_fv_radSexo_RB1_I'
    default:
      return 'mc_fv_radSexo_RB2_I'
  }
}