export interface Sensor {
  id: string;
  latitude: number;
  longitude: number;
  radius: number;
  flood: boolean;
  landslide: boolean;
  congestion: boolean;
}
