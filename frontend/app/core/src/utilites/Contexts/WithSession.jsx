import React, { createContext, useContext } from 'react';
import { useGlobalContext } from './GlobalContext';

const SessionContext = createContext(null);

export const SessionProvider = ({ children }) => {
  const { globalState } = useGlobalContext();
  const sessionData = {
    userId: '',
    username: globalState.username,
    userType: globalState.userType,
    groupId: globalState.groupId,
    roleId: '',
    roles: [],
    institutionId: '001',
    divisionId: '12',
    moduleKey: globalState.module_key,
    appLogo: null,
    appPrimaryColor: '232454',
    appSecondaryColor: '4bcd3e',
    appInfoColor: null,
    appWarningColor: null,
    appSuccessColor: null,
    appDangerColor: null,
  };
  return (
    <SessionContext.Provider value={sessionData}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error(`useSession must be used within a Sessionprovider`);
  }
  return context;
};

export function WithSession(WrappedComponent) {
  return function ComponentWithSession(props) {
    const session = useSession();
    return <WrappedComponent {...props} {...session} />;
  };
}
