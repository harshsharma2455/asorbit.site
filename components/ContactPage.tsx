import React, { useState, FormEvent, useEffect } from 'react';

// --- Static Data ---
const aiFacts = [
    "AI-powered chatbots now handle over 80% of routine customer service queries in some industries.",
    "Businesses using AI for predictive analytics see up to 20% higher sales conversions.",
    "AI is saving companies millions by automating repetitive back-office tasks.",
    "AI can analyze supply chain risks 24/7, preventing costly bottlenecks.",
    "AI enables hyper-personalized marketing, boosting engagement by up to 40%.",
    "AI prevents billions in fraud each year for banks and e-commerce platforms.",
    "AI can cut hiring time in half with smart resume screening.",
    "35% of Amazon's sales come from AI recommendation engines.",
    "AI-powered robots improve safety and efficiency in manufacturing plants.",
    "AI helps businesses track ESG and sustainability goals in real time.",
    "AI can process customer feedback at scale to improve product design.",
    "AI-driven energy optimization lowers utility costs for large facilities.",
    "Insurers now use AI to detect fraudulent claims in seconds.",
    "AI is powering dynamic video ads tailored to individual viewer interests.",
    "AI speech recognition improves call center productivity by over 30%.",
    "AI-backed forecasting reduces excess inventory and boosts profits.",
    "AI cybersecurity systems detect threats faster than humans ever could.",
    "Predictive AI maintenance saves airlines and factories millions in downtime.",
    "CFOs now rely on AI to provide real-time financial insights.",
    "AI-powered dynamic pricing helps airlines and hotels maximize revenue.",
    "70% of consumers prefer interacting with businesses using AI assistants for instant support.",
    "Creative teams use AI for idea generation, content drafts, and design suggestions.",
    "AI helps HR predict employee turnover before it happens.",
    "AI translation tools allow businesses to expand globally without language barriers.",
    "AI detects insider risks by spotting unusual digital behaviors.",
    "AI optimizes last-mile deliveries, cutting logistics costs by 10–15%.",
    "Energy companies use AI to predict demand and reduce waste.",
    "Investment firms use AI algorithms to make faster and smarter trading decisions.",
    "AI powers virtual try-ons, boosting e-commerce purchase confidence.",
    "AI is redefining business strategy by providing real-time scenario planning.",
];

