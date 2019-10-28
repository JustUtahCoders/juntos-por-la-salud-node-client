exports.getCountryNumber = (countryCode) => {
  let zeroBasedIndex = countries.findIndex(c => c === countryCode)

  if (zeroBasedIndex < 0) {
    // If it's not in the list, mark it as "All" / "Other"
    zeroBasedIndex = otherCountryIndex
  }

  const oneBasedIndex = zeroBasedIndex + 1 // JPLS uses a one based index for countries

  return oneBasedIndex
}

const countries = [
  'MX',
  'US',
  'AR',
  'BO',
  'CL',
  'CO',
  'CR',
  'CU',
  'DO',
  'EC',
  'SV',
  'GT',
  'HT',
  'HN',
  'NI',
  'PA',
  'PE',
  'PR',
  'PY',
  'UY',
  'VE',
  'BR'
]

// JPLS has an "All" option at the end of their select box
const otherCountryIndex = countries.length 