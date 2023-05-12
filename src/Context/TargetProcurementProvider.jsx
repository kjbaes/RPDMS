import { createContext, useEffect, useState } from "react";
import { app } from "../config/firebase";

const TargetProcurementContext = createContext();

const TargetProcurementProvider = ({ children }) => {
    const [target, fetcgTarget] = useState([]);

    const dateToday = new Date();

    const fetchLocation = () => {
        const document = app
            .firestore()
            .collection("targetProcurement");
        return document.onSnapshot((snapshot) => {
            const procurementArray = [];

            snapshot.forEach((procure) => {
                procurementArray.push({ ...procure.data(), id: procure.id });
            });

            fetcgTarget(procurementArray);
        });
    };

    useEffect(fetchLocation, []);

    return (
        <TargetProcurementContext.Provider value={{ target }}>
            {children}
        </TargetProcurementContext.Provider>
    );
};

export { TargetProcurementProvider, TargetProcurementContext };
