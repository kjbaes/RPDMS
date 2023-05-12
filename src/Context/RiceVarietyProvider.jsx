import { createContext, useEffect, useState } from "react";
import { app } from "../config/firebase";

const RiceVarietyContext = createContext();

const RiceVarietyProvider = ({ children }) => {
  const [fetchVariety, setVariety] = useState([]);

  const fetchVarietyData = () => {
    const document = app.firestore().collection("variety");
    return document.onSnapshot((snapshot) => {
      const varietyArray = [];

      snapshot.forEach((variety) => {
        varietyArray.push({ ...variety.data(), id: variety.id });
      });

      setVariety(varietyArray);
    });
  };

  useEffect(fetchVarietyData, []);

  return (
    <RiceVarietyContext.Provider value={{ fetchVariety }}>
      {children}
    </RiceVarietyContext.Provider>
  );
};

export { RiceVarietyProvider, RiceVarietyContext };
