import van from "vanjs-core";
import * as vanX from "vanjs-ext";
import { initMap } from "../util.ts/googleMap";
import { type PollenResponse } from "../util.ts/pollen";
import type { Geo } from "../util.ts/util";
import { getCssStyle, rgbToCssColor, round } from "../util.ts/util";

const { p, button, div, table, tr, th, td, thead, tbody } = van.tags;

export const Pollen = (geo: Geo) => {
  let pollenData = van.state<PollenResponse["dailyInfo"][number] | null>(null);
  const pollenGeo = vanX.reactive({
    lat: 0,
    lon: 0,
  });

  const getPollenData = () => {
    pollenGeo.lat = geo.lat;
    pollenGeo.lon = geo.lon;

    const query = new URLSearchParams({
      key: import.meta.env.VITE_API_KEY as string,
      "location.longitude": round(geo.lon, 2).toString(),
      "location.latitude": round(geo.lat, 2).toString(),
      days: "1",
      plantsDescription: "false",
    });
    fetch(`https://pollen.googleapis.com/v1/forecast:lookup?${query}`)
      .then((response) => response.json())
      .then((data) => {
        pollenData.val = data.dailyInfo[0];
      })
      .catch((error) => {
        console.error("Error fetching pollen data:", error);
      });
  };

  return div(
    button({ onclick: getPollenData, disabled: () => !geo.lat }, "Get Pollen"),
    div(
      () =>
        p(
          "Pollen Date: " +
            (pollenData.val
              ? [
                  pollenData.val.date.year,
                  (pollenData.val?.date.month ?? 0) - 1,
                  pollenData.val?.date.day,
                ].join("/")
              : null)
        ),
      table(
        thead(
          tr(th("NAME"), th("IN SEASON"), th("Index Description"), th("Value"))
        ),
        () =>
          tbody(
            [
              ...(pollenData.val?.plantInfo ?? []),
              ...(pollenData.val?.pollenTypeInfo ?? []),
            ].map((pollen) =>
              tr(
                td(pollen.displayName),
                td(pollen.inSeason ? "Yes" : "No"),
                td(pollen.indexInfo.category),
                td(
                  {
                    style: getCssStyle({
                      "background-color": rgbToCssColor(
                        pollen.indexInfo.color.red,
                        pollen.indexInfo.color.green,
                        pollen.indexInfo.color.blue
                      ),
                    }),
                  },
                  `${pollen.indexInfo.value}/5`
                )
              )
            )
          )
      ),
      () => p("Latitude: " + pollenGeo.lat),
      () => p("Longitude: " + pollenGeo.lon)
    )
  );
};
