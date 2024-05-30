export type HourRange = {
  start: number;
  end: number;
};

export type Sensor = {
  id: string;
  latitude: number;
  longitude: number;
  radius: number;
};

export type FakeSensor = Sensor & {
  floodingInterval: HourRange;
  landslideInterval: HourRange;
  congestionInterval: HourRange;
};

export type SensorState = {
  flood: number;
  landslide: number;
  congestion: number;
};

export type SensorStatus = {
  sensor: Sensor;
  state: SensorState;
};
