/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import ChangePassword from '../pages/ChangePassword';
import Error from '../pages/Error';
import FirstTimeLogin from '../pages/FirstTimeLogin';
import GraphQLExplorer from '../pages/Graphql/GraphQLExplorer';
import Home from '../pages/Home';
import Launcher from '../pages/Launcher';
import DevLayout from '../pages/layout/DevLayout';
import Login from '../pages/Login';
import NoPermission from '../pages/NoPermission';
import { useGlobalContext } from '../utilites/Contexts/GlobalContext';

function UamNavigations() {
  const location = useLocation();
  const navigate = useNavigate();
  const { globalState } = useGlobalContext();

  React.useEffect(() => {
    if (globalState['initApp'] === undefined && location.pathname !== '/login')
      navigate('/');
  }, [globalState['initApp']]);

  React.useEffect(() => {
    document.title = import.meta.env.VITE_APP_NAME || __APP_NAME__ || 'AIS';
  }, []);

  return (
    <>
      <Routes>
        <Route exact path="/" Component={Login} />
        <Route exact path="/login" Component={Login} />
        <Route extact path="/change-password" Component={ChangePassword} />
        <Route extact path="/firstTimeLogin" Component={FirstTimeLogin} />
        <Route exact path="/home" Component={Home} />
        <Route exact path="/launcher" Component={Launcher} />
        <Route exact path="/no-permission" Component={NoPermission} />
        <Route exact path="/manage" Component={DevLayout} />
        <Route exact path="/graphiql" Component={GraphQLExplorer} />
        <Route exact path="/error" Component={Error} />
      </Routes>
    </>
  );
}

export default UamNavigations;
