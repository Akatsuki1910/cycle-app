import type { MapResponseColor } from "./mapApi";

interface PollenIndexInfo {
  code: string;
  displayName: string;
  value: number;
  category: string;
  indexDescription: string;
  color: MapResponseColor;
}

interface PollenData {
  code: string;
  displayName: string;
  inSeason: boolean;
  indexInfo: PollenIndexInfo;
}

export interface PollenResponse {
  regionCode: string;
  dailyInfo: {
    date: {
      year: number;
      month: number;
      day: number;
    };
    pollenTypeInfo: ({
      healthRecommendations: string[];
    } & PollenData)[];
    plantInfo: PollenData[];
  }[];
}
