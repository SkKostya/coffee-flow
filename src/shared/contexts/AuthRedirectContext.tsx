import React, { createContext, ReactNode, useContext, useState } from 'react';

interface AuthRedirectContextType {
  redirectPath: string | null;
  setRedirectPath: (path: string | null) => void;
  clearRedirectPath: () => void;
}

const AuthRedirectContext = createContext<AuthRedirectContextType | undefined>(
  undefined
);

interface AuthRedirectProviderProps {
  children: ReactNode;
}

export const AuthRedirectProvider: React.FC<AuthRedirectProviderProps> = ({
  children,
}) => {
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  const clearRedirectPath = () => {
    setRedirectPath(null);
  };

  return (
    <AuthRedirectContext.Provider
      value={{
        redirectPath,
        setRedirectPath,
        clearRedirectPath,
      }}
    >
      {children}
    </AuthRedirectContext.Provider>
  );
};

export const useAuthRedirect = (): AuthRedirectContextType => {
  const context = useContext(AuthRedirectContext);
  if (context === undefined) {
    throw new Error(
      'useAuthRedirect must be used within an AuthRedirectProvider'
    );
  }
  return context;
};
