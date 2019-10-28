const Fuse = require('fuse.js')

exports.getCityNumber = (state, city) => {
  const citiesInState = allCities[state]
  if (!citiesInState) {
    // Haven't mined all the cities yet for that state
    return ""
  }
  const fuse = new Fuse(citiesInState, {
    shouldSort: true,
    keys: [
      'name'
    ]
  })

  const results = fuse.search(city)

  if (results.length > 0) {
    const id = results[0].id
    return id
  } else {
    // Could not find a city with that name
    return ""
  }
}

const allCities = {
  UT: [
    {
      id: 28577,
      name: "Alpine",
    },
    {
      id: 28578,
      name: "Altamont",
    },
    {
      id: 28579,
      name: "Alton",
    },
    {
      id: 28580,
      name: "Altonah",
    },
    {
      id: 28581,
      name: "American Fork",
    },
    {
      id: 28582,
      name: "Aneth",
    },
    {
      id: 28583,
      name: "Annabella",
    },
    {
      id: 28584,
      name: "Antimony",
    },
    {
      id: 28585,
      name: "Aurora",
    },
    {
      id: 28586,
      name: "Axtell",
    },
    {
      id: 28587,
      name: "Bear River City",
    },
    {
      id: 28588,
      name: "Beaver",
    },
    {
      id: 28589,
      name: "Beryl",
    },
    {
      id: 28590,
      name: "Bicknell",
    },
    {
      id: 28591,
      name: "Bingham Canyon",
    },
    {
      id: 28592,
      name: "Blanding",
    },
    {
      id: 28593,
      name: "Bluebell",
    },
    {
      id: 28594,
      name: "Bluff",
    },
    {
      id: 28595,
      name: "Bonanza",
    },
    {
      id: 28596,
      name: "Boulder",
    },
    {
      id: 28597,
      name: "Bountiful",
    },
    {
      id: 28598,
      name: "Brian Head",
    },
    {
      id: 28599,
      name: "Brigham City",
    },
    {
      id: 28600,
      name: "Bryce",
    },
    {
      id: 28601,
      name: "Cache Junction",
    },
    {
      id: 28602,
      name: "Cannonville",
    },
    {
      id: 28603,
      name: "Castle Dale",
    },
    {
      id: 28604,
      name: "Cedar City",
    },
    {
      id: 28605,
      name: "Cedar Valley",
    },
    {
      id: 28606,
      name: "Centerfield",
    },
    {
      id: 28607,
      name: "Centerville",
    },
    {
      id: 28608,
      name: "Central",
    },
    {
      id: 28609,
      name: "Chester",
    },
    {
      id: 28610,
      name: "Circleville",
    },
    {
      id: 28611,
      name: "Cisco",
    },
    {
      id: 28612,
      name: "Clarkston",
    },
    {
      id: 28613,
      name: "Clawson",
    },
    {
      id: 28614,
      name: "Clearfield",
    },
    {
      id: 28615,
      name: "Cleveland",
    },
    {
      id: 28616,
      name: "Coalville",
    },
    {
      id: 28617,
      name: "Collinston",
    },
    {
      id: 28618,
      name: "Corinne",
    },
    {
      id: 28619,
      name: "Cornish",
    },
    {
      id: 28620,
      name: "Croydon",
    },
    {
      id: 28621,
      name: "Dammeron Valley",
    },
    {
      id: 28622,
      name: "Delta",
    },
    {
      id: 28623,
      name: "Deweyville",
    },
    {
      id: 28624,
      name: "Draper",
    },
    {
      id: 28625,
      name: "Duchesne",
    },
    {
      id: 28626,
      name: "Duck Creek Village",
    },
    {
      id: 28627,
      name: "Dugway",
    },
    {
      id: 28628,
      name: "Dutch John",
    },
    {
      id: 28629,
      name: "Eagle Mountain",
    },
    {
      id: 28630,
      name: "East Carbon",
    },
    {
      id: 28631,
      name: "Echo",
    },
    {
      id: 28632,
      name: "Eden",
    },
    {
      id: 28633,
      name: "Elberta",
    },
    {
      id: 28634,
      name: "Elmo",
    },
    {
      id: 28635,
      name: "Elsinore",
    },
    {
      id: 28636,
      name: "Emery",
    },
    {
      id: 28637,
      name: "Enterprise",
    },
    {
      id: 28638,
      name: "Ephraim",
    },
    {
      id: 28639,
      name: "Escalante",
    },
    {
      id: 28640,
      name: "Eureka",
    },
    {
      id: 28641,
      name: "Fairview",
    },
    {
      id: 28642,
      name: "Farmington",
    },
    {
      id: 28643,
      name: "Fayette",
    },
    {
      id: 28644,
      name: "Ferron",
    },
    {
      id: 28645,
      name: "Fielding",
    },
    {
      id: 28646,
      name: "Fillmore",
    },
    {
      id: 28647,
      name: "Fort Duchesne",
    },
    {
      id: 28648,
      name: "Fountain Green",
    },
    {
      id: 28649,
      name: "Fruitland",
    },
    {
      id: 28650,
      name: "Garden City",
    },
    {
      id: 28651,
      name: "Garland",
    },
    {
      id: 28652,
      name: "Garrison",
    },
    {
      id: 28653,
      name: "Glendale",
    },
    {
      id: 28654,
      name: "Glenwood",
    },
    {
      id: 28655,
      name: "Goshen",
    },
    {
      id: 28656,
      name: "Grantsville",
    },
    {
      id: 28657,
      name: "Green River",
    },
    {
      id: 28658,
      name: "Greenville",
    },
    {
      id: 28659,
      name: "Greenwich",
    },
    {
      id: 28660,
      name: "Grouse Creek",
    },
    {
      id: 28661,
      name: "Gunlock",
    },
    {
      id: 28662,
      name: "Gunnison",
    },
    {
      id: 28663,
      name: "Hanksville",
    },
    {
      id: 28664,
      name: "Hanna",
    },
    {
      id: 28665,
      name: "Hatch",
    },
    {
      id: 28666,
      name: "Heber City",
    },
    {
      id: 28667,
      name: "Helper",
    },
    {
      id: 28668,
      name: "Henefer",
    },
    {
      id: 28669,
      name: "Henrieville",
    },
    {
      id: 28670,
      name: "Herriman",
    },
    {
      id: 28671,
      name: "Hildale",
    },
    {
      id: 28672,
      name: "Hill Afb",
    },
    {
      id: 28673,
      name: "Hinckley",
    },
    {
      id: 28674,
      name: "Holden",
    },
    {
      id: 28675,
      name: "Honeyville",
    },
    {
      id: 28676,
      name: "Hooper",
    },
    {
      id: 28677,
      name: "Howell",
    },
    {
      id: 28678,
      name: "Huntington",
    },
    {
      id: 28679,
      name: "Huntsville",
    },
    {
      id: 28680,
      name: "Hurricane",
    },
    {
      id: 28681,
      name: "Hyde Park",
    },
    {
      id: 28682,
      name: "Hyrum",
    },
    {
      id: 28683,
      name: "Ibapah",
    },
    {
      id: 28684,
      name: "Ivins",
    },
    {
      id: 28685,
      name: "Jensen",
    },
    {
      id: 28686,
      name: "Joseph",
    },
    {
      id: 28687,
      name: "Junction",
    },
    {
      id: 28688,
      name: "Kamas",
    },
    {
      id: 28689,
      name: "Kanab",
    },
    {
      id: 28690,
      name: "Kanarraville",
    },
    {
      id: 28691,
      name: "Kanosh",
    },
    {
      id: 28692,
      name: "Kaysville",
    },
    {
      id: 28693,
      name: "Kenilworth",
    },
    {
      id: 28694,
      name: "Kingston",
    },
    {
      id: 28695,
      name: "Koosharem",
    },
    {
      id: 28696,
      name: "La Sal",
    },
    {
      id: 28697,
      name: "La Verkin",
    },
    {
      id: 28698,
      name: "Lake Powell",
    },
    {
      id: 28699,
      name: "Laketown",
    },
    {
      id: 28700,
      name: "Lapoint",
    },
    {
      id: 28701,
      name: "Layton",
    },
    {
      id: 28702,
      name: "Leamington",
    },
    {
      id: 28703,
      name: "Leeds",
    },
    {
      id: 28704,
      name: "Lehi",
    },
    {
      id: 28705,
      name: "Levan",
    },
    {
      id: 28706,
      name: "Lewiston",
    },
    {
      id: 28707,
      name: "Lindon",
    },
    {
      id: 28708,
      name: "Loa",
    },
    {
      id: 28709,
      name: "Logan",
    },
    {
      id: 28710,
      name: "Lyman",
    },
    {
      id: 28711,
      name: "Lynndyl",
    },
    {
      id: 28712,
      name: "Magna",
    },
    {
      id: 28713,
      name: "Manila",
    },
    {
      id: 28714,
      name: "Manti",
    },
    {
      id: 28715,
      name: "Mantua",
    },
    {
      id: 28716,
      name: "Mapleton",
    },
    {
      id: 28717,
      name: "Marysvale",
    },
    {
      id: 28718,
      name: "Mayfield",
    },
    {
      id: 28719,
      name: "Meadow",
    },
    {
      id: 28720,
      name: "Mendon",
    },
    {
      id: 28721,
      name: "Mexican Hat",
    },
    {
      id: 28722,
      name: "Midvale",
    },
    {
      id: 28723,
      name: "Midway",
    },
    {
      id: 28724,
      name: "Milford",
    },
    {
      id: 28725,
      name: "Millville",
    },
    {
      id: 28726,
      name: "Minersville",
    },
    {
      id: 28727,
      name: "Moab",
    },
    {
      id: 28728,
      name: "Modena",
    },
    {
      id: 28729,
      name: "Mona",
    },
    {
      id: 28730,
      name: "Monroe",
    },
    {
      id: 28731,
      name: "Montezuma Creek",
    },
    {
      id: 28732,
      name: "Monticello",
    },
    {
      id: 28733,
      name: "Monument Valley",
    },
    {
      id: 28734,
      name: "Morgan",
    },
    {
      id: 28735,
      name: "Moroni",
    },
    {
      id: 28736,
      name: "Mount Carmel",
    },
    {
      id: 28737,
      name: "Mount Pleasant",
    },
    {
      id: 28738,
      name: "Mountain Home",
    },
    {
      id: 28739,
      name: "Myton",
    },
    {
      id: 28740,
      name: "Neola",
    },
    {
      id: 28741,
      name: "Nephi",
    },
    {
      id: 28742,
      name: "New Harmony",
    },
    {
      id: 28743,
      name: "Newcastle",
    },
    {
      id: 28744,
      name: "Newton",
    },
    {
      id: 28745,
      name: "North Salt Lake",
    },
    {
      id: 28746,
      name: "Oak City",
    },
    {
      id: 28747,
      name: "Oakley",
    },
    {
      id: 28748,
      name: "Ogden",
    },
    {
      id: 28749,
      name: "Orangeville",
    },
    {
      id: 28750,
      name: "Orderville",
    },
    {
      id: 28751,
      name: "Orem",
    },
    {
      id: 28752,
      name: "Panguitch",
    },
    {
      id: 28753,
      name: "Paradise",
    },
    {
      id: 28754,
      name: "Paragonah",
    },
    {
      id: 28755,
      name: "Park City",
    },
    {
      id: 28756,
      name: "Park Valley",
    },
    {
      id: 28757,
      name: "Parowan",
    },
    {
      id: 28758,
      name: "Payson",
    },
    {
      id: 28759,
      name: "Peoa",
    },
    {
      id: 28760,
      name: "Pine Valley",
    },
    {
      id: 28761,
      name: "Pleasant Grove",
    },
    {
      id: 28762,
      name: "Plymouth",
    },
    {
      id: 28763,
      name: "Portage",
    },
    {
      id: 28764,
      name: "Price",
    },
    {
      id: 28765,
      name: "Providence",
    },
    {
      id: 28766,
      name: "Provo",
    },
    {
      id: 28767,
      name: "Randlett",
    },
    {
      id: 28768,
      name: "Randolph",
    },
    {
      id: 28769,
      name: "Redmond",
    },
    {
      id: 28770,
      name: "Richfield",
    },
    {
      id: 28771,
      name: "Richmond",
    },
    {
      id: 28772,
      name: "Riverside",
    },
    {
      id: 28773,
      name: "Riverton",
    },
    {
      id: 28774,
      name: "Rockville",
    },
    {
      id: 28775,
      name: "Roosevelt",
    },
    {
      id: 28776,
      name: "Roy",
    },
    {
      id: 28777,
      name: "Rush Valley",
    },
    {
      id: 28778,
      name: "Saint George",
    },
    {
      id: 28779,
      name: "Salem",
    },
    {
      id: 28780,
      name: "Salina",
    },
    {
      id: 28781,
      name: "Salt Lake City",
    },
    {
      id: 28782,
      name: "Sandy",
    },
    {
      id: 28783,
      name: "Santa Clara",
    },
    {
      id: 28784,
      name: "Santaquin",
    },
    {
      id: 28785,
      name: "Saratoga Springs",
    },
    {
      id: 28786,
      name: "Scipio",
    },
    {
      id: 28787,
      name: "Sevier",
    },
    {
      id: 28788,
      name: "Sigurd",
    },
    {
      id: 28789,
      name: "Smithfield",
    },
    {
      id: 28790,
      name: "Snowville",
    },
    {
      id: 28791,
      name: "South Jordan",
    },
    {
      id: 28792,
      name: "Spanish Fork",
    },
    {
      id: 28793,
      name: "Spring City",
    },
    {
      id: 28794,
      name: "Springdale",
    },
    {
      id: 28795,
      name: "Springville",
    },
    {
      id: 28796,
      name: "Sterling",
    },
    {
      id: 28797,
      name: "Stockton",
    },
    {
      id: 28798,
      name: "Summit",
    },
    {
      id: 28799,
      name: "Sunnyside",
    },
    {
      id: 28800,
      name: "Syracuse",
    },
    {
      id: 28801,
      name: "Tabiona",
    },
    {
      id: 28802,
      name: "Talmage",
    },
    {
      id: 28803,
      name: "Teasdale",
    },
    {
      id: 28804,
      name: "Thompson",
    },
    {
      id: 28805,
      name: "Tooele",
    },
    {
      id: 28806,
      name: "Toquerville",
    },
    {
      id: 28807,
      name: "Torrey",
    },
    {
      id: 28808,
      name: "Tremonton",
    },
    {
      id: 28809,
      name: "Trenton",
    },
    {
      id: 28810,
      name: "Tridell",
    },
    {
      id: 28811,
      name: "Tropic",
    },
    {
      id: 28812,
      name: "Vernal",
    },
    {
      id: 28813,
      name: "Vernon",
    },
    {
      id: 28814,
      name: "Veyo",
    },
    {
      id: 28815,
      name: "Virgin",
    },
    {
      id: 28816,
      name: "Wales",
    },
    {
      id: 28817,
      name: "Wallsburg",
    },
    {
      id: 28818,
      name: "Washington",
    },
    {
      id: 28819,
      name: "Wellington",
    },
    {
      id: 28820,
      name: "Wellsville",
    },
    {
      id: 28821,
      name: "Wendover",
    },
    {
      id: 28822,
      name: "West Jordan",
    },
    {
      id: 28823,
      name: "Whiterocks",
    },
    {
      id: 28824,
      name: "Willard",
    },
    {
      id: 28825,
      name: "Woodruff",
    },
    {
      id: 28826,
      name: "Woods Cross",
    },
    {
      id: 32316,
      name: "North Logan",
    },
    {
      id: 32317,
      name: "Navajo Mountain",
    },
    {
      id: 32318,
      name: "Washington Terrace",
    },
    {
      id: 32319,
      name: "West Valley City",
    },
    {
      id: 32366,
      name: "Rocky Ridge"
    }
  ]
}