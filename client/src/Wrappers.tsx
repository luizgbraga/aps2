import React, { createContext, useEffect } from 'react';

import { UserModel } from './api/user';

import { INITIAL_ASYNC } from './utils/async';
import { useAsync, type Async } from './utils/async';
import { SensorModel } from './api/sensor';
import { OccurenceModel } from './api/occurences';

type Props = {
  children: React.ReactNode;
};

export const AuthContext = createContext<Async<UserModel>>(INITIAL_ASYNC);

export const LoggedWrapper: React.FC<Props> = ({ children }) => {
  const me = useAsync(() => UserModel.me());

  useEffect(() => {
    const interval = setInterval(() => {
      SensorModel.getAllStatuses().then((result) => {
        for (const sensorStatus of result) {
          if (sensorStatus.state.flood > 0) {
            OccurenceModel.create(
              'flooding',
              sensorStatus.sensor.latitude.toString(),
              sensorStatus.sensor.longitude.toString(),
              sensorStatus.sensor.neighborhoodId,
              `Flooding detected by sensor ${sensorStatus.sensor.id}`,
              1000
            );
          }
          if (sensorStatus.state.landslide > 0) {
            OccurenceModel.create(
              'landslide',
              sensorStatus.sensor.latitude.toString(),
              sensorStatus.sensor.longitude.toString(),
              sensorStatus.sensor.neighborhoodId,
              `Landslide detected by sensor ${sensorStatus.sensor.id}`,
              1000
            );
          }
          if (sensorStatus.state.congestion > 0) {
            OccurenceModel.create(
              'congestion',
              sensorStatus.sensor.latitude.toString(),
              sensorStatus.sensor.longitude.toString(),
              sensorStatus.sensor.neighborhoodId,
              `Congestion detected by sensor ${sensorStatus.sensor.id}`,
              1000
            );
          }
        }
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);
  return <AuthContext.Provider value={me}>{children}</AuthContext.Provider>;
};
