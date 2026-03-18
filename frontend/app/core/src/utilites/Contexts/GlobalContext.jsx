import React, { createContext, useContext, useState } from 'react';

const GlobalContext = createContext();

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

const initalState = {
  welcomeMsg: 'Welcome,',
  firstTimeLogin: false,
  logo: '',
  loading: false,
  username: 'Arun Pandian',
  aMenu: '',
  module_menu: '0',
  sideMenu: true,
  appPrimaryColor: '',
  appSecondaryColor: '',
};

export const GlobalProvider = ({ children }) => {
  //always maintain intial state in this file
  const [globalState, setGlobalState] = useState(initalState);

  const updateGlobalState = (data) => {
    setGlobalState((prevState) => {
      const newState = { ...prevState };

      Object.keys(data).forEach((key, i) => {
        newState[key] = data[key];
      });
      return newState;
    });
  };

  const resetGlobalState = () => {
    setGlobalState(initalState);
  };

  const sessionData = {
    userId: '',
    username: globalState.username,
  };

  return (
    <GlobalContext.Provider
      value={{ globalState, updateGlobalState, resetGlobalState, sessionData }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
