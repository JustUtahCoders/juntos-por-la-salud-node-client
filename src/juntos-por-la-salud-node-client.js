const cheerio = require('cheerio')
const createEasyFetch = require('./easy-fetch')
const fs = require('fs')
const path = require('path')
const { createUpsertParticipantBody } = require('./participant-integration')

const steps = {
  FETCHING_LOGIN_PAGE: 'FETCHING_LOGIN_PAGE',
  LOGGING_IN: 'LOGGING_IN',
  GETTING_NEW_PARTICIPANT_ID: 'GETTING_NEW_PARTICIPANT_ID',
  CREATING_PARTICIPANT: 'CREATING_PARTICIPANT',
  UPDATING_PARTICIPANT: 'UPDATING_PARTICIPANT',
  LOADING_EDIT_PARTICIPANT_FORM: 'LOADING_EDIT_PARTICIPANT_FORM',
  SUBMITTING_NEW_PARTICIPANT_FORM: 'SUBMITTING_NEW_PARTICIPANT_FORM',
  SUBMITTING_EDIT_PARTICIPANT_FORM: 'SUBMITTING_EDIT_PARTICIPANT_FORM',
}

exports.upsertClient = async function upsertClient(options) {
  const fullLog = []
  const log = (...messages) => fullLog.push(messages)
  try {
    const participantId = await doUpsert(options, log)
    return participantId
  } catch (err) {
    console.error(fullLog.join('\n'))
    throw err;
  }
}

async function doUpsert(options, log) {
  const {client, participantId, username, password} = options

  let currentStep;

  function setCurrentStep(newStep) {
    log(newStep)
    currentStep = newStep
  }

  const isCreatingNew = !Boolean(participantId)

  setCurrentStep(steps.FETCHING_LOGIN_PAGE);
  const easyFetch = createEasyFetch(log)

  const loginHtml = await easyFetch('https://ventanillasjpls.org/Cuentas/Login.aspx')

  setCurrentStep(steps.LOGGING_IN)

  let $ = cheerio.load(loginHtml)
  $('#mc_Email').attr('value', username)
  $('#mc_Password').attr('value', password)

  let params = isCreatingNew ? new Buffer(`ViewMode=Insert`).toString('base64') : new Buffer(`ViewMode=ReadOnly&PersonaID=${participantId}`).toString('base64')
  const returnUrl = `/Registro/Persona.aspx?params=${params}`

  let participantHtml = await easyFetch(`https://ventanillasjpls.org/Cuentas/Login.aspx?ReturnUrl=${encodeURIComponent(returnUrl)}`, {
    method: 'POST',
    body: $('form').serialize() + '&ctl00%24mc%24loginButton=Log+in',
  })

  setCurrentStep(isCreatingNew ? steps.CREATING_PARTICIPANT : steps.UPDATING_PARTICIPANT)

  $ = cheerio.load(participantHtml)
  if (isCreatingNew) {
    participantId = $('#mc_fv_PersonaIDTextBox_I').attr('value')
  } else {
    $("#__EVENTTARGET").attr('value', 'ctl00$mc$fv$EditButton')
    participantHtml = await easyFetch(`https://ventanillasjpls.org/Registro/Persona.aspx?params=${encodeURIComponent(params)}`, {
      method: 'POST',
      body: $('form').serialize(),
    });
  }

  // Can be helpful for debugging
  // fs.writeFileSync(path.resolve(process.cwd(), `participant-${new Date().getTime()}.html`), participantHtml)

  const upsertParticipantBody = createUpsertParticipantBody(participantHtml, client, isCreatingNew)
  const upsertedHtml = await easyFetch(`https://ventanillasjpls.org/Registro/Persona.aspx?params=${params}`, {
    method: 'POST',
    body: upsertParticipantBody,
  })

  $ = cheerio.load(upsertedHtml)

  return participantId
}