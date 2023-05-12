import { createContext, useState, useEffect } from "react";
import { monthDiff } from '../Utils/ReusableSyntax'
import { Months } from "../Utils";
import { app } from "../config/firebase";

const TransactionContext = createContext();

const TranscationProvider = ({ children }) => {
  const [transaction, setTransaction] = useState([]);
  const [finishTransaction, setFinishTransaction] = useState([]);
  const [riceMilled, setRiceMilled] = useState([]);


  const fetchTransaction = () => {
    const document = app.firestore().collection("transaction");
    return document.onSnapshot((snapshot) => {
      const transactionArray = [];

      snapshot.forEach((transactionData) => {
        transactionArray.push({
          ...transactionData.data(),
          id: transactionData.id,
        });
        setTransaction(transactionArray);
      });
    });
  };

  useEffect(fetchTransaction, []);

  const fetchDoneBidding = () => {
    const document = app.firestore().collection("transaction").where("biddingStatus", "==", false)
    const dateToday = new Date();
    return document.onSnapshot((snapshot) => {
      const transactionArray = [];

      snapshot.forEach((transactionData) => {
        const dateHarv = new Date(transactionData.data().dateHarvested.seconds * 1000);
        const productAge = monthDiff(dateHarv, dateToday);
        const month = new Date(transactionData.data().date_created.seconds * 1000)
        transactionArray.push({
          ...transactionData.data(),
          id: transactionData.id,
          productAge: productAge,
          date_format: Months[month.getMonth()]
        });
        setFinishTransaction(transactionArray);
      });
    });
  }

  useEffect(fetchDoneBidding, [])

  const fetchRiceMilled = () => {
    const document = app.firestore().collection("riceMilled").where("totalSocks", ">", 0)
    return document.onSnapshot((snapshot) => {
      const riceMilledArray = [];

      snapshot.forEach((riceMilledData) => {
        riceMilledArray.push({
          ...riceMilledData.data(),
          id: riceMilledData.id,
        });
      });
      setRiceMilled(riceMilledArray);
    });
  }

  useEffect(fetchRiceMilled, []);

  return (
    <TransactionContext.Provider
      value={{ transaction, finishTransaction, riceMilled }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export { TransactionContext, TranscationProvider };
