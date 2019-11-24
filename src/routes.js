import React from 'react';

const RestoreDB  = React.lazy(() => import('./views/restore-db/RestoreDB'));
const Dashboard = React.lazy(() => import('./views/Dashboard'));
const RestoreWetranfer = React.lazy(() => import('./views/restore-wetransfer/RestoreWetransfer'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/restore-wetransfer', exact: true, name: "Restaurar Banco de Link WeTransfer", component: RestoreWetranfer},
  { path: '/restore-db', exact: true, name: 'Restaurar Banco de Dados', component: RestoreDB },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
];

export default routes;
