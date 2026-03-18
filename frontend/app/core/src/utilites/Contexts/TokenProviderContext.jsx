import { createContext, useContext, useState } from 'react';

const TokenContext = createContext();

export const Tokenprovider = ({ children }) => {
  const [token, setToken] = useState(
    'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzeXNhZG1pbiIsImlhdCI6MTczMjg4MjEyNywiZXhwIjoxNzMyODgzOTI3fQ.hgPIPKVti8ZrRWreDhUMIGbuqPdQpqyJmZyHLFaBx2Q',
  );

  return (
    <TokenContext.Provider value={{ token, setToken }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => useContext(TokenContext);
