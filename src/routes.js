import React from 'react';

const RestoreDB  = React.lazy(() => import('./views/restore-db/RestoreDB'));
const Dashboard = React.lazy(() => import('./views/Dashboard'));
const RestoreWetranfer = React.lazy(() => import('./views/restore-wetransfer/RestoreWetransfer'));
const RodarSQL = React.lazy(() => import('./views/rodar-sql/RodarSQL'));
const Configs = React.lazy(() => import('./views/configs/Configs'));
const SqlVersao = React.lazy(() => import('./views/sql-versao/SqlVersao'));
const LimparPastaUpload = React.lazy(() => import('./views/limpar-pasta-upload/LimparPastaUpload'));
const ApagarDB = React.lazy(() => import('./views/apagar-db/ApagarDB'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/restore-wetransfer', exact: true, name: "Restaurar Banco de Link WeTransfer", component: RestoreWetranfer},
  { path: '/restore-db', exact: true, name: 'Restaurar Banco de Dados', component: RestoreDB },
  { path: '/rodar-sql', exact: true, name: 'Rodar SQL', component: RodarSQL },
  { path: '/configs', exact: true, name: 'Configurações', component: Configs },
  { path: '/sql-versao', exact: true, name: 'SQL da Versão', component: SqlVersao },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/limpar-pasta', name: 'Limpar Pasta', component: LimparPastaUpload },
  { path: '/apagar-db', exact: true, name: 'Apagar Bancos', component: ApagarDB },
];

export default routes;
