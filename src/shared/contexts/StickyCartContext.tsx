import React, { createContext, ReactNode, useContext, useState } from 'react';

interface StickyCartContextType {
  cartHeight: number;
  setCartHeight: (height: number) => void;
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

const StickyCartContext = createContext<StickyCartContextType | undefined>(
  undefined
);

interface StickyCartProviderProps {
  children: ReactNode;
}

export const StickyCartProvider: React.FC<StickyCartProviderProps> = ({
  children,
}) => {
  const [cartHeight, setCartHeight] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  return (
    <StickyCartContext.Provider
      value={{
        cartHeight,
        setCartHeight,
        isVisible,
        setIsVisible,
      }}
    >
      {children}
    </StickyCartContext.Provider>
  );
};

export const useStickyCartContext = (): StickyCartContextType => {
  const context = useContext(StickyCartContext);
  if (!context) {
    throw new Error(
      'useStickyCartContext must be used within a StickyCartProvider'
    );
  }
  return context;
};
