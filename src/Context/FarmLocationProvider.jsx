import { createContext, useEffect, useState } from "react";
import { app } from "../config/firebase";

const FarmLocationContext = createContext();

const FarmLocationProvider = ({ children }) => {
  const [fetchFarmLocation, setFetchFarmLocation] = useState([]);

  const fetchLocation = () => {
    const document = app.firestore().collection("farmLocation");
    return document.onSnapshot((snapshot) => {
      const farmLocationArray = [];

      snapshot.forEach((farmLocation) => {
        farmLocationArray.push({ ...farmLocation.data(), id: farmLocation.id });
      });

      setFetchFarmLocation(farmLocationArray);
    });
  };

  useEffect(fetchLocation, []);

  return (
    <FarmLocationContext.Provider value={{ fetchFarmLocation }}>
      {children}
    </FarmLocationContext.Provider>
  );
};

export { FarmLocationProvider, FarmLocationContext };
