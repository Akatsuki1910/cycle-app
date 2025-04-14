import van from "vanjs-core";
import * as vanX from "vanjs-ext";
import { AIR_CONDITIONS_UNITS, type AirQualityResponse } from "../util.ts/air";
import type { Geo } from "../util.ts/util";
import { getCssStyle, rgbToCssColor } from "../util.ts/util";

const { p, button, div, table, tr, th, td, thead, tbody } = van.tags;

export const Air = (geo: Geo) => {
  let airData = van.state<AirQualityResponse | null>(null);
  const airGeo = vanX.reactive({
    lat: 0,
    lon: 0,
  });

  const getAirData = () => {
    airGeo.lat = geo.lat;
    airGeo.lon = geo.lon;

    const query = new URLSearchParams({
      key: import.meta.env.VITE_API_KEY as string,
    });
    fetch(
      `https://airquality.googleapis.com/v1/currentConditions:lookup?${query}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: {
            latitude: airGeo.lat,
            longitude: airGeo.lon,
          },
          extraComputations: [
            "HEALTH_RECOMMENDATIONS",
            "DOMINANT_POLLUTANT_CONCENTRATION",
            "POLLUTANT_CONCENTRATION",
            "LOCAL_AQI",
          ],
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        airData.val = data;
        console.log("Air data:", airData.val);
      })
      .catch((error) => {
        console.error("Error fetching air data:", error);
      });
  };

  return div(
    button({ onclick: getAirData, disabled: () => !geo.lat }, "Get Air"),
    div(
      () =>
        p(
          "AIR Date: " +
            (airData.val
              ? new Date(airData.val?.dateTime).toLocaleString()
              : null)
        ),
      table(thead(tr(th("NAME"), th("AQI"), th("CATEGORY"))), () =>
        tbody(
          airData.val?.indexes.map((air) =>
            tr(
              td(air.displayName),
              air.aqiDisplay
                ? td(
                    {
                      style: getCssStyle({
                        "background-color": rgbToCssColor(
                          air.color.red,
                          air.color.green,
                          air.color.blue
                        ),
                      }),
                    },
                    air.aqiDisplay
                  )
                : "NULL",
              td(air.category)
            )
          )
        )
      )
    ),
    table(thead(tr(th("NAME"), th("FULLNAME"), th("VALUE"))), () =>
      tbody(
        airData.val?.pollutants.map((air) =>
          tr(
            td(air.displayName),
            td(air.fullName),
            td(
              air.concentration.value +
                " " +
                AIR_CONDITIONS_UNITS[air.concentration.units]
            )
          )
        )
      )
    ),
    () => p(airData.val?.healthRecommendations.generalPopulation),
    () => p(airData.val?.healthRecommendations.athletes)
  );
};
