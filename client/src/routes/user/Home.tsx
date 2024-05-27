import React from 'react';

import MapFilter from '../../components/MapFilter'
import MapComponent from '../../components/MapComponent';
import { LoggedLayout } from '../../layout/logged/LoggedLayout';
import { Status, Wrapper } from '@googlemaps/react-wrapper';
import { MAPS_API_KEY } from '../../config';
import { Flex, Spin } from 'antd';

export const Home: React.FC = () => {
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
        <MapFilter />
        <MapComponent />
      </Wrapper>
    </LoggedLayout>
  );
};
