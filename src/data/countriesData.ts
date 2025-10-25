
// Static country data with necessary information for international transfers
// This eliminates the dependency on the external REST Countries API

export interface Country {
    code: string;
    name: string;
    currency: string;
    flag: string;
    currencySymbol?: string;
  }
  
  // Array of major countries with their currency information
  export const countriesData: Country[] = [
    {
      code: "US",
      name: "United States",
      currency: "USD",
      currencySymbol: "$",
      flag: "https://flagcdn.com/w80/us.png"
    },
    {
      code: "GB",
      name: "United Kingdom",
      currency: "GBP",
      currencySymbol: "£",
      flag: "https://flagcdn.com/w80/gb.png"
    },
    {
      code: "EU",
      name: "European Union",
      currency: "EUR",
      currencySymbol: "€",
      flag: "https://flagcdn.com/w80/eu.png"
    },
    {
      code: "CA",
      name: "Canada",
      currency: "CAD",
      currencySymbol: "C$",
      flag: "https://flagcdn.com/w80/ca.png"
    },
    {
      code: "AU",
      name: "Australia",
      currency: "AUD",
      currencySymbol: "A$",
      flag: "https://flagcdn.com/w80/au.png"
    },
    {
      code: "JP",
      name: "Japan",
      currency: "JPY",
      currencySymbol: "¥",
      flag: "https://flagcdn.com/w80/jp.png"
    },
    {
      code: "CN",
      name: "China",
      currency: "CNY",
      currencySymbol: "¥",
      flag: "https://flagcdn.com/w80/cn.png"
    },
    {
      code: "IN",
      name: "India",
      currency: "INR",
      currencySymbol: "₹",
      flag: "https://flagcdn.com/w80/in.png"
    },
    {
      code: "BR",
      name: "Brazil",
      currency: "BRL",
      currencySymbol: "R$",
      flag: "https://flagcdn.com/w80/br.png"
    },
    {
      code: "ZA",
      name: "South Africa",
      currency: "ZAR",
      currencySymbol: "R",
      flag: "https://flagcdn.com/w80/za.png"
    },
    {
      code: "RU",
      name: "Russia",
      currency: "RUB",
      currencySymbol: "₽",
      flag: "https://flagcdn.com/w80/ru.png"
    },
    {
      code: "MX",
      name: "Mexico",
      currency: "MXN",
      currencySymbol: "Mex$",
      flag: "https://flagcdn.com/w80/mx.png"
    },
    {
      code: "KR",
      name: "South Korea",
      currency: "KRW",
      currencySymbol: "₩",
      flag: "https://flagcdn.com/w80/kr.png"
    },
    {
      code: "SG",
      name: "Singapore",
      currency: "SGD",
      currencySymbol: "S$",
      flag: "https://flagcdn.com/w80/sg.png"
    },
    {
      code: "CH",
      name: "Switzerland",
      currency: "CHF",
      currencySymbol: "Fr",
      flag: "https://flagcdn.com/w80/ch.png"
    },
    {
      code: "SE",
      name: "Sweden",
      currency: "SEK",
      currencySymbol: "kr",
      flag: "https://flagcdn.com/w80/se.png"
    },
    {
      code: "NO",
      name: "Norway",
      currency: "NOK",
      currencySymbol: "kr",
      flag: "https://flagcdn.com/w80/no.png"
    },
    {
      code: "NZ",
      name: "New Zealand",
      currency: "NZD",
      currencySymbol: "NZ$",
      flag: "https://flagcdn.com/w80/nz.png"
    },
    {
      code: "AE",
      name: "United Arab Emirates",
      currency: "AED",
      currencySymbol: "د.إ",
      flag: "https://flagcdn.com/w80/ae.png"
    },
    {
      code: "IL",
      name: "Israel",
      currency: "ILS",
      currencySymbol: "₪",
      flag: "https://flagcdn.com/w80/il.png"
    },
    {
      code: "HK",
      name: "Hong Kong",
      currency: "HKD",
      currencySymbol: "HK$",
      flag: "https://flagcdn.com/w80/hk.png"
    },
    {
      code: "TR",
      name: "Turkey",
      currency: "TRY",
      currencySymbol: "₺",
      flag: "https://flagcdn.com/w80/tr.png"
    },
    {
      code: "SA",
      name: "Saudi Arabia",
      currency: "SAR",
      currencySymbol: "﷼",
      flag: "https://flagcdn.com/w80/sa.png"
    },
    {
      code: "TH",
      name: "Thailand",
      currency: "THB",
      currencySymbol: "฿",
      flag: "https://flagcdn.com/w80/th.png"
    },
    {
      code: "ID",
      name: "Indonesia",
      currency: "IDR",
      currencySymbol: "Rp",
      flag: "https://flagcdn.com/w80/id.png"
    },
    {
      code: "MY",
      name: "Malaysia",
      currency: "MYR",
      currencySymbol: "RM",
      flag: "https://flagcdn.com/w80/my.png"
    },
    {
      code: "VN",
      name: "Vietnam",
      currency: "VND",
      currencySymbol: "₫",
      flag: "https://flagcdn.com/w80/vn.png"
    },
    {
      code: "PH",
      name: "Philippines",
      currency: "PHP",
      currencySymbol: "₱",
      flag: "https://flagcdn.com/w80/ph.png"
    },
    {
      code: "NG",
      name: "Nigeria",
      currency: "NGN",
      currencySymbol: "₦",
      flag: "https://flagcdn.com/w80/ng.png"
    },
    {
      code: "EG",
      name: "Egypt",
      currency: "EGP",
      currencySymbol: "E£",
      flag: "https://flagcdn.com/w80/eg.png"
    },
    {
      code: "PK",
      name: "Pakistan",
      currency: "PKR",
      currencySymbol: "₨",
      flag: "https://flagcdn.com/w80/pk.png"
    },
    {
      code: "BD",
      name: "Bangladesh",
      currency: "BDT",
      currencySymbol: "৳",
      flag: "https://flagcdn.com/w80/bd.png"
    },
    {
      code: "UA",
      name: "Ukraine",
      currency: "UAH",
      currencySymbol: "₴",
      flag: "https://flagcdn.com/w80/ua.png"
    },
    {
      code: "CO",
      name: "Colombia",
      currency: "COP",
      currencySymbol: "Col$",
      flag: "https://flagcdn.com/w80/co.png"
    },
    {
      code: "CL",
      name: "Chile",
      currency: "CLP",
      currencySymbol: "Ch$",
      flag: "https://flagcdn.com/w80/cl.png"
    },
    {
      code: "PE",
      name: "Peru",
      currency: "PEN",
      currencySymbol: "S/",
      flag: "https://flagcdn.com/w80/pe.png"
    },
    {
      code: "AR",
      name: "Argentina",
      currency: "ARS",
      currencySymbol: "AR$",
      flag: "https://flagcdn.com/w80/ar.png"
    },
  ];
  
  // Helper function to get sorted countries data
  export const getCountries = (): Country[] => {
    return [...countriesData].sort((a, b) => a.name.localeCompare(b.name));
  };
  