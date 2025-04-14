import van from "vanjs-core";
import * as vanX from "vanjs-ext";
import { Air } from "./components/air";
import { Pollen } from "./components/pollen";
import "./Head";
import { type Geo } from "./util.ts/util";
import { HEATMAP_TYPES, initMap } from "./util.ts/googleMap";
import { Orientation } from "./components/orientation";

const { main, p, button, div } = van.tags;

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

      initMap({
        lat: geo.lat,
        lng: geo.lon,
      });
    });
  };

  return main(
    () => p("Latitude: " + geo.lat),
    () => p("Longitude: " + geo.lon),
    () => p("Altitude: " + (geo.altitude !== null ? geo.altitude : "N/A")),
    () => p("Accuracy: " + geo.accuracy),
    () => p("Speed: " + (geo.speed !== null ? geo.speed : "N/A")),
    () => p("Heading: " + (geo.heading !== null ? geo.heading : "N/A")),
    () => p("Timestamp: " + new Date(geo.timestamp).toLocaleString()),
    button({ onclick: getLocation }, "Get Location"),
    Pollen(geo),
    Air(geo),
    Orientation(),
    div(
      { id: "container" },
      Object.keys(HEATMAP_TYPES).map((key) =>
        button(
          {
            type: "button",
            id: key,
          },
          key
        )
      )
    ),
    div({ id: "map" })
  );
};
van.add(document.body, Hello());
