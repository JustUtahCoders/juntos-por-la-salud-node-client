const cheerio = require('cheerio')
const createEasyFetch = require('./easy-fetch')
const fs = require('fs')
const path = require('path')

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
  const {client, participantId, username, password} = options

  let currentStep;

  function setCurrentStep(newStep) {
    console.log(newStep)
    currentStep = newStep
  }

  const isCreatingNew = !Boolean(participantId)

  setCurrentStep(steps.FETCHING_LOGIN_PAGE);
  const easyFetch = createEasyFetch()

  const loginHtml = await easyFetch('https://ventanillasjpls.org/Cuentas/Login.aspx')

  setCurrentStep(steps.LOGGING_IN)

  let $ = cheerio.load(loginHtml)
  $('#mc_Email').attr('value', username)
  $('#mc_Password').attr('value', password)

  let params = isCreatingNew ? new Buffer(`ViewMode=Insert`).toString('base64') : new Buffer(`ViewMode=ReadOnly&PersonaID=${participantId}`).toString('base64')
  const returnUrl = `/Registro/Persona.aspx?params=${params}`
  console.log('isCreatingNew', isCreatingNew, 'returnUrl', returnUrl, 'participantId', participantId)

  const participantHtml = await easyFetch(`https://ventanillasjpls.org/Cuentas/Login.aspx?ReturnUrl=${encodeURIComponent(returnUrl)}`, {
    method: 'POST',
    body: $('form').serialize() + '&ctl00%24mc%24loginButton=Log+in',
  })

  $ = cheerio.load(participantHtml)

  const newParticipantId = $('#mc_fv_PersonaIDTextBox_I').attr('value')

  fs.writeFileSync(path.resolve(process.cwd(), `participant-${new Date().getTime()}.html`), participantHtml)
  const upsertedHtml = upsertParticipant(participantHtml, params, client)

  $ = cheerio.load(upsertedHtml)

  return isCreatingNew ? newParticipantId : participantId

  // const participantIdEls = $('#mc_fv_lblPersonaID')
  // if (participantIdEls.length === 0) {
  //   fs.writeFileSync(path.resolve(process.cwd(), `failed-upsert-${new Date().getTime()}.html`), participantHtml)
  //   throw Error(`Failed to create participant -- server responded with HTTP 200 without ${isCreatingNew ? 'creating' : 'editing'} the participant`)
  // } else {
  //   console.log(`${isCreatingNew ? "CREATED" : "EDITED"} THE PARTICIPANT!!!!!!!!`)
  //   const participantId = participantIdEls.text()
  //   return participantId
  // }

  function upsertParticipant(html) {
    $ = cheerio.load(html)

    const extraInputs = []

    // Name
    $(`[name="ctl00$mc$fv$NombreTextBox"]`).attr('value', client.firstName.toUpperCase())
    extraInputs.push(extraInput('ctl00$mc$fv$NombreTextBox$State', '{&quot;validationState&quot;:&quot;&quot;}'))
    $(`[name="ctl00$mc$fv$ApellidostextBox"]`).attr('value', client.lastName.toUpperCase())
    extraInputs.push(extraInput('ctl00$mc$fv$ApellidostextBox$State', '{&quot;validationState&quot;:&quot;&quot;}'))

    // Gender
    $(`[name="ctl00$mc$fv$radSexo"]`).attr('value', genderNumber(client.gender))
    $(`[name="ctl00$mc$fv$radSexo$RB0"]`).attr('value', client.gender === 'male' ? 'C' : 'U')
    $(`[name="ctl00$mc$fv$radSexo$RB1"]`).attr('value', client.gender === 'female' ? 'C' : 'U')
    $(`[name="ctl00$mc$fv$radSexo$RB2"]`).attr('value', client.gender !== 'male' && client.gender !== 'female' ? 'C' : 'U')
    extraInputs.push(extraInput('ctl00$mc$fv$radSexo$State', '{&quot;validationState&quot;:&quot;&quot;}'))

    // Phone
    $(`[name="ctl00$mc$fv$TelefonoCasatextBox"]`).attr('value', client.phone)
    $(`[name="mc_fv_cbFormaContacto_VI"]`).attr('value', 1)
    $(`[name="ctl00$mc$fv$cbFormaContacto"]`).attr('value', 'Teléfono') // this means the client prefers being contacted via phone instead of email
    $(`[name="ctl00$mc$fv$cbFormaContacto$DDD$L"]`).attr('value', 1)
    extraInputs.push(
      extraInput('ctl00$mc$fv$cbFormaContacto$State', '{&quot;validationState&quot;:&quot;&quot;}'),
      extraInput('ctl00$mc$fv$cbFormaContacto$DDDState', '{&quot;windowsState&quot;:&quot;0:0:12000:1053:327:1:364:44:1:0:0:0&quot;}')
    )

    // Street Address
    $(`[name="ctl00$mc$fv$tbDireccion"]`).attr('value', client.homeAddress.street)

    // City
    extraInputs.push(
      extraInput('ctl00$mc$fv$cbCiudad$DDDState', '{&quot;windowsState&quot;:&quot;0:0:-1:0:0:1:166:149:1:0:0:0&quot;}'),
      extraInput('ctl00$mc$fv$cbCiudad$DDD$L$State', '{&quot;CustomCallback&quot;:&quot;LECC\|0;;&quot;}'),
    )

    // State
    $(`[name="ctl00$mc$fv$cbEstado"]`).attr('value', 'Utah') // Assuming Utah allows us to avoid having to map USA states to the JPLS numeric value
    $(`[name="mc_fv_cbEstado_VI"]`).attr('value', 76) // 76 means Utah
    $(`[name="ctl00$mc$fv$cbEstado$DDD$L"]`).attr('value', 76) // 76 means Utah
    extraInputs.push(
      extraInput('ctl00$mc$fv$cbEstado$State', '{&quot;validationState&quot;:&quot;&quot;}'),
      extraInput('ctl00$mc$fv$cbEstado$DDDState', '{&quot;windowsState&quot;:&quot;0:0:12000:1053:248:1:364:149:1:0:0:0&quot;}'),
      extraInput('ctl00$mc$fv$cbEstado$DDD$L$State', '{&quot;CustomCallback&quot;:&quot;&quot;}')
    )

    // Country
    $(`[name="ctl00$mc$fv$cbPais"]`).attr('value', 'Estados Unidas') // Assuming all clients are in the USA allows us to avoid having to map country name to JPLS' country value
    $(`[name="mc_fv_cbPais_VI"]`).attr('value', 2) // 2 is the value for USA
    $(`[name="ctl00$mc$fv$cbPais$DDD$L"]`).attr('value', 2)
    extraInputs.push(
      extraInput('ctl00$mc$fv$cbPais$State', '{&quot;validationState&quot;:&quot;&quot;}'),
      extraInput('ctl00$mc$fv$cbPais$DDDState', '{&quot;windowsState&quot;:&quot;0:0:-1:0:0:0:-10000:-10000:1:0:0:0&quot;}'),
      extraInput('ctl00$mc$fv$cbPais$DDD$L$State', '{&quot;CustomCallback&quot;:&quot;&quot;}')
    )

    // Email
    $(`[name="ctl00$mc$fv$cbEmail"]`).attr('value', client.email)

    // Birthday
    $(`[name="ctl00$mc$fv$dtFechaNacimiento"]`).attr('value', processDate(client.birthday))
    $(`[name="ctl00$mc$fv$tbEdad"]`).attr('value', 'Edad')
    extraInputs.push(
      extraInput('ctl00$mc$fv$tbEdad$State', '{&quot;rawValue&quot;:&quot;&quot;}'),
      extraInput('ctl00$mc$fv$dtFechaNacimiento$State', `{&quot;rawValue&quot;:&quot;${new Date(client.birthday).getTime()}&quot;,&quot;validationState&quot;:&quot;&quot;}`),
      extraInput('ctl00$mc$fv$dtFechaNacimiento$DDDState', '{&quot;windowsState&quot;:&quot;0:0:12000:1163:195:1:0:0:1:0:0:0&quot;}'),
      extraInput('ctl00$mc$fv$dtFechaNacimiento$DDD$C', `{&quot;visibleDate&quot;:&quot;${processDate(client.birthday)}&quot;,&quot;selectedDates&quot;:[&quot;${processDate(client.birthday)}&quot;]}`),
      extraInput('ctl00$mc$fv$dtFechaNacimiento$DDD$C$FNPState', '{&quot;windowsState&quot;:&quot;0:0:-1:0:0:0:-10000:-10000:1:0:0:0&quot;}')
    )

    // Country of origin
    extraInputs.push(
      extraInput('ctl00$mc$fv$cbPaisOrigen$DDDState', '{&quot;windowsState&quot;:&quot;0:0:-1:0:0:0:-10000:-10000:1:0:0:0&quot;}'),
      extraInput('ctl00$mc$fv$cbPaisOrigen$DDD$L$State', '{&quot;CustomCallback&quot;:&quot;&quot;}'),
      extraInput('ctl00$mc$fv$cbEstadoOrigen$DDDState', '{&quot;windowsState&quot;:&quot;0:0:-1:0:0:0:-10000:-10000:1:0:0:0&quot;}'),
      extraInput('ctl00$mc$fv$cbEstadoOrigen$DDD$L$State', '{&quot;CustomCallback&quot;:&quot;&quot;}')
    )

    // Family
    $(`[name="ctl00$mc$fv$cbTieneFamilia"]`).attr('value', 'I')

    // Consent Form
    $(`[name="ctl00$mc$fv$chkCartaConsentimientoEntregada"]`).attr('value', 'U')
    $(`[name="ctl00$mc$fv$chkCartaConsentimientoInformado"]`).attr('value', 'U')

    // Insurance
    $(`[name="ctl00$mc$fv$ckSeguro"]`).attr('value', 'I')
    $(`[name="ctl00$mc$fv$tbCualSeguroSocial"]`).attr('value', '¿Cuál?')
    $(`[name="ctl00$mc$fv$chkConsuladoMovil"]`).attr('value', 'U')
    extraInputs.push(
      extraInput('ctl00$mc$fv$tbCualSeguroSocial$State', `{&quot;rawValue&quot;:&quot;&quot;}`)
    )

    // Healthcare stuff
    extraInputs.push(
      extraInput('ctl00$mc$fv$cbTipoServicioMedicoID$DDDState', '{&quot;windowsState&quot;:&quot;0:0:-1:0:0:0:-10000:-10000:1:0:0:0&quot;}'),
    )

    // .NET stuff
    $('#__EVENTTARGET').attr('value', isCreatingNew ? 'ctl00$mc$fv$linkInsert' : 'ctl00$mc$fv$lbtnUpdate')
    extraInputs.push(
      extraInput('DXScript', '1_225,1_164,1_130,1_162,1_170,1_218,1_165,1_134,1_175,1_161,1_127,1_210,1_159,1_208,1_168,1_166,1_160,1_152,1_154'),
      extraInput('DXCss', '1_32,1_18,0_1059,0_1057,0_1237,0_1239,/Content/css?v=T1a9uzInA1oPAi_UpYx84f8gS0bNzRT73NnODaqmLow1,../favicon.ico')
    )

    const serializedForm = $('form').serialize() + '&' + extraInputs.join('&')

    fs.writeFileSync(path.resolve(process.cwd(), `params-${new Date().getTime()}.html`), serializedForm.split('&').join('\n'))

    return easyFetch(`https://ventanillasjpls.org/Registro/Persona.aspx?params=${params}`, {
      method: 'POST',
      body: serializedForm,
    })
  }
}


function genderNumber(gender) {
  switch(gender) {
    case 'male':
      return 0;
    case 'female':
      return 1;
    default:
      return 2;
  }
}

function extraInput(name, value) {
  return encodeURIComponent(name) + '=' + encodeURIComponent(value)
}

function processDate(date) {
  const match = /([0-9]{4})\-([0-9]{2})\-([0-9]{2})/.exec(date)
  if (!match) {
    throw Error("juntos-por-la-salud-node-client requires dates to be passed in YYYY-MM-DD format")
  }

  const [full, year, month, day] = match
  // JPLS requires this format
  return `${month}/${day}/${year}`
}