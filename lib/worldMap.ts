// Geometry for the globe in the "Plan your dream trip" section. The outline in
// lib/worldMapPath.ts is an orthographic projection with the constants below,
// so pins are projected with the same maths to land on the right spot.

export const GLOBE_W = 1200;
export const GLOBE_H = 600;
const CENTER_LON = 45;
const CENTER_LAT = 6;
const SCALE = 660;
const TX = 600;
const TY = 720;

const rad = (deg: number) => (deg * Math.PI) / 180;

/** Projects a point onto the globe; null when it is on the far side. */
export function projectGlobe(lon: number, lat: number): [number, number] | null {
  const lambda = rad(lon - CENTER_LON);
  const phi = rad(lat);
  const phi0 = rad(CENTER_LAT);
  const facing =
    Math.sin(phi0) * Math.sin(phi) + Math.cos(phi0) * Math.cos(phi) * Math.cos(lambda);
  if (facing <= 0) return null;
  const x = TX + SCALE * Math.cos(phi) * Math.sin(lambda);
  const y =
    TY -
    SCALE * (Math.cos(phi0) * Math.sin(phi) - Math.sin(phi0) * Math.cos(phi) * Math.cos(lambda));
  return [x, y];
}

/**
 * Longitude/latitude for the places tours are offered in, so pins land on the
 * real spot. Keys are lowercase; add new destinations here as they appear.
 */
const CITY_COORDS: Record<string, [number, number]> = {
  // Bangladesh
  dhaka: [90.4125, 23.8103],
  sylhet: [91.8687, 24.8949],
  naogaon: [88.9318, 24.7936],
  kuakata: [90.121, 21.8167],
  bandarban: [92.2184, 22.1953],
  "saint martin": [92.3233, 20.627],
  "st martin": [92.3233, 20.627],
  "saint martin's island": [92.3233, 20.627],
  "cox's bazar": [91.9882, 21.4272],
  "coxs bazar": [91.9882, 21.4272],
  chittagong: [91.7832, 22.3569],
  chattogram: [91.7832, 22.3569],
  rangamati: [92.2, 22.65],
  srimangal: [91.7296, 24.3065],
  sundarbans: [89.1833, 21.9497],
  paharpur: [88.9775, 25.0311],
  mahasthangarh: [89.34, 24.9667],
  bogura: [89.3711, 24.8465],
  rajshahi: [88.6042, 24.3745],
  khulna: [89.5403, 22.8456],
  barisal: [90.3535, 22.701],
  rangpur: [89.2752, 25.7439],
  comilla: [91.1809, 23.4607],
  jessore: [89.2081, 23.1664],
  // Rest of the world
  paris: [2.3522, 48.8566],
  london: [-0.1276, 51.5072],
  "new york": [-74.006, 40.7128],
  tokyo: [139.6917, 35.6895],
  sydney: [151.2093, -33.8688],
  istanbul: [28.9784, 41.0082],
  bangkok: [100.5018, 13.7563],
  dubai: [55.2708, 25.2048],
  rome: [12.4964, 41.9028],
  venice: [12.3155, 45.4408],
  barcelona: [2.1734, 41.3851],
  madrid: [-3.7038, 40.4168],
  lisbon: [-9.1393, 38.7223],
  amsterdam: [4.9041, 52.3676],
  berlin: [13.405, 52.52],
  prague: [14.4378, 50.0755],
  zurich: [8.5417, 47.3769],
  athens: [23.7275, 37.9838],
  santorini: [25.4615, 36.3932],
  reykjavik: [-21.8277, 64.1466],
  cairo: [31.2357, 30.0444],
  marrakech: [-7.9811, 31.6295],
  nairobi: [36.8219, -1.2921],
  zanzibar: [39.1979, -6.1659],
  "cape town": [18.4241, -33.9249],
  petra: [35.4444, 30.3285],
  jerusalem: [35.2137, 31.7683],
  kathmandu: [85.324, 27.7172],
  pokhara: [83.9856, 28.2096],
  delhi: [77.1025, 28.7041],
  "new delhi": [77.1025, 28.7041],
  mumbai: [72.8777, 19.076],
  jaipur: [75.7873, 26.9124],
  agra: [78.0081, 27.1767],
  goa: [73.8278, 15.4989],
  colombo: [79.8612, 6.9271],
  male: [73.5093, 4.1755],
  maldives: [73.5093, 4.1755],
  singapore: [103.8198, 1.3521],
  "kuala lumpur": [101.6869, 3.139],
  bali: [115.2126, -8.6705],
  denpasar: [115.2126, -8.6705],
  phuket: [98.3923, 7.8804],
  "chiang mai": [98.9853, 18.7883],
  "siem reap": [103.8555, 13.3633],
  hanoi: [105.8342, 21.0278],
  "hong kong": [114.1694, 22.3193],
  seoul: [126.978, 37.5665],
  beijing: [116.4074, 39.9042],
  auckland: [174.7633, -36.8485],
  queenstown: [168.6626, -45.0312],
  toronto: [-79.3832, 43.6532],
  "san francisco": [-122.4194, 37.7749],
  "los angeles": [-118.2437, 34.0522],
  "mexico city": [-99.1332, 19.4326],
  "buenos aires": [-58.3816, -34.6037],
  lima: [-77.0428, -12.0464],
  cusco: [-71.9675, -13.5319],
  "rio de janeiro": [-43.1729, -22.9068],
};

