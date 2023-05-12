import { createContext, useEffect, useState } from "react";
import { app } from "../config/firebase";

const ProcurementContext = createContext();

const ProcurementProvider = ({ children }) => {
  const [fetchProcurement, setFetchProcurement] = useState([]);

  const fetchLocation = () => {
    const document = app.firestore().collection("procurement");
    return document.onSnapshot((snapshot) => {
      const procurementArray = [];

      snapshot.forEach((procure) => {
        procurementArray.push({ ...procure.data(), id: procure.id });
      });

      setFetchProcurement(procurementArray);
    });
  };

  useEffect(fetchLocation, []);

  return (
    <ProcurementContext.Provider value={{ fetchProcurement }}>
      {children}
    </ProcurementContext.Provider>
  );
};

export { ProcurementProvider, ProcurementContext };
