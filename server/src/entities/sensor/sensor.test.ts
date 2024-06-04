import { describe, expect, it } from "@jest/globals";
import { Sensor } from "./schema";
import { isInsideSensor } from "./utils";

describe("isInsideSensor", () =>{
    it("should return that the point is outside the sensor", async () => {
        const newSensor: Sensor = {
            id: "21321321",
            latitude: -22.954930,
            longitude: -43.166831,
            neighborhoodId: "Urca",
            radius: 100,
        };
        expect(isInsideSensor(newSensor, -22.914975, -43.160573)).toBe(false);
    })
    it("should return that the point is inside the sensor", async () => {
        const newSensor: Sensor = {
            id: "21321321",
            latitude: -22.954930,
            longitude: -43.166831,
            neighborhoodId: "Urca",
            radius: 100,
        };
        expect(isInsideSensor(newSensor, -22.954294, -43.167479)).toBe(true);
    })
}) 