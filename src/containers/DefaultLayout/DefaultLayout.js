import React, { Suspense, useReducer, useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';
import socketIOClient from "socket.io-client";

import {
  AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import navigation from '../../_nav';
// routes config
import routes from '../../routes';

const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

const initialState = { socket: undefined, mensagem: [], dispatch: undefined };

function reducer(state, action) {
  switch (action.type) {
    case "conectar":
      const socket = socketIOClient("http://localhost:5000");
      socket.on("db restore", msg => {
        action.payload({ type: "append", 'payload': msg });
      });
      return {
        ...state,
        socket,
        dispatch: action.payload 
      };
    case "append":
      return {
        ...state,
        mensagem: [action.payload, ...state.mensagem]
      };
    default:
      throw new Error();
  }
}
const DefaultLayout = props => {
  const loading = () => <div className="animated fadeIn pt-1 text-center"><div className="sk-spinner sk-spinner-pulse"></div></div>;
  const [state, dispatch] = useReducer(reducer, initialState);
  const [auxProps, setAuxProps] = useState(null)

  useEffect(() => {
    if (!state.socket)
      dispatch({type: 'conectar', payload: dispatch});
    setAuxProps({...props, ...{socket: state.socket, mensagem: state.mensagem, dispatch}});
  }, [state])

    return (
      <div className="app">
        <AppHeader fixed>
          <Suspense fallback={loading()}>
            <DefaultHeader />
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
              <AppSidebarNav navConfig={navigation} {...props} />
            </Suspense>
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            <AppBreadcrumb appRoutes={routes}/>
            <Container fluid>
              <Suspense fallback={loading()}>
                <Switch>
                  {routes.map((route, idx) => {
                    return route.component ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={props => (
                          <route.component {...auxProps} />
                        )} />
                    ) : (null);
                  })}
                  <Redirect from="/" to="/dashboard" />
                </Switch>
              </Suspense>
            </Container>
          </main>
        </div>
        <AppFooter>
          <Suspense fallback={loading()}>
            <DefaultFooter />
          </Suspense>
        </AppFooter>
      </div>
    );
}

export default DefaultLayout;
