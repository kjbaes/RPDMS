import React, { createContext, useEffect, useState } from "react";
import { app } from "../config/firebase";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userInformation, setUserInformation] = useState([]);

  const fetchUserInformations = () => {
    const document = app.firestore().collection("user");

    return document.onSnapshot((onsnapshot) => {
      const userData = [];
      onsnapshot.forEach((item) => {
        userData.push({ ...item.data(), id: item.id });
      });
      setUserInformation(userData);
    });
  };

  useEffect(fetchUserInformations, []);

  return (
    <UserContext.Provider value={{ userInformation }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
