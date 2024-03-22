import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Foo } from './routes/Foo';

const routes = [{ path: '/', element: <Foo /> }];

const App: React.FC = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} {...route} />
          ))}
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
