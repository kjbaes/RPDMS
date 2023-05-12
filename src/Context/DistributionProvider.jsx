import { createContext, useEffect, useState } from "react";
import { Months } from "../Utils";
import { app } from "../config/firebase";

const DistributionContext = createContext();

const DistributionProvider = ({ children }) => {
  const [distribution, setDistribution] = useState([]);

  const fetchDistribution = () => {
    const document = app.firestore();
    const documentDistribution = document.collection("distribution")

    return documentDistribution.onSnapshot((snapshot) => {
      const distributionArray = [];

      snapshot.forEach((distributionData) => {

        const month = new Date(distributionData.data().distributionDate)
        distributionArray.push({
          ...distributionData.data(),
          id: distributionData.id,
          date_format: Months[month.getMonth()]
        });
      });

      setDistribution(distributionArray);
    });
  };

  useEffect(fetchDistribution, []);

  return (
    <DistributionContext.Provider value={{ distribution }}>
      {children}
    </DistributionContext.Provider>
  );
};

export { DistributionProvider, DistributionContext };
