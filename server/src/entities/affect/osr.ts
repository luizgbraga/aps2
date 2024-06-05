import { EARTH_RADIUS, Point } from './repository';

const baseUrl = 'https://api.openrouteservice.org/v2/directions/driving-car';

const buildPolygon = (center: Point, radius: number): Point[] => {
  const dx = 0.4 * ((radius * 360) / (2 * Math.PI * EARTH_RADIUS));
  console.log('dx: ', dx);
  return [
    [center[0] - dx, center[1] + dx],
    [center[0] + dx, center[1] + dx],
    [center[0] + dx, center[1] - dx],
    [center[0] - dx, center[1] - dx],
    [center[0] - dx, center[1] + dx],
  ];
};
const invertPoint = (point: Point): number[] => [point[1], point[0]];

export const getOSRRoute = async (
  start: Point,
  end: Point,
  center: Point,
  radius: number,
): Promise<[Point[], number]> => {
  try {
    const polygon = buildPolygon(center, radius);
    const object = {
      type: 'Polygon',
      coordinates: [
        polygon.map((point) => {
          return invertPoint(point);
        }),
      ],
    };
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        Authorization: process.env.OSR_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        coordinates: [invertPoint(start), invertPoint(end)],
        options: {
          avoid_polygons: object,
        },
      }),
    });
    // console.log(start, end, center, polygon);
    // if (!response.ok) {
    //   throw new Error(`Error fetching route: ${response.statusText}`);
    // }
    const route = await response.json();
    // console.log(JSON.stringify(route));
    const str = route.routes[0].geometry;
    return [
      decodePolyline(str).map((point): Point => [point[0], point[1]]),
      route.routes[0].summary.distance,
    ];
  } catch (error) {
    console.error('gay');
    // return [[], 9999999];
  }
};

const encodedPolyline =
  'b{}jCff|fGu@iBa@w@cBoBgAeAqAgAu@_@UOcEsBmD_BoHeE_@U{@i@e@a@QQs@y@q@aAu@mAWa@{A_Ck@_A{@uA{AaCEU?mA@eBL{@J_@\\oAXkAl@}Bf@_Bn@uB|@sCHU|@wCFw@AkAEQAMQe@Wk@g@u@k@s@wCcDOO}B_COSqBgCeAmAWc@Yy@Qq@Kk@Ig@W}AKe@g@sCuAaH_AuCSq@i@eBc@}AYu@cBoEa@cAYq@GKyBcEq@oA[m@o@iAoBmDq@oAWi@Wk@g@_Am@eAQc@wAaCaBsC_@s@m@kAWu@w@qE[yBAGI]g@eBOYMOIEe@q@w@eAKa@Ca@ASDoAtAyFRw@La@rA{EL_ALgABYP_B?g@G{@?U_@}COeAOqBQ{AAYVu@FKLGhEoAXKtBo@XEd@Eh@Av@BpGb@j@?v@CjAExASn@QZKx@c@|@o@|{@wm@t@e@pBsAj@a@z@]`HgCt@SfIqA`@E`Ck@bFy@JC^ElB[h@MdFy@tAWr@QnBa@`AMb@Ix@WbCq@ZEVBLFt@t@hAnAfAr@nBdAf@Nh@cHJMLEp@D`Dh@~@JtAN~BDv@?tCOv@MbAO`@?f@KtBo@xC{@BC@KCQEGMCeARm@BUFcBd@sAXkBZO@QUEUBYTa@dAc@pBoAdAi@fBs@bBy@lA_@x@]~Bu@tIgClA[nA]`F{AjCeAf@Ol@K\\Id@GnBVzEM\\AXEfBu@ROBI?KAQs@gBS[_AYo@eAMU[_@MK_BcAK?GBGNCH?JRRRVdAr@Qn@U^Sb@@FoANIH?F';

function decodePolyline(encoded: any) {
  let index = 0;
  const len = encoded.length;
  let lat = 0;
  let lng = 0;
  const coordinates = [];

  while (index < len) {
    let b;
    let shift = 0;
    let result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = (result & 1) != 0 ? ~(result >> 1) : result >> 1;
    lat += dlat;
    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = (result & 1) != 0 ? ~(result >> 1) : result >> 1;
    lng += dlng;
    coordinates.push([lat * 1e-5, lng * 1e-5]);
  }
  return coordinates;
}
