# juntos-por-la-salud-node-client
A nodejs client to the [juntos por la salud app](https://ventanillasjpls.org)

https://ventanillasjpls.org

## Installation
```sh
yarn add juntos-por-la-salud-node-client

# Or
npm install --save juntos-por-la-salud-node-client
```

## Usage
```js
const { upsertClient } = require('juntos-por-la-salud-node-client');

upsertClient({
  client, // See https://github.com/JustUtahCoders/comunidades-unidas-internal/blob/master/api-docs/get-client.md for what client needs to look like
  participantId: '8693e2e4-85cd-4851-9832-ea5595b615e4'  // This is called the Unique ID in the JPLS UI.
  username: process.env.JPLS_USERNAME, // the username for https://ventanillasjpls.org
  password: process.env.JPLS_PASSWORD, // the password for https://ventanillasjpls.org
}).then(participantId => {
  console.log("The participant id is ", participantId)
}).catch(err => {
  // Failed to upsert the client
  console.error(err)
})
```