const countries = [
  "United States", "United Kingdom", "Canada", "Australia", "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic of the", "Congo, Republic of the", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const countryTimezones: { [key: string]: string[] } = {
    "Afghanistan": ["(GMT+04:30) Asia/Kabul"],
    "Albania": ["(GMT+01:00) Europe/Tirane"],
    "Algeria": ["(GMT+01:00) Africa/Algiers"],
    "Andorra": ["(GMT+01:00) Europe/Andorra"],
    "Angola": ["(GMT+01:00) Africa/Luanda"],
    "Antigua and Barbuda": ["(GMT-04:00) America/Antigua"],
    "Argentina": ["(GMT-03:00) America/Argentina/Buenos_Aires", "(GMT-03:00) America/Argentina/Cordoba", "(GMT-03:00) America/Argentina/Salta", "(GMT-03:00) America/Argentina/Jujuy", "(GMT-03:00) America/Argentina/Tucuman", "(GMT-03:00) America/Argentina/Catamarca", "(GMT-03:00) America/Argentina/La_Rioja", "(GMT-03:00) America/Argentina/San_Juan", "(GMT-03:00) America/Argentina/Mendoza", "(GMT-03:00) America/Argentina/San_Luis", "(GMT-03:00) America/Argentina/Rio_Gallegos", "(GMT-03:00) America/Argentina/Ushuaia"],
    "Armenia": ["(GMT+04:00) Asia/Yerevan"],
    "Australia": ["(GMT+10:00) Australia/Lord_Howe", "(GMT+10:00) Antarctica/Macquarie", "(GMT+10:00) Australia/Hobart", "(GMT+10:00) Australia/Currie", "(GMT+10:00) Australia/Melbourne", "(GMT+10:00) Australia/Sydney", "(GMT+10:00) Australia/Broken_Hill", "(GMT+09:30) Australia/Darwin", "(GMT+09:30) Australia/Adelaide", "(GMT+08:00) Australia/Perth", "(GMT+10:00) Australia/Lindeman", "(GMT+10:00) Australia/Brisbane", "(GMT+08:45) Australia/Eucla"],
    "Austria": ["(GMT+01:00) Europe/Vienna"],
    "Azerbaijan": ["(GMT+04:00) Asia/Baku"],
    "Bahamas": ["(GMT-05:00) America/Nassau"],
    "Bahrain": ["(GMT+03:00) Asia/Bahrain"],
    "Bangladesh": ["(GMT+06:00) Asia/Dhaka"],
    "Barbados": ["(GMT-04:00) America/Barbados"],
    "Belarus": ["(GMT+03:00) Europe/Minsk"],
    "Belgium": ["(GMT+01:00) Europe/Brussels"],
    "Belize": ["(GMT-06:00) America/Belize"],
    "Benin": ["(GMT+01:00) Africa/Porto-Novo"],
    "Bhutan": ["(GMT+06:00) Asia/Thimphu"],
    "Bolivia": ["(GMT-04:00) America/La_Paz"],
    "Bosnia and Herzegovina": ["(GMT+01:00) Europe/Sarajevo"],
    "Botswana": ["(GMT+02:00) Africa/Gaborone"],
    "Brazil": ["(GMT-02:00) America/Noronha", "(GMT-03:00) America/Belem", "(GMT-03:00) America/Fortaleza", "(GMT-03:00) America/Recife", "(GMT-03:00) America/Araguaina", "(GMT-03:00) America/Maceio", "(GMT-03:00) America/Bahia", "(GMT-03:00) America/Sao_Paulo", "(GMT-04:00) America/Campo_Grande", "(GMT-04:00) America/Cuiaba", "(GMT-03:00) America/Santarem", "(GMT-04:00) America/Porto_Velho", "(GMT-04:00) America/Boa_Vista", "(GMT-04:00) America/Manaus", "(GMT-05:00) America/Eirunepe", "(GMT-05:00) America/Rio_Branco"],
    "Brunei": ["(GMT+08:00) Asia/Brunei"],
    "Bulgaria": ["(GMT+02:00) Europe/Sofia"],
    "Burkina Faso": ["(GMT+00:00) Africa/Ouagadougou"],
    "Burundi": ["(GMT+02:00) Africa/Bujumbura"],
    "Cabo Verde": ["(GMT-01:00) Atlantic/Cape_Verde"],
    "Cambodia": ["(GMT+07:00) Asia/Phnom_Penh"],
    "Cameroon": ["(GMT+01:00) Africa/Douala"],
    "Canada": ["(GMT-03:30) America/St_Johns", "(GMT-04:00) America/Halifax", "(GMT-04:00) America/Glace_Bay", "(GMT-04:00) America/Moncton", "(GMT-04:00) America/Goose_Bay", "(GMT-05:00) America/Toronto", "(GMT-05:00) America/Nipigon", "(GMT-05:00) America/Thunder_Bay", "(GMT-05:00) America/Iqaluit", "(GMT-05:00) America/Pangnirtung", "(GMT-06:00) America/Winnipeg", "(GMT-06:00) America/Rainy_River", "(GMT-06:00) America/Resolute", "(GMT-06:00) America/Rankin_Inlet", "(GMT-07:00) America/Regina", "(GMT-07:00) America/Swift_Current", "(GMT-07:00) America/Edmonton", "(GMT-07:00) America/Cambridge_Bay", "(GMT-07:00) America/Yellowknife", "(GMT-07:00) America/Inuvik", "(GMT-07:00) America/Creston", "(GMT-07:00) America/Dawson_Creek", "(GMT-07:00) America/Fort_Nelson", "(GMT-08:00) America/Vancouver", "(GMT-08:00) America/Whitehorse", "(GMT-08:00) America/Dawson"],
    "Central African Republic": ["(GMT+01:00) Africa/Bangui"],
    "Chad": ["(GMT+01:00) Africa/Ndjamena"],
    "Chile": ["(GMT-04:00) America/Santiago", "(GMT-04:00) America/Punta_Arenas", "(GMT-05:00) Pacific/Easter"],
    "China": ["(GMT+08:00) Asia/Shanghai", "(GMT+06:00) Asia/Urumqi"],
    "Colombia": ["(GMT-05:00) America/Bogota"],
    "Comoros": ["(GMT+03:00) Indian/Comoro"],
    "Congo, Democratic Republic of the": ["(GMT+01:00) Africa/Kinshasa", "(GMT+02:00) Africa/Lubumbashi"],
    "Congo, Republic of the": ["(GMT+01:00) Africa/Brazzaville"],
    "Costa Rica": ["(GMT-06:00) America/Costa_Rica"],
    "Croatia": ["(GMT+01:00) Europe/Zagreb"],
    "Cuba": ["(GMT-05:00) America/Havana"],
    "Cyprus": ["(GMT+02:00) Asia/Nicosia", "(GMT+02:00) Asia/Famagusta"],
    "Czech Republic": ["(GMT+01:00) Europe/Prague"],
    "Denmark": ["(GMT+01:00) Europe/Copenhagen"],
    "Djibouti": ["(GMT+03:00) Africa/Djibouti"],
    "Dominica": ["(GMT-04:00) America/Dominica"],
    "Dominican Republic": ["(GMT-04:00) America/Santo_Domingo"],
    "Ecuador": ["(GMT-05:00) America/Guayaquil", "(GMT-06:00) Pacific/Galapagos"],
    "Egypt": ["(GMT+02:00) Africa/Cairo"],
    "El Salvador": ["(GMT-06:00) America/El_Salvador"],
    "Equatorial Guinea": ["(GMT+01:00) Africa/Malabo"],
    "Eritrea": ["(GMT+03:00) Africa/Asmara"],
    "Estonia": ["(GMT+02:00) Europe/Tallinn"],
    "Eswatini": ["(GMT+02:00) Africa/Mbabane"],
    "Ethiopia": ["(GMT+03:00) Africa/Addis_Ababa"],
    "Fiji": ["(GMT+12:00) Pacific/Fiji"],
    "Finland": ["(GMT+02:00) Europe/Helsinki"],
    "France": ["(GMT+01:00) Europe/Paris"],
    "Gabon": ["(GMT+01:00) Africa/Libreville"],
    "Gambia": ["(GMT+00:00) Africa/Banjul"],
    "Georgia": ["(GMT+04:00) Asia/Tbilisi"],
    "Germany": ["(GMT+01:00) Europe/Berlin", "(GMT+01:00) Europe/Busingen"],
    "Ghana": ["(GMT+00:00) Africa/Accra"],
    "Greece": ["(GMT+02:00) Europe/Athens"],
    "Grenada": ["(GMT-04:00) America/Grenada"],
    "Guatemala": ["(GMT-06:00) America/Guatemala"],
    "Guinea": ["(GMT+00:00) Africa/Conakry"],
    "Guinea-Bissau": ["(GMT+00:00) Africa/Bissau"],
    "Guyana": ["(GMT-04:00) America/Guyana"],
    "Haiti": ["(GMT-05:00) America/Port-au-Prince"],
    "Honduras": ["(GMT-06:00) America/Tegucigalpa"],
    "Hungary": ["(GMT+01:00) Europe/Budapest"],
    "Iceland": ["(GMT+00:00) Atlantic/Reykjavik"],
    "India": ["(GMT+05:30) Asia/Kolkata"],
    "Indonesia": ["(GMT+07:00) Asia/Jakarta", "(GMT+07:00) Asia/Pontianak", "(GMT+08:00) Asia/Makassar", "(GMT+09:00) Asia/Jayapura"],
    "Iran": ["(GMT+03:30) Asia/Tehran"],
    "Iraq": ["(GMT+03:00) Asia/Baghdad"],
    "Ireland": ["(GMT+00:00) Europe/Dublin"],
    "Israel": ["(GMT+02:00) Asia/Jerusalem"],
    "Italy": ["(GMT+01:00) Europe/Rome"],
    "Jamaica": ["(GMT-05:00) America/Jamaica"],
    "Japan": ["(GMT+09:00) Asia/Tokyo"],
    "Jordan": ["(GMT+02:00) Asia/Amman"],
    "Kazakhstan": ["(GMT+05:00) Asia/Aqtau", "(GMT+05:00) Asia/Aqtobe", "(GMT+05:00) Asia/Atyrau", "(GMT+05:00) Asia/Oral", "(GMT+05:00) Asia/Qyzylorda", "(GMT+06:00) Asia/Almaty", "(GMT+06:00) Asia/Qostanay"],
    "Kenya": ["(GMT+03:00) Africa/Nairobi"],
    "Kiribati": ["(GMT+12:00) Pacific/Tarawa", "(GMT+13:00) Pacific/Kanton", "(GMT+14:00) Pacific/Kiritimati"],
    "Kuwait": ["(GMT+03:00) Asia/Kuwait"],
    "Kyrgyzstan": ["(GMT+06:00) Asia/Bishkek"],
    "Laos": ["(GMT+07:00) Asia/Vientiane"],
    "Latvia": ["(GMT+02:00) Europe/Riga"],
    "Lebanon": ["(GMT+02:00) Asia/Beirut"],
    "Lesotho": ["(GMT+02:00) Africa/Maseru"],
    "Liberia": ["(GMT+00:00) Africa/Monrovia"],
    "Libya": ["(GMT+02:00) Africa/Tripoli"],
    "Liechtenstein": ["(GMT+01:00) Europe/Vaduz"],
    "Lithuania": ["(GMT+02:00) Europe/Vilnius"],
    "Luxembourg": ["(GMT+01:00) Europe/Luxembourg"],
    "Madagascar": ["(GMT+03:00) Indian/Antananarivo"],
    "Malawi": ["(GMT+02:00) Africa/Blantyre"],
    "Malaysia": ["(GMT+08:00) Asia/Kuala_Lumpur", "(GMT+08:00) Asia/Kuching"],
    "Maldives": ["(GMT+05:00) Indian/Maldives"],
    "Mali": ["(GMT+00:00) Africa/Bamako"],
    "Malta": ["(GMT+01:00) Europe/Malta"],
    "Marshall Islands": ["(GMT+12:00) Pacific/Majuro", "(GMT+12:00) Pacific/Kwajalein"],
    "Mauritania": ["(GMT+00:00) Africa/Nouakchott"],
    "Mauritius": ["(GMT+04:00) Indian/Mauritius"],
    "Mexico": ["(GMT-06:00) America/Mexico_City", "(GMT-06:00) America/Cancun", "(GMT-06:00) America/Merida", "(GMT-06:00) America/Monterrey", "(GMT-06:00) America/Matamoros", "(GMT-07:00) America/Mazatlan", "(GMT-07:00) America/Chihuahua", "(GMT-07:00) America/Ojinaga", "(GMT-07:00) America/Hermosillo", "(GMT-08:00) America/Tijuana", "(GMT-06:00) America/Bahia_Banderas"],
    "Micronesia": ["(GMT+11:00) Pacific/Kosrae", "(GMT+11:00) Pacific/Pohnpei", "(GMT+10:00) Pacific/Chuuk"],
    "Moldova": ["(GMT+02:00) Europe/Chisinau"],
    "Monaco": ["(GMT+01:00) Europe/Monaco"],
    "Mongolia": ["(GMT+08:00) Asia/Ulaanbaatar", "(GMT+07:00) Asia/Hovd", "(GMT+08:00) Asia/Choibalsan"],
    "Montenegro": ["(GMT+01:00) Europe/Podgorica"],
    "Morocco": ["(GMT+01:00) Africa/Casablanca"],
    "Mozambique": ["(GMT+02:00) Africa/Maputo"],
    "Myanmar": ["(GMT+06:30) Asia/Yangon"],
    "Namibia": ["(GMT+02:00) Africa/Windhoek"],
    "Nauru": ["(GMT+12:00) Pacific/Nauru"],
    "Nepal": ["(GMT+05:45) Asia/Kathmandu"],
    "Netherlands": ["(GMT+01:00) Europe/Amsterdam"],
    "New Zealand": ["(GMT+12:00) Pacific/Auckland", "(GMT+12:45) Pacific/Chatham"],
    "Nicaragua": ["(GMT-06:00) America/Managua"],
    "Niger": ["(GMT+01:00) Africa/Niamey"],
    "Nigeria": ["(GMT+01:00) Africa/Lagos"],
    "North Korea": ["(GMT+09:00) Asia/Pyongyang"],
    "North Macedonia": ["(GMT+01:00) Europe/Skopje"],
    "Norway": ["(GMT+01:00) Europe/Oslo"],
    "Oman": ["(GMT+04:00) Asia/Muscat"],
    "Pakistan": ["(GMT+05:00) Asia/Karachi"],
    "Palau": ["(GMT+09:00) Pacific/Palau"],
    "Palestine State": ["(GMT+02:00) Asia/Gaza", "(GMT+02:00) Asia/Hebron"],
    "Panama": ["(GMT-05:00) America/Panama"],
    "Papua New Guinea": ["(GMT+10:00) Pacific/Port_Moresby", "(GMT+11:00) Pacific/Bougainville"],
    "Paraguay": ["(GMT-04:00) America/Asuncion"],
    "Peru": ["(GMT-05:00) America/Lima"],
    "Philippines": ["(GMT+08:00) Asia/Manila"],
    "Poland": ["(GMT+01:00) Europe/Warsaw"],
    "Portugal": ["(GMT+00:00) Europe/Lisbon", "(GMT+00:00) Atlantic/Madeira", "(GMT-01:00) Atlantic/Azores"],
    "Qatar": ["(GMT+03:00) Asia/Qatar"],
    "Romania": ["(GMT+02:00) Europe/Bucharest"],
    "Russia": ["(GMT+02:00) Europe/Kaliningrad", "(GMT+03:00) Europe/Moscow", "(GMT+03:00) Europe/Kirov", "(GMT+04:00) Europe/Volgograd", "(GMT+04:00) Europe/Astrakhan", "(GMT+04:00) Europe/Saratov", "(GMT+04:00) Europe/Ulyanovsk", "(GMT+04:00) Europe/Samara", "(GMT+05:00) Asia/Yekaterinburg", "(GMT+06:00) Asia/Omsk", "(GMT+07:00) Asia/Novosibirsk", "(GMT+07:00) Asia/Barnaul", "(GMT+07:00) Asia/Tomsk", "(GMT+07:00) Asia/Novokuznetsk", "(GMT+07:00) Asia/Krasnoyarsk", "(GMT+08:00) Asia/Irkutsk", "(GMT+09:00) Asia/Chita", "(GMT+09:00) Asia/Yakutsk", "(GMT+09:00) Asia/Khandyga", "(GMT+10:00) Asia/Vladivostok", "(GMT+11:00) Asia/Magadan", "(GMT+11:00) Asia/Sakhalin", "(GMT+11:00) Asia/Srednekolymsk", "(GMT+12:00) Asia/Kamchatka", "(GMT+12:00) Asia/Anadyr"],
    "Rwanda": ["(GMT+02:00) Africa/Kigali"],
    "Saint Kitts and Nevis": ["(GMT-04:00) America/St_Kitts"],
    "Saint Lucia": ["(GMT-04:00) America/St_Lucia"],
    "Saint Vincent and the Grenadines": ["(GMT-04:00) America/St_Vincent"],
    "Samoa": ["(GMT+13:00) Pacific/Apia"],
    "San Marino": ["(GMT+01:00) Europe/San_Marino"],
    "Sao Tome and Principe": ["(GMT+00:00) Africa/Sao_Tome"],
    "Saudi Arabia": ["(GMT+03:00) Asia/Riyadh"],
    "Senegal": ["(GMT+00:00) Africa/Dakar"],
    "Serbia": ["(GMT+01:00) Europe/Belgrade"],
    "Seychelles": ["(GMT+04:00) Indian/Mahe"],
    "Sierra Leone": ["(GMT+00:00) Africa/Freetown"],
    "Singapore": ["(GMT+08:00) Asia/Singapore"],
    "Slovakia": ["(GMT+01:00) Europe/Bratislava"],
    "Slovenia": ["(GMT+01:00) Europe/Ljubljana"],
    "Solomon Islands": ["(GMT+11:00) Pacific/Guadalcanal"],
    "Somalia": ["(GMT+03:00) Africa/Mogadishu"],
    "South Africa": ["(GMT+02:00) Africa/Johannesburg"],
    "South Korea": ["(GMT+09:00) Asia/Seoul"],
    "South Sudan": ["(GMT+02:00) Africa/Juba"],
    "Spain": ["(GMT+01:00) Europe/Madrid", "(GMT+01:00) Africa/Ceuta", "(GMT+00:00) Atlantic/Canary"],
    "Sri Lanka": ["(GMT+05:30) Asia/Colombo"],
    "Sudan": ["(GMT+02:00) Africa/Khartoum"],
    "Suriname": ["(GMT-03:00) America/Paramaribo"],
    "Sweden": ["(GMT+01:00) Europe/Stockholm"],
    "Switzerland": ["(GMT+01:00) Europe/Zurich"],
    "Syria": ["(GMT+02:00) Asia/Damascus"],
    "Taiwan": ["(GMT+08:00) Asia/Taipei"],
    "Tajikistan": ["(GMT+05:00) Asia/Dushanbe"],
    "Tanzania": ["(GMT+03:00) Africa/Dar_es_Salaam"],
    "Thailand": ["(GMT+07:00) Asia/Bangkok"],
    "Timor-Leste": ["(GMT+09:00) Asia/Dili"],
    "Togo": ["(GMT+00:00) Africa/Lome"],
    "Tonga": ["(GMT+13:00) Pacific/Tongatapu"],
    "Trinidad and Tobago": ["(GMT-04:00) America/Port_of_Spain"],
    "Tunisia": ["(GMT+01:00) Africa/Tunis"],
    "Turkey": ["(GMT+03:00) Europe/Istanbul"],
    "Turkmenistan": ["(GMT+05:00) Asia/Ashgabat"],
    "Tuvalu": ["(GMT+12:00) Pacific/Funafuti"],
    "Uganda": ["(GMT+03:00) Africa/Kampala"],
    "Ukraine": ["(GMT+02:00) Europe/Simferopol", "(GMT+02:00) Europe/Kyiv"],
    "United Arab Emirates": ["(GMT+04:00) Asia/Dubai"],
    "United Kingdom": ["(GMT+00:00) Europe/London"],
    "United States": ["(GMT-05:00) America/New_York", "(GMT-05:00) America/Detroit", "(GMT-05:00) America/Kentucky/Louisville", "(GMT-05:00) America/Kentucky/Monticello", "(GMT-05:00) America/Indiana/Indianapolis", "(GMT-05:00) America/Indiana/Vincennes", "(GMT-05:00) America/Indiana/Winamac", "(GMT-05:00) America/Indiana/Marengo", "(GMT-05:00) America/Indiana/Petersburg", "(GMT-05:00) America/Indiana/Vevay", "(GMT-06:00) America/Chicago", "(GMT-06:00) America/Indiana/Tell_City", "(GMT-06:00) America/Indiana/Knox", "(GMT-06:00) America/Menominee", "(GMT-06:00) America/North_Dakota/Center", "(GMT-06:00) America/North_Dakota/New_Salem", "(GMT-06:00) America/North_Dakota/Beulah", "(GMT-07:00) America/Denver", "(GMT-07:00) America/Boise", "(GMT-07:00) America/Phoenix", "(GMT-08:00) America/Los_Angeles", "(GMT-09:00) America/Anchorage", "(GMT-09:00) America/Juneau", "(GMT-09:00) America/Sitka", "(GMT-09:00) America/Yakutat", "(GMT-09:00) America/Nome", "(GMT-10:00) America/Adak", "(GMT-10:00) Pacific/Honolulu"],
    "Uruguay": ["(GMT-03:00) America/Montevideo"],
    "Uzbekistan": ["(GMT+05:00) Asia/Samarkand", "(GMT+05:00) Asia/Tashkent"],
    "Vanuatu": ["(GMT+11:00) Pacific/Efate"],
    "Vatican City": ["(GMT+01:00) Europe/Vatican"],
    "Venezuela": ["(GMT-04:00) America/Caracas"],
    "Vietnam": ["(GMT+07:00) Asia/Ho_Chi_Minh"],
    "Yemen": ["(GMT+03:00) Asia/Aden"],
    "Zambia": ["(GMT+02:00) Africa/Lusaka"],
    "Zimbabwe": ["(GMT+02:00) Africa/Harare"]
};

// --- AUTO-DETECTION: Timezone to Country mapping ---
const timezoneToCountry: { [key: string]: string } = {
    // Americas
    "America/New_York": "United States",
    "America/Chicago": "United States", 
    "America/Denver": "United States",
    "America/Los_Angeles": "United States",
    "America/Anchorage": "United States",
    "America/Detroit": "United States",
    "America/Phoenix": "United States",
    "Pacific/Honolulu": "United States",
    "America/Toronto": "Canada",
    "America/Vancouver": "Canada",
    "America/Montreal": "Canada",
    "America/Halifax": "Canada",
    "America/Mexico_City": "Mexico",
    "America/Sao_Paulo": "Brazil",
    "America/Buenos_Aires": "Argentina",
    "America/Lima": "Peru",
    "America/Bogota": "Colombia",
    "America/Santiago": "Chile",
    
    // Europe
    "Europe/London": "United Kingdom",
    "Europe/Berlin": "Germany",
    "Europe/Paris": "France",
    "Europe/Rome": "Italy",
    "Europe/Madrid": "Spain",
    "Europe/Amsterdam": "Netherlands",
    "Europe/Brussels": "Belgium",
    "Europe/Vienna": "Austria",
    "Europe/Stockholm": "Sweden",
    "Europe/Copenhagen": "Denmark",
    "Europe/Oslo": "Norway",
    "Europe/Helsinki": "Finland",
    "Europe/Warsaw": "Poland",
    "Europe/Prague": "Czech Republic",
    "Europe/Budapest": "Hungary",
    "Europe/Bucharest": "Romania",
    "Europe/Athens": "Greece",
    "Europe/Istanbul": "Turkey",
    "Europe/Moscow": "Russia",
    "Europe/Kiev": "Ukraine",
    "Europe/Zurich": "Switzerland",
    "Europe/Dublin": "Ireland",
    "Europe/Lisbon": "Portugal",
    
    // Asia
    "Asia/Tokyo": "Japan",
    "Asia/Shanghai": "China",
    "Asia/Seoul": "South Korea",
    "Asia/Singapore": "Singapore",
    "Asia/Hong_Kong": "China",
    "Asia/Bangkok": "Thailand",
    "Asia/Manila": "Philippines",
    "Asia/Jakarta": "Indonesia",
    "Asia/Kuala_Lumpur": "Malaysia",
    "Asia/Ho_Chi_Minh": "Vietnam",
    "Asia/Kolkata": "India",
    "Asia/Mumbai": "India",
    "Asia/Dubai": "United Arab Emirates",
    "Asia/Tehran": "Iran",
    "Asia/Baghdad": "Iraq",
    "Asia/Jerusalem": "Israel",
    "Asia/Riyadh": "Saudi Arabia",
    "Asia/Kuwait": "Kuwait",
    "Asia/Qatar": "Qatar",
    "Asia/Karachi": "Pakistan",
    "Asia/Dhaka": "Bangladesh",
    "Asia/Kabul": "Afghanistan",
    "Asia/Tashkent": "Uzbekistan",
    "Asia/Almaty": "Kazakhstan",
    "Asia/Yerevan": "Armenia",
    "Asia/Baku": "Azerbaijan",
    "Asia/Tbilisi": "Georgia",
    
    // Africa
    "Africa/Cairo": "Egypt",
    "Africa/Lagos": "Nigeria",
    "Africa/Johannesburg": "South Africa",
    "Africa/Casablanca": "Morocco",
    "Africa/Nairobi": "Kenya",
    "Africa/Tunis": "Tunisia",
    "Africa/Algiers": "Algeria",
    "Africa/Addis_Ababa": "Ethiopia",
    
    // Oceania
    "Australia/Sydney": "Australia",
    "Australia/Melbourne": "Australia",
    "Australia/Brisbane": "Australia",
    "Australia/Perth": "Australia",
    "Australia/Adelaide": "Australia",
    "Pacific/Auckland": "New Zealand",
    "Pacific/Fiji": "Fiji",
};

// --- Helper function to get country from timezone ---
const getCountryFromTimezone = (timezone: string): string => {
    return timezoneToCountry[timezone] || '';
};

// --- Helper function to format timezone for display ---
const formatTimezoneForDisplay = (timezone: string): string => {
    try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en', {
            timeZone: timezone,
            timeZoneName: 'short'
        });
        const parts = formatter.formatToParts(now);
        const timeZoneName = parts.find(part => part.type === 'timeZoneName')?.value || '';
        
        // Get offset
        const offsetMinutes = -new Date().getTimezoneOffset();
        const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
        const offsetMins = Math.abs(offsetMinutes) % 60;
        const offsetSign = offsetMinutes >= 0 ? '+' : '-';
        const offsetStr = `GMT${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMins).padStart(2, '0')}`;
        
        return `(${offsetStr}) ${timezone}`;
    } catch {
        return timezone;
    }
};

