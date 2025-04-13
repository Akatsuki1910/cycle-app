// https://developers.google.com/maps/documentation/pollen/embed-heatmaps?hl=ja

export const HEATMAP_TYPES = {
  tree: {
    key: "TREE_UPI",
    subDomain: "pollen",
  },
  grass: {
    key: "GRASS_UPI",
    subDomain: "pollen",
  },
  weed: {
    key: "WEED_UPI",
    subDomain: "pollen",
  },
  uaqi: {
    key: "UAQI_INDIGO_PERSIAN",
    subDomain: "airquality",
  },
  "pm2.5": {
    key: "PM25_INDIGO_PERSIAN",
    subDomain: "airquality",
  },
} as const satisfies Record<
  string,
  {
    key: string;
    subDomain: string;
  }
>;

let SELECT_TYPE: {
  key: string;
  subDomain: string;
} = HEATMAP_TYPES.tree;

class MapType {
  public tileSize: google.maps.Size;

  alt: any;
  maxZoom: any;
  minZoom: any;
  name: any;
  projection: any;
  radius: any;

  constructor(tileSize: google.maps.Size) {
    this.tileSize = tileSize;
  }

  releaseTile() {}

  getTile(
    coord: google.maps.Point | null | null,
    zoom: number,
    ownerDocument: Document
  ) {
    const img = ownerDocument.createElement("img");
    const mapType = SELECT_TYPE;

    const x = coord?.x;
    const y = coord?.y;
    const key = import.meta.env.VITE_API_KEY;
    img.style.opacity = (0.8).toString();
    img.src = `https://${mapType.subDomain}.googleapis.com/v1/mapTypes/${mapType.key}/heatmapTiles/${zoom}/${x}/${y}?key=${key}`;
    return img;
  }
}

export function initMap(myLatLng: google.maps.LatLngLiteral) {
  const mapSize = new google.maps.Size(256, 256);
  const map = new google.maps.Map(document.getElementById("map")!, {
    mapId: "4ff561467d59ac37",
    zoom: 9,
    center: myLatLng,
    maxZoom: 16,
    minZoom: 3,
    restriction: {
      latLngBounds: { north: 80, south: -80, west: -180, east: 180 },
      strictBounds: true,
    },
    disableDefaultUI: true,
  });
  const mapType = new MapType(mapSize);
  map.overlayMapTypes.insertAt(0, mapType);

  Object.entries(HEATMAP_TYPES).forEach(([key, value]) => {
    const button = document.getElementById(key);
    if (button) {
      button.addEventListener("click", function () {
        SELECT_TYPE = value;
        map.overlayMapTypes.removeAt(0);
        map.overlayMapTypes.insertAt(0, mapType);
      });
    }
  });
}
