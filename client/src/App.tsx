import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { router } from './router';
import {
  LoggedWrapper,
} from './Wrappers';

const App: React.FC = () => {
  return (
    <>
      <BrowserRouter>
        <LoggedWrapper>
                <Routes>
                  {router.map((route, i) =>
                    route.prefix ? (
                      <Route key={i} path={'/' + route.prefix}>
                        {route.routes.map((r, j) => (
                          <Route key={j} path={r.path} element={r.element} />
                        ))}
                      </Route>
                    ) : (
                      route.routes.map((r, j) => (
                        <Route key={j} path={r.path} element={r.element} />
                      ))
                    )
                  )}
                </Routes>
        </LoggedWrapper>
      </BrowserRouter>
    </>
  );
};

export default App;
