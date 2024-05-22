import React from 'react';

import { LoggedLayout } from '../../layout/logged/LoggedLayout';
import { Status, Wrapper } from '@googlemaps/react-wrapper';
import MapComponent from '../../components/MapComponent';


export const Home: React.FC = () => {
  const apiKey = import.meta.env.VITE_REACT_APP_MAPS_API_KEY ?? 'API_KEY_NOT_SET';
  const render = (status: Status) => (<h1>{status}</h1>)
  return (
    <LoggedLayout selected="home">
      <div className="App">
        <Wrapper apiKey={apiKey} render={render}>
          <MapComponent />
        </Wrapper>
      </div>
    </LoggedLayout>
  );
};