// --- Calendar Component ---
const Calendar: React.FC<{
    selectedDate: Date;
    onDateSelect: (date: Date) => void;
    selectedTime: string | null;
    onTimeSelect: (time: string | null) => void;
    timeError?: string;
}> = ({ selectedDate, onDateSelect, selectedTime, onTimeSelect, timeError }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const addDays = (date: Date, days: number) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    };

    const isSameDay = (d1: Date, d2: Date) => {
        return d1.getFullYear() === d2.getFullYear() &&
               d1.getMonth() === d2.getMonth() &&
               d1.getDate() === d2.getDate();
    };

    const weekDays = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(currentDate);
        const day = d.getDay();
        const diff = d.getDate() - day + i;
        return new Date(d.setDate(diff));
    });
    
    const availableTimes = [
        "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
        "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
    ];

    const handlePrevWeek = () => setCurrentDate(addDays(currentDate, -7));
    const handleNextWeek = () => setCurrentDate(addDays(currentDate, 7));
    
    const handleDateSelect = (date: Date) => {
        onDateSelect(date);
        onTimeSelect(null);
    };

    return (
        <div className="bg-white/60 backdrop-blur-lg p-6 md:p-8 rounded-2xl border border-[var(--border-primary)] shadow-[var(--shadow-custom-lg)] w-full">
            <div className="flex justify-between items-center mb-6">
                <button onClick={handlePrevWeek} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h3 className="text-lg font-semibold text-slate-800 text-center">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h3>
                <button onClick={handleNextWeek} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
                {weekDays.map(day => (
                    <button 
                        key={day.toISOString()}
                        onClick={() => handleDateSelect(day)}
                        className={`p-1 sm:p-2 rounded-lg transition-colors group ${isSameDay(day, selectedDate) ? 'bg-indigo-600 text-white font-bold shadow-md' : 'hover:bg-slate-100'}`}
                    >
                        <div className={`text-xs font-medium ${isSameDay(day, selectedDate) ? 'text-indigo-100' : 'text-slate-500 group-hover:text-slate-700'}`}>{day.toLocaleDateString('default', { weekday: 'short' })}</div>
                        <div className={`mt-1 text-lg font-semibold ${isSameDay(day, selectedDate) ? 'text-white' : 'text-slate-800'}`}>{day.getDate()}</div>
                    </button>
                ))}
            </div>

            <div className="mt-8 border-t border-slate-200 pt-6">
                 <h4 className="font-semibold text-slate-700 mb-4 text-center">Available Slots for {selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}</h4>
                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pr-2">
                     {availableTimes.map(time => (
                         <button
                             key={time}
                             onClick={() => onTimeSelect(time)}
                             className={`p-3 w-full text-center text-sm font-semibold rounded-lg transition-all duration-200 border-2 ${selectedTime === time ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white/80 border-slate-200 text-indigo-700 hover:border-indigo-400 hover:bg-indigo-50'}`}
                         >
                             {time}
                         </button>
                     ))}
                 </div>
                 {timeError && <p className="text-red-500 text-xs mt-3 text-center">{timeError}</p>}
            </div>
        </div>
    );
};

