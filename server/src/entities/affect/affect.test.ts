import * as fs from 'fs';
import { describe, expect, it } from '@jest/globals';
import {
  AffectRepository,
  calculateBorderPoints,
  calculateWaypoints,
  mergeAlternately,
  Point,
} from './repository';
import { number } from 'zod';
const baseUrl = 'https://api.openrouteservice.org/v2/directions/driving-car';

const start = [-43.23957774439161, -22.931835278090784];
const end = [-43.176826755427754, -22.95694773990088];
const avoidAreas = {
  type: 'Polygon',
  coordinates: [
    [
      [-43.216402999239364, -22.92644995973206],
      [-43.19873274953352, -22.92961438949576],
      [-43.196685995576566, -22.964363778883055],
      [-43.21989572832513, -22.962491442852023],
      [-43.216402999239364, -22.92644995973206],
    ],
  ],
};

const getRoute = async () => {
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        Authorization: apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        coordinates: [start, end],
        options: {
          avoid_polygons: avoidAreas,
        },
      }),
    });

    // if (!response.ok) {
    //   throw new Error(`Error fetching route: ${response.statusText}`);
    // }

    const route = await response.json();
    console.log(route.routes);
  } catch (error) {
    console.error('gay');
  }
};

const encodedPolyline = 'b{}jCff|fGu@iBa@w@cBoBgAeAqAgAu@_@UOcEsBmD_BoHeE_@U{@i@e@a@QQs@y@q@aAu@mAWa@{A_Ck@_A{@uA{AaCEU?mA@eBL{@J_@\\oAXkAl@}Bf@_Bn@uB|@sCHU|@wCFw@AkAEQAMQe@Wk@g@u@k@s@wCcDOO}B_COSqBgCeAmAWc@Yy@Qq@Kk@Ig@W}AKe@g@sCuAaH_AuCSq@i@eBc@}AYu@cBoEa@cAYq@GKyBcEq@oA[m@o@iAoBmDq@oAWi@Wk@g@_Am@eAQc@wAaCaBsC_@s@m@kAWu@w@qE[yBAGI]g@eBOYMOIEe@q@w@eAKa@Ca@ASDoAtAyFRw@La@rA{EL_ALgABYP_B?g@G{@?U_@}COeAOqBQ{AAYVu@FKLGhEoAXKtBo@XEd@Eh@Av@BpGb@j@?v@CjAExASn@QZKx@c@|@o@|{@wm@t@e@pBsAj@a@z@]`HgCt@SfIqA`@E`Ck@bFy@JC^ElB[h@MdFy@tAWr@QnBa@`AMb@Ix@WbCq@ZEVBLFt@t@hAnAfAr@nBdAf@Nh@cHJMLEp@D`Dh@~@JtAN~BDv@?tCOv@MbAO`@?f@KtBo@xC{@BC@KCQEGMCeARm@BUFcBd@sAXkBZO@QUEUBYTa@dAc@pBoAdAi@fBs@bBy@lA_@x@]~Bu@tIgClA[nA]`F{AjCeAf@Ol@K\\Id@GnBVzEM\\AXEfBu@ROBI?KAQs@gBS[_AYo@eAMU[_@MK_BcAK?GBGNCH?JRRRVdAr@Qn@U^Sb@@FoANIH?F'

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

// const path = require("path");
// const file = path.join(__dirname, "./", "shape_testcase.txt");

