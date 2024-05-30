import React, { useRef } from 'react';
import { Flex, Spin } from 'antd';
import { Status, Wrapper } from '@googlemaps/react-wrapper';

import { MapFilter } from '../../components/MapFilter';
import { LoggedLayout } from '../../layout/logged/LoggedLayout';
import { MAPS_API_KEY } from '../../config';
import { useAsync } from '../../utils/async';
import { RoutesModel } from '../../api/route';
import { useMap } from '../../components/useMap';

export const Home: React.FC = () => {
  const routes = useAsync(() => RoutesModel.getAllRoutes());
  const ref = useRef<HTMLDivElement>(null);
  const { map, changeRouteIds } = useMap(ref, false);

  const render = (status: Status) => {
    if (status === Status.LOADING) {
      return (
        <Flex
          justify="center"
          align="center"
          style={{ width: '100%', height: '100%' }}
        >
          <Spin size="large" />
        </Flex>
      );
    }
    return <span />;
  };
  return (
    <LoggedLayout selected="home">
      <Wrapper apiKey={MAPS_API_KEY} render={render}>
        <MapFilter
          routes={routes.result}
          loading={routes.loading}
          onSelectRoutes={changeRouteIds}
        />
        <div
          ref={ref}
          style={{
            height: 'calc(100vh - 186px)',
            width: '100%',
            display: map ? 'flex' : 'none',
          }}
        />
      </Wrapper>
    </LoggedLayout>
  );
};
