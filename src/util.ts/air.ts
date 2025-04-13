import type { MapResponseColor } from "./mapApi";

export const AIR_CONDITIONS_UNITS = {
  UNIT_UNSPECIFIED: "",
  PARTS_PER_BILLION: "ppb",
  MICROGRAMS_PER_CUBIC_METER: "µg/m^3",
};

export interface AirQualityResponse {
  dateTime: string;
  regionCode: string;
  indexes: {
    code: string;
    displayName: string;
    aqi?: number;
    aqiDisplay?: string;
    color: MapResponseColor;
    category: string;
    dominantPollutant: string;
  }[];
  pollutants: {
    code: string;
    displayName: string;
    fullName: string;
    concentration: {
      value: number;
      units: keyof typeof AIR_CONDITIONS_UNITS;
    };
  }[];
  healthRecommendations: {
    generalPopulation: string;
    elderly: string;
    lungDiseasePopulation: string;
    heartDiseasePopulation: string;
    athletes: string;
    pregnantWomen: string;
    children: string;
  };
}
