import van from "vanjs-core";
import type { Geo } from "../util.ts/util";
import { fetchWeatherApi } from "openmeteo";

const { p, button, div, table, tr, th, td, thead, tbody } = van.tags;

const range = (start: number, stop: number, step: number) =>
  Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

const HOURLY = [
  "temperature_2m",
  "apparent_temperature",
  "precipitation",
  "rain",
  "snowfall",
  "weather_code",
  "cloud_cover",
  "wind_speed_10m",
  "wind_direction_10m",
  "sunshine_duration",
];

const CURRENT = [
  "rain",
  "showers",
  "snowfall",
  "precipitation",
  "weather_code",
  "cloud_cover",
  "pressure_msl",
  "surface_pressure",
  "wind_speed_10m",
  "wind_direction_10m",
  "wind_gusts_10m",
  "temperature_2m",
  "relative_humidity_2m",
  "apparent_temperature",
];

export const Weather = (geo: Geo) => {
  let weatherData = van.state<{
    timezone: string | null;
    timezoneAbbreviation: string | null;
    latitude: number;
    longitude: number;
    weatherData: {
      current: {
        time: Date;
        rain: number;
        showers: number;
        snowfall: number;
        precipitation: number;
        weatherCode: number;
        cloudCover: number;
        pressureMsl: number;
        surfacePressure: number;
        windSpeed10m: number;
        windDirection10m: number;
        windGusts10m: number;
        temperature2m: number;
        relativeHumidity2m: number;
        apparentTemperature: number;
      };
      hourly: {
        time: Date[];
        temperature2m: Float32Array<ArrayBufferLike>;
        apparentTemperature: Float32Array<ArrayBufferLike>;
        precipitation: Float32Array<ArrayBufferLike>;
        rain: Float32Array<ArrayBufferLike>;
        snowfall: Float32Array<ArrayBufferLike>;
        weatherCode: Float32Array<ArrayBufferLike>;
        cloudCover: Float32Array<ArrayBufferLike>;
        windSpeed10m: Float32Array<ArrayBufferLike>;
        windDirection10m: Float32Array<ArrayBufferLike>;
        sunshineDuration: Float32Array<ArrayBufferLike>;
      };
    };
  } | null>(null);

  const getWeatherData = async () => {
    const params = {
      latitude: geo.lat,
      longitude: geo.lon,
      hourly: HOURLY,
      models: "jma_seamless",
      current: CURRENT,
      timezone: "Asia/Tokyo",
      past_days: 7,
      forecast_days: 1,
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);

    const response = responses[0];

    const utcOffsetSeconds = response.utcOffsetSeconds();
    const timezone = response.timezone();
    const timezoneAbbreviation = response.timezoneAbbreviation();
    const latitude = response.latitude();
    const longitude = response.longitude();

    const current = response.current()!;
    const hourly = response.hourly()!;

    const weatherDataObj = {
      current: {
        time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
        rain: current.variables(0)!.value(),
        showers: current.variables(1)!.value(),
        snowfall: current.variables(2)!.value(),
        precipitation: current.variables(3)!.value(),
        weatherCode: current.variables(4)!.value(),
        cloudCover: current.variables(5)!.value(),
        pressureMsl: current.variables(6)!.value(),
        surfacePressure: current.variables(7)!.value(),
        windSpeed10m: current.variables(8)!.value(),
        windDirection10m: current.variables(9)!.value(),
        windGusts10m: current.variables(10)!.value(),
        temperature2m: current.variables(11)!.value(),
        relativeHumidity2m: current.variables(12)!.value(),
        apparentTemperature: current.variables(13)!.value(),
      },
      hourly: {
        time: range(
          Number(hourly.time()),
          Number(hourly.timeEnd()),
          hourly.interval()
        ).map(
          (t) =>
            new Date(
              (t + utcOffsetSeconds) * 1000 -
                Number(timezoneAbbreviation?.replace("GMT", "")) *
                  60 *
                  60 *
                  1000
            )
        ),
        temperature2m: hourly.variables(0)!.valuesArray()!,
        apparentTemperature: hourly.variables(1)!.valuesArray()!,
        precipitation: hourly.variables(2)!.valuesArray()!,
        rain: hourly.variables(3)!.valuesArray()!,
        snowfall: hourly.variables(4)!.valuesArray()!,
        weatherCode: hourly.variables(5)!.valuesArray()!,
        cloudCover: hourly.variables(6)!.valuesArray()!,
        windSpeed10m: hourly.variables(7)!.valuesArray()!,
        windDirection10m: hourly.variables(8)!.valuesArray()!,
        sunshineDuration: hourly.variables(9)!.valuesArray()!,
      },
    };

    weatherData.val = {
      timezone,
      timezoneAbbreviation,
      latitude,
      longitude,
      weatherData: weatherDataObj,
    };
  };

  return div(
    button(
      { onclick: getWeatherData, disabled: () => !geo.lat },
      "Get Weather"
    ),
    () =>
      weatherData.val
        ? div(
            p(weatherData.val.timezone),
            p(weatherData.val.timezoneAbbreviation),
            p(weatherData.val.latitude),
            p(weatherData.val.longitude),
            table(
              thead(
                tr(
                  th("time"),
                  th("rain"),
                  th("showers"),
                  th("snowfall"),
                  th("precipitation"),
                  th("weatherCode"),
                  th("cloudCover"),
                  th("pressureMsl"),
                  th("surfacePressure"),
                  th("windSpeed10m"),
                  th("windDirection10m"),
                  th("windGusts10m"),
                  th("temperature2m"),
                  th("relativeHumidity2m"),
                  th("apparentTemperature")
                )
              ),
              tbody(
                tr(
                  td(weatherData.val.weatherData.current.time.toLocaleString()),
                  td(weatherData.val.weatherData.current.rain),
                  td(weatherData.val.weatherData.current.showers),
                  td(weatherData.val.weatherData.current.snowfall),
                  td(weatherData.val.weatherData.current.precipitation),
                  td(weatherData.val.weatherData.current.weatherCode),
                  td(weatherData.val.weatherData.current.cloudCover),
                  td(weatherData.val.weatherData.current.pressureMsl),
                  td(weatherData.val.weatherData.current.surfacePressure),
                  td(weatherData.val.weatherData.current.windSpeed10m),
                  td(weatherData.val.weatherData.current.windDirection10m),
                  td(weatherData.val.weatherData.current.windGusts10m),
                  td(weatherData.val.weatherData.current.temperature2m),
                  td(weatherData.val.weatherData.current.relativeHumidity2m),
                  td(weatherData.val.weatherData.current.apparentTemperature)
                )
              )
            ),
            table(
              thead(
                tr(
                  th("time"),
                  th("temperature2m"),
                  th("apparentTemperature"),
                  th("precipitation"),
                  th("rain"),
                  th("snowfall"),
                  th("weatherCode"),
                  th("cloudCover"),
                  th("windSpeed10m"),
                  th("windDirection10m"),
                  th("sunshineDuration")
                )
              ),
              tbody(
                weatherData.val?.weatherData.hourly.time.map((time, i) =>
                  tr(
                    td(time.toLocaleString()),
                    td(weatherData.val!.weatherData.hourly.temperature2m[i]),
                    td(
                      weatherData.val!.weatherData.hourly.apparentTemperature[i]
                    ),
                    td(weatherData.val!.weatherData.hourly.precipitation[i]),
                    td(weatherData.val!.weatherData.hourly.rain[i]),
                    td(weatherData.val!.weatherData.hourly.snowfall[i]),
                    td(weatherData.val!.weatherData.hourly.weatherCode[i]),
                    td(weatherData.val!.weatherData.hourly.cloudCover[i]),
                    td(weatherData.val!.weatherData.hourly.windSpeed10m[i]),
                    td(weatherData.val!.weatherData.hourly.windDirection10m[i]),
                    td(weatherData.val!.weatherData.hourly.sunshineDuration[i])
                  )
                )
              )
            )
          )
        : ""
  );
};