// const repository = new AffectRepository();
describe('updateAffectedRoutes', () => {
  // getRoute();
  const decodedCoordinates = decodePolyline(encodedPolyline);
  console.log(decodedCoordinates);

  // it('should return the expected array of route_ids', async () => {
  //   const expectedResult = [
  //     { route_id: 'E2310AAA0A' },
  //     { route_id: 'O0369AAA0A' },
  //     { route_id: 'O0389AAA0A' },
  //     { route_id: 'O0397AAA0A' },
  //     { route_id: 'O0397AAN0A' },
  //     { route_id: 'O0397AAR0A' },
  //     { route_id: 'O0731AAA0A' },
  //     { route_id: 'O0731AAN0A' },
  //     { route_id: 'O0737AAA0A' },
  //     { route_id: 'O0741AAA0A' },
  //     { route_id: 'O0788AAA0A' },
  //     { route_id: 'O0812AAA0A' },
  //     { route_id: 'O0819AAA0A' },
  //     { route_id: 'O0926AAA0A' }
  //   ];
  //   const result = await AffectRepository.queryAffectedRoutes(
  //     -22.874878,
  //     -43.463678,
  //     50
  //   );
  //   expect(result).toEqual(expectedResult);
  // });
  // it('should return the border points of the shape test case', async () => {
  //   const fileStr = fs.readFileSync(file, 'utf8');
  //   const linesArray = fileStr.split('\n');
  //   const pointArray: Point[] = linesArray.map((line) => {
  //     const numArray = line.split(',').map((str) => Number(str));
  //     const point: Point = [numArray[0], numArray[1]];
  //     return point;
  //   });
  //   const result = calculateBorderPoints(pointArray, [-22.874878, -43.463678], 50);
  //   // console.log(result[0]);
  //   // console.log(result[1]);
  //   // expect(result).toEqual(expectedResult);
  //   const expected =
  //     [
  //       [[[-22.8751, -43.46559], [-22.87348, -43.46373]]],
  //       [
  //         [
  //           [-22.8974, -43.48696],
  //           [-22.89734, -43.4869],
  //           [-22.89719, -43.48687],
  //           [-22.89638, -43.48723],
  //           [-22.89543, -43.48632],
  //           [-22.89525, -43.48615],
  //           [-22.89499, -43.48621],
  //           [-22.89485, -43.48572],
  //           [-22.895, -43.48569],
  //           [-22.89441, -43.48461],
  //           [-22.89433, -43.48446],
  //           [-22.89388, -43.48457],
  //           [-22.89322, -43.48472],
  //           [-22.89204, -43.485],
  //           [-22.89189, -43.48504],
  //           [-22.89142, -43.48412],
  //           [-22.89056, -43.48246],
  //           [-22.88936, -43.48021],
  //           [-22.88928, -43.48005],
  //           [-22.88844, -43.48027],
  //           [-22.88701, -43.48065],
  //           [-22.8866, -43.4808],
  //           [-22.88635, -43.4809],
  //           [-22.88633, -43.48062],
  //           [-22.8863, -43.47996],
  //           [-22.88627, -43.4782],
  //           [-22.88624, -43.47656],
  //           [-22.88621, -43.47555],
  //           [-22.88621, -43.47556],
  //           [-22.88609, -43.47168],
  //           [-22.88609, -43.471672],
  //           [-22.88609, -43.47168],
  //           [-22.886, -43.4691],
  //           [-22.886, -43.46911],
  //           [-22.88599, -43.46884],
  //           [-22.88561, -43.46884],
  //           [-22.88561, -43.46884],
  //           [-22.884434, -43.46885],
  //           [-22.88444, -43.46885],
  //           [-22.88301, -43.46884],
  //           [-22.88068, -43.46884],
  //           [-22.88019, -43.46884],
  //           [-22.88017, -43.46821],
  //           [-22.8801, -43.467],
  //           [-22.88009, -43.46692],
  //           [-22.87999, -43.46665],
  //           [-22.87973, -43.46599],
  //           [-22.87969, -43.46578],
  //           [-22.87967, -43.46554],
  //           [-22.87966, -43.4644],
  //           [-22.87965, -43.46364],
  //           [-22.87844, -43.46366],
  //           [-22.87553, -43.46372],
  //           [-22.87556, -43.46543],
  //           [-22.87567, -43.46973],
  //           [-22.8757, -43.47027],
  //           [-22.87582, -43.47096],
  //           [-22.87587, -43.47362],
  //           [-22.87539, -43.47363],
  //           [-22.87533, -43.47088],
  //           [-22.8753, -43.46908],
  //           [-22.87529, -43.4686],
  //           [-22.87526, -43.46843],
  //           [-22.8752, -43.46829],
  //           [-22.87514, -43.4682],
  //           [-22.87511, -43.46811],
  //           [-22.87511, -43.46652],
  //           [-22.8751, -43.46559]
  //         ],
  //         [
  //           [-22.87348, -43.46373],
  //           [-22.87349, -43.46493],
  //           [-22.87292, -43.46493],
  //           [-22.87045, -43.46497],
  //           [-22.86731, -43.46501],
  //           [-22.86597, -43.46505],
  //           [-22.86451, -43.46506],
  //           [-22.86414, -43.46507],
  //           [-22.86378, -43.46509],
  //           [-22.86358, -43.46512],
  //           [-22.86337, -43.46516],
  //           [-22.86316, -43.46527],
  //           [-22.86308, -43.46536],
  //           [-22.86279, -43.46552],
  //           [-22.86246, -43.46562],
  //           [-22.86054, -43.46534],
  //           [-22.85886, -43.46509],
  //           [-22.85909, -43.46385],
  //           [-22.85907, -43.46349],
  //           [-22.8591, -43.46269],
  //           [-22.85907, -43.46224],
  //           [-22.85928, -43.46111],
  //           [-22.85986, -43.45789],
  //           [-22.86095, -43.45182],
  //           [-22.86154, -43.44866],
  //           [-22.86217, -43.44516],
  //           [-22.8632, -43.43988],
  //           [-22.86366, -43.43727],
  //           [-22.864, -43.43549],
  //           [-22.86456, -43.4322],
  //           [-22.86515, -43.42892],
  //           [-22.86524, -43.42873],
  //           [-22.86561, -43.42755],
  //           [-22.86586, -43.4264],
  //           [-22.86589, -43.42636],
  //           [-22.86591, -43.4262],
  //           [-22.86588, -43.42603],
  //           [-22.86594, -43.42567],
  //           [-22.86595, -43.4255],
  //           [-22.86597, -43.42529],
  //           [-22.86593, -43.42481],
  //           [-22.86584, -43.42419],
  //           [-22.8658, -43.42352],
  //           [-22.86574, -43.42307],
  //           [-22.86556, -43.42225],
  //           [-22.86492, -43.41957],
  //           [-22.86442, -43.4177],
  //           [-22.86414, -43.41678],
  //           [-22.86321, -43.41403],
  //           [-22.86279, -43.41295],
  //           [-22.86218, -43.41155],
  //           [-22.86174, -43.41061],
  //           [-22.86131, -43.40974],
  //           [-22.85922, -43.40561],
  //           [-22.85773, -43.40262],
  //           [-22.85486, -43.39698],
  //           [-22.85333, -43.39394],
  //           [-22.85334, -43.39394],
  //           [-22.85316, -43.39358],
  //           [-22.85303, -43.3932],
  //           [-22.85292, -43.39279],
  //           [-22.85275, -43.39175],
  //           [-22.85228, -43.38927],
  //           [-22.85214, -43.38841],
  //           [-22.85207, -43.38814],
  //           [-22.85184, -43.38733],
  //           [-22.85167, -43.38686],
  //           [-22.85129, -43.38608],
  //           [-22.85107, -43.38572],
  //           [-22.85071, -43.38519],
  //           [-22.85006, -43.38441],
  //           [-22.84927, -43.38352],
  //           [-22.84872, -43.38285]
  //         ]
  //       ]
  //     ]
  //   expect(result).toEqual(expected);
  // });
  // it('should return', async () => {
  //   const result = calculateWaypoints([ -22.90345, -43.27037 ], [ -22.89641, -43.28936 ], [ -22.902369267975896, -43.28023255729598 ], 2);
  //   console.log(result);
  //   expect(true).toEqual(true);
  // });
  // it('should return', async () => {
  //   const result = await AffectRepository.getNewWaypointShape(
  //     [-22.88033, -43.47826],
  //     [-22.8803290, -43.4782594],
  //     [[-22.85290, -43.35756]]
  //     // [-22.8751, -43.46559],
  //     // [-22.87348, -43.46373],
  //     // [
  //     //   [ -22.87406834305807, -43.465424277078924 ],
  //     //   [ -22.873275271995453, -43.46474396948523 ]
  //     // ]
  //   );
  //   console.log(result);
  //   expect(true).toEqual(true);
  // });
  // it('should return', async () => {
  //     const result = mergeAlternately([[[1,2], [3,4]], [[9,10], [11,12]]], [[[5,6],[7,8]]]);
  //     console.log(result);
  //     expect(true).toEqual(true);
  //   });
});
