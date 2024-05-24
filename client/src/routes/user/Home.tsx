import React, { useEffect } from 'react';

import { LoggedLayout } from '../../layout/logged/LoggedLayout';
import { SensorModel } from '../../api/sensor';

export const Home: React.FC = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      SensorModel.check(0, 0)
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
    }, 500);

    return () => clearInterval(interval);
  }, []);
  return (
    <LoggedLayout selected="home">
      <p>oi</p>
    </LoggedLayout>
  );
};