export const lookupCity = (name: string): [number, number] | null =>
  CITY_COORDS[name.trim().toLowerCase()] ?? null;

/**
 * Well-known destinations used to fill the globe once the cities that have
 * tours are placed, so it reads like a world of places to go.
 */
const FEATURED_DESTINATIONS = [
  "London",
  "Istanbul",
  "Cairo",
  "Dubai",
  "Nairobi",
  "Kathmandu",
  "Rome",
  "Athens",
  "Barcelona",
];

export interface MapPin {
  name: string;
  /** Dot position, as a percentage of the globe box. */
  left: number;
  top: number;
  /** Label centre and edge, also in percent; crowded labels shift or flip. */
  labelLeft: number;
  labelTop: number;
  /** True when the label sits above its dot, false when it hangs below it. */
  above: boolean;
  /** Where the label's tail sits, as a percentage of the label's own width. */
  tail: number;
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

const round = (n: number) => Math.round(n * 100) / 100;
const clamp = (n: number, lo: number, hi: number) => Math.min(Math.max(n, lo), hi);
const hit = (a: Rect, b: Rect) =>
  a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

/**
 * Picks and places up to `maxPins` labelled pins: cities with tours first, then
 * featured destinations. A pin is skipped when it is on the far side of the
 * globe, would sit under the form card (`avoid`, in globe units), or has no
 * spot where its label clears every other pin.
 */
export function buildGlobePins(
  tourCities: string[],
  { maxPins = 7, renderWidth = 1104, avoid }: { maxPins?: number; renderWidth?: number; avoid?: Rect } = {},
): MapPin[] {
  // Labels are sized in CSS pixels; convert to globe units at the expected width
  const unit = GLOBE_W / renderWidth;
  const LABEL_H = 38 * unit;
  const GAP = 16 * unit;
  const labelWidth = (name: string) => (name.length * 8.6 + 34) * unit;

  const seen = new Set<string>();
  const candidates: { name: string; x: number; y: number }[] = [];
  for (const name of [...tourCities, ...FEATURED_DESTINATIONS]) {
    const key = name.trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    const coords = lookupCity(key);
    if (!coords) continue;
    const point = projectGlobe(coords[0], coords[1]);
    if (!point) continue;
    candidates.push({ name: name.trim(), x: point[0], y: point[1] });
  }

  const labels: Rect[] = [];
  const dots: Rect[] = [];
  const pins: MapPin[] = [];
  const inBox = (r: Rect) => r.x >= 0 && r.y >= 0 && r.x + r.w <= GLOBE_W && r.y + r.h <= GLOBE_H;

  for (const c of candidates) {
    const dot: Rect = { x: c.x - 12, y: c.y - 12, w: 24, h: 24 };
    if (!inBox(dot) || (avoid && hit(avoid, dot))) continue;
    if (labels.some((r) => hit(r, dot))) continue;

    const lw = labelWidth(c.name);
    const side = lw / 2 + 14;
    let chosen: { lcx: number; above: boolean; rect: Rect } | null = null;
    for (const above of [true, false]) {
      for (const offset of [0, side, -side]) {
        const lcx = c.x + offset;
        const top = above ? c.y - GAP - LABEL_H : c.y + GAP;
        const rect: Rect = { x: lcx - lw / 2 - 6, y: top - 6, w: lw + 12, h: LABEL_H + 12 };
        if (!inBox(rect) || (avoid && hit(avoid, rect))) continue;
        if (labels.some((r) => hit(r, rect)) || dots.some((r) => hit(r, rect))) continue;
        chosen = { lcx, above, rect };
        break;
      }
      if (chosen) break;
    }
    if (!chosen) continue;

    labels.push(chosen.rect);
    dots.push(dot);
    pins.push({
      name: c.name,
      left: round((c.x / GLOBE_W) * 100),
      top: round((c.y / GLOBE_H) * 100),
      labelLeft: round((chosen.lcx / GLOBE_W) * 100),
      labelTop: round(((chosen.above ? c.y - GAP : c.y + GAP) / GLOBE_H) * 100),
      above: chosen.above,
      tail: round(clamp(((c.x - chosen.lcx) / lw) * 100, -38, 38)),
    });
    if (pins.length >= maxPins) break;
  }

  return pins;
}