// --- FormInput Component ---
const FormInput: React.FC<{
    id: string;
    name: string;
    type: string;
    label: string;
    autoComplete?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}> = ({ id, name, type, label, autoComplete, value, onChange, error }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
            {label}
        </label>
        <div className="mt-1">
            <input
                type={type}
                name={name}
                id={id}
                autoComplete={autoComplete}
                value={value}
                onChange={onChange}
                className={`block w-full px-4 py-3 bg-white/80 border rounded-lg shadow-sm placeholder-slate-400 transition-shadow
                            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                            ${error ? 'border-red-400' : 'border-slate-300'}`}
            />
        </div>
        {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
    </div>
);

// --- FormSelect Component ---
const FormSelect: React.FC<{
    id: string;
    name: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    error?: string;
    children: React.ReactNode;
    autoComplete?: string;
    disabled?: boolean;
}> = ({ id, name, label, value, onChange, error, children, autoComplete, disabled = false }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
            {label}
        </label>
        <div className="mt-1 relative">
            <select
                name={name}
                id={id}
                value={value}
                onChange={onChange}
                autoComplete={autoComplete}
                disabled={disabled}
                className={`block w-full px-4 py-3 bg-white/80 border rounded-lg shadow-sm transition-shadow appearance-none
                            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                            ${error ? 'border-red-400' : 'border-slate-300'} ${!value ? 'text-slate-400' : 'text-slate-900'}
                            ${disabled ? 'bg-slate-50 cursor-not-allowed' : ''}`}
            >
                {children}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                 <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </div>
        </div>
        {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
    </div>
);

// --- FormTextarea Component ---
const FormTextarea: React.FC<{
    id: string;
    name: string;
    label: string;
    rows: number;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    error?: string;
}> = ({ id, name, label, rows, value, onChange, error }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
            {label}
        </label>
        <div className="mt-1">
            <textarea
                name={name}
                id={id}
                rows={rows}
                value={value}
                onChange={onChange}
                className={`block w-full px-4 py-3 bg-white/80 border rounded-lg shadow-sm placeholder-slate-400 transition-shadow resize-none
                            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                            ${error ? 'border-red-400' : 'border-slate-300'}`}
            />
        </div>
        {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
    </div>
);

// --- ContactForm Component ---
interface FormData {
    name: string;
    email: string;
    industry: string;
    country: string;
    timezone: string;
    budget: string;
    outcome: string;
    message: string;
}

interface ContactFormProps {
    formData: FormData;
    errors: { [key: string]: string };
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onSubmit: (e: FormEvent) => void;
    isLoading: boolean;
    submitError: string | null;
    availableTimezones: string[];
}

const ContactForm: React.FC<ContactFormProps> = ({ formData, errors, onInputChange, onSubmit, isLoading, submitError, availableTimezones }) => {
    const isTimezoneDisabled = !formData.country || availableTimezones.length === 0;

    return (
        <div className="w-full">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Schedule a Consultation</h2>
            <p className="mt-3 text-lg text-slate-600 mb-8">
                Find a time that works for you, and let's discuss how AI can revolutionize your business.
            </p>
            <form onSubmit={onSubmit} className="space-y-6" noValidate>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                    <FormInput id="name" name="name" type="text" label="Name" autoComplete="name" value={formData.name} onChange={onInputChange} error={errors.name} />
                    <FormInput id="email" name="email" type="email" label="Email Address" autoComplete="email" value={formData.email} onChange={onInputChange} error={errors.email} />
                    <FormInput id="industry" name="industry" type="text" label="Industry" autoComplete="organization-title" value={formData.industry} onChange={onInputChange} error={errors.industry} />
                    
                    <FormSelect id="country" name="country" label="Country (Auto-detected)" autoComplete="country-name" value={formData.country} onChange={onInputChange} error={errors.country}>
                        <option value="" disabled>Select a country...</option>
                        {countries.map(c => <option key={c} value={c}>{c}</option>)}
                    </FormSelect>
                    
                    <FormSelect id="timezone" name="timezone" label="Time Zone (Auto-detected)" autoComplete="on" value={formData.timezone} onChange={onInputChange} error={errors.timezone} disabled={isTimezoneDisabled}>
                        <option value="" disabled>{formData.country ? 'Select a time zone...' : 'Select a country first'}</option>
                        {availableTimezones.map(t => <option key={t} value={t}>{t}</option>)}
                    </FormSelect>

                    <FormSelect id="budget" name="budget" label="How much are you willing to spend" value={formData.budget} onChange={onInputChange} error={errors.budget}>
                        <option value="" disabled>Select an amount...</option>
                        <option value="< $1000">&lt; $1,000</option>
                        <option value="$1000 - $2000">$1,000 - $2,000</option>
                        <option value="$2000 - $5000">$2,000 - $5,000</option>
                        <option value="$5000 - $10000">$5,000 - $10,000</option>
                        <option value="> $10000">&gt; $10,000</option>
                    </FormSelect>
                </div>

                <FormTextarea id="outcome" name="outcome" label="What kind of outcome do you want with AI?" rows={4} value={formData.outcome} onChange={onInputChange} error={errors.outcome} />
                <FormTextarea id="message" name="message" label="Message (optional)" rows={3} value={formData.message} onChange={onInputChange} error={errors.message} />

                <div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-lg text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-75 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Booking...
                            </>
                        ) : 'Confirm Appointment'}
                    </button>
                    {submitError && <p className="text-red-500 text-sm mt-4 text-center">{submitError}</p>}
                </div>
            </form>
        </div>
    );
};

// --- Main Page Component ---
const ContactPage: React.FC = () => {
    const [formStatus, setFormStatus] = useState<'editing' | 'submitted'>('editing');
    const [isLoading, setIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        industry: '',
        country: '',
        timezone: '',
        budget: '',
        outcome: '',
        message: '',
    });
    
    const [availableTimezones, setAvailableTimezones] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    
    // State for the rotating "Did you know?" facts
    const [currentFactIndex, setCurrentFactIndex] = useState(() => Math.floor(Math.random() * aiFacts.length));

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentFactIndex(prevIndex => (prevIndex + 1) % aiFacts.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);
    
    // --- AUTO-DETECTION EFFECT ---
    useEffect(() => {
        try {
            // Get user's timezone
            const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            console.log('Detected timezone:', userTimezone);
            
            // Get country from timezone
            const detectedCountry = getCountryFromTimezone(userTimezone);
            console.log('Detected country:', detectedCountry);
            
            if (detectedCountry && countryTimezones[detectedCountry]) {
                // Auto-populate country and timezone
                const countryTimezoneList = countryTimezones[detectedCountry];
                const formattedTimezone = formatTimezoneForDisplay(userTimezone);
                
                // Find matching timezone in the list, or use first one as fallback
                const matchingTimezone = countryTimezoneList.find(tz => tz.includes(userTimezone)) || countryTimezoneList[0];
                
                setFormData(prev => ({
                    ...prev,
                    country: detectedCountry,
                    timezone: matchingTimezone
                }));
                
                setAvailableTimezones(countryTimezoneList);
            }
        } catch (error) {
            console.log('Auto-detection failed:', error);
            // Fallback silently - user can still select manually
        }
    }, []);
    
    // Effect to update available timezones when country changes
    useEffect(() => {
        const selectedCountry = formData.country;
        if (selectedCountry && countryTimezones[selectedCountry]) {
            setAvailableTimezones(countryTimezones[selectedCountry]);
        } else {
            setAvailableTimezones([]);
        }
        // Reset timezone when country changes (except during auto-detection)
        if (selectedCountry && !formData.timezone.includes('GMT')) {
            setFormData(prev => ({ ...prev, timezone: '' }));
        }
    }, [formData.country]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };
    
    const handleTimeSelect = (time: string | null) => {
        setSelectedTime(time);
        if (errors.time) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.time;
                return newErrors;
            });
        }
    }
    
    const validate = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required.';
        if (!formData.email.trim()) {
            newErrors.email = 'Email Address is required.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please provide a valid email address.';
        }
        if (!formData.industry.trim()) newErrors.industry = 'Industry is required.';
        if (!formData.country) newErrors.country = 'Country is required.';
        if (!formData.timezone) newErrors.timezone = 'Time zone is required.';
        if (!formData.budget) newErrors.budget = 'Please select a budget.';
        if (!formData.outcome.trim()) newErrors.outcome = 'Please describe your desired outcome.';
        if (!selectedTime) newErrors.time = 'Please select an available time slot.';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      setSubmitError(null);
    
      if (validate()) {
        setIsLoading(true);
        try {
          const submissionData = {
            name: formData.name,
            email: formData.email,
            industry: formData.industry,
            country: formData.country,
            timezone: formData.timezone,
            budget: formData.budget,
            outcome: formData.outcome,
            message: formData.message,
            appointmentDate: selectedDate.toISOString().split('T')[0],
            appointmentTime: selectedTime || '',
            detectedTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Include raw timezone for reference
          };
    
          const proxyUrl = '/.netlify/functions/proxyWebhook';

          const response = await fetch(proxyUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(submissionData),
            });

    
          const resultText = await response.text();
          console.log("Webhook raw response:", response.status, resultText);
    
          if (!response.ok) {
            throw new Error(`Webhook submission failed with status: ${response.status}`);
          }
    
          try {
            const result = JSON.parse(resultText);
            console.log("Webhook parsed response:", result);
          } catch {
            console.warn("Response was not JSON:", resultText);
          }
    
          setFormStatus('submitted');
          window.scrollTo(0, 0);
    
        } catch (error: any) {
          console.error('Submission Error:', error);
          setSubmitError(error.message || 'Submission failed. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (formStatus === 'submitted') {
        return (
            <div key="contact-success" className="animate-fadeInUp pt-28 sm:pt-32 pb-16">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="bg-white/60 backdrop-blur-lg p-8 md:p-12 rounded-2xl border border-[var(--border-primary)] shadow-[var(--shadow-custom-lg)]">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                             <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="mt-6 text-3xl font-bold text-slate-900 sm:text-4xl">Appointment Booked!</h2>
                        <p className="mt-4 text-lg text-slate-600">
                            Thank you for scheduling a consultation. I have received your request and will send a confirmation to <span className="font-semibold text-indigo-600">{formData.email}</span> shortly.
                        </p>
                    </div>
                </div>
            </div>
        );
    }
    
    const factWithoutPrefix = aiFacts[currentFactIndex].replace(/^Did you know /i, '');

    return (
        <div key="contact" className="animate-fadeInUp pt-28 sm:pt-32 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative">
                    <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-start">
                        <div className="w-full md:w-1/2">
                            <Calendar 
                                selectedDate={selectedDate}
                                onDateSelect={setSelectedDate}
                                selectedTime={selectedTime}
                                onTimeSelect={handleTimeSelect}
                                timeError={errors.time}
                            />
                            <div className="mt-8 bg-indigo-50 border-l-4 border-indigo-300 p-5 rounded-r-lg shadow-[var(--shadow-custom)]">
                                <div className="flex items-start gap-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a7.5 7.5 0 01-7.5 0c-1.42 0-2.67-.34-3.75-.934m15.002 0c-1.08.594-2.33.934-3.75.934a7.5 7.5 0 01-7.5 0" />
                                    </svg>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-800">Did you know?</h4>
                                        <p className="mt-1 text-slate-600 transition-opacity duration-500">
                                            <span className="font-bold text-indigo-600">"</span>
                                            {factWithoutPrefix}
                                            <span className="font-bold text-indigo-600">"</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2">
                            <ContactForm 
                                formData={formData} 
                                errors={errors} 
                                onInputChange={handleInputChange} 
                                onSubmit={handleSubmit}
                                isLoading={isLoading}
                                submitError={submitError}
                                availableTimezones={availableTimezones}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
