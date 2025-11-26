export type City = {
  id: string;
  guid: string;
  contentType: "city";
  label: string;
  name: string;
  name_alt: string;
  name_en: string;
  namecase: {
    nominative: string;
    genitive: string;
    dative: string;
    accusative: string;
    ablative: string;
    prepositional: string;
  };
  coords: {
    lat: number;
    lon: number;
  };
  region: {
    name: string;
    label: string;
    type: string;
    typeShort: string;
    contentType: "region";
    id: string;
  };
  timezone: {
    tzid: string;
    abbreviation: string;
    utcOffset: string;
    mskOffset: string;
  };
  type: string;
  typeShort: string;
  okato: string;
  oktmo: string;
  zip: string;
  population: number;
  yearCityStatus: number;
  yearFounded: number;
  isCapital: boolean;
  isDualName: boolean;
};
