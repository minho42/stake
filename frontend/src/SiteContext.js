import { createContext, useState } from "react";

export const SiteContext = createContext(null);

export const SiteProvider = ({ children }) => {
  const [isStakeChartModalOpen, setIsStakeChartModalOpen] = useState(false);

  return (
    <SiteContext.Provider value={{ isStakeChartModalOpen, setIsStakeChartModalOpen }}>
      {children}
    </SiteContext.Provider>
  );
};
