import React, { createContext, useEffect, useState } from "react";
import { monthDiff } from '../Utils/ReusableSyntax'
import { app } from "../config/firebase";

const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  const [product, setProduct] = useState([]);
  const [fetchProd, setFetchProd] = useState([]);
  const [fetchTransactionData, setTransactionData] = useState([]);
  //const [userInfo, setUserInfo] = useState([]);
  const [id, setId] = useState("");

  const fetchTransaction = () => {
    const document = app.firestore().collection("transaction");

    return document.onSnapshot((onsnapshot) => {
      const transactionData = [];
      onsnapshot.forEach((item) => {
        transactionData.push({ ...item.data(), id: item.id });
      });
      setTransactionData(transactionData);
    });
  };

  useEffect(fetchTransaction, []);

  const fetchProduct = () => {
    const document = app.firestore();
    //const documentUser = document.collection("user");
    const documentProduct = document.collection("product");
    const dateToday = new Date();

    return documentProduct.onSnapshot((onsnapshot) => {
      const productData = [];
      onsnapshot.forEach((item) => {
        const date = new Date(item.data().dateHarvested.seconds * 1000)
        productData.push({ ...item.data(), id: item.id, productAge: monthDiff(date, dateToday) });
      });
      setProduct(productData);
    });
  };

  useEffect(fetchProduct, []);

  const fetchProducts = () => {
    if (id) {
      const document = app.firestore().collection("product").doc(id);
      return document.onSnapshot((snapshot) => {
        const items_array = [];
        if (snapshot) {
          items_array.push({ ...snapshot.data(), id: snapshot.id });
          setFetchProd(items_array);
        }
      });
    }
  };

  useEffect(fetchProducts, [id]);

  return (
    <ProductContext.Provider
      value={{ product, setId, fetchProd, fetchTransactionData }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export { ProductProvider, ProductContext };
