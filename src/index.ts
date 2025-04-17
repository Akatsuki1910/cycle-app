import van from "vanjs-core";
import * as vanX from "vanjs-ext";
import { Air } from "./components/air";
import { Pollen } from "./components/pollen";
import "./Head";
import { getCssStyle, rgbToCssColor, round, type Geo } from "./util.ts/util";
import { Orientation } from "./components/orientation";
import { Weather } from "./components/weather";

const { main, p, button, div, a } = van.tags;

const Hello = () => {
  const geo = vanX.reactive<Geo>({
    lat: 0,
    lon: 0,
    altitude: null,
    accuracy: 0,
    speed: null,
    heading: null,
    timestamp: 0,
  });

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      geo.lat = position.coords.latitude;
      geo.lon = position.coords.longitude;
      geo.altitude = position.coords.altitude;
      geo.accuracy = position.coords.accuracy;
      geo.speed = position.coords.speed;
      geo.heading = position.coords.heading;
      geo.timestamp = position.timestamp;

      // initMap({
      //   lat: geo.lat,
      //   lng: geo.lon,
      // });
    });
  };
  getLocation();

  return main(
    div(
      {
        style: getCssStyle({
          display: "flex",
        }),
      },
      div(
        () => p("Lat:" + round(geo.lat, 2) + "°"),
        () => p("Lon:" + round(geo.lon, 2) + "°"),
        () =>
          p("Alt:" + (geo.altitude !== null ? round(geo.altitude, 2) : "N/A")),
        () => p("Acc:" + round(geo.accuracy, 2) + "m"),
        () => p("Spe:" + (geo.speed !== null ? round(geo.speed, 2) : "N/A")),
        () =>
          p("Hea:" + (geo.heading !== null ? round(geo.heading, 2) : "N/A")),
        () => p("Tim:" + new Date(geo.timestamp).toLocaleString()),
        button({ onclick: getLocation }, "Get Location")
      ),
      Orientation()
    ),
    // Pollen(geo),
    // Air(geo),
    Weather(geo),
    a(
      { href: "https://www.jma.go.jp/jma/index.html", target: "_blank" },
      "気象庁"
    )
    // div(
    //   { id: "container" },
    //   Object.keys(HEATMAP_TYPES).map((key) =>
    //     button(
    //       {
    //         type: "button",
    //         id: key,
    //       },
    //       key
    //     )
    //   )
    // ),
    // div({ id: "map" })
  );
};
van.add(document.body, Hello());
