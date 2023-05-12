import theme from "./Theme";
const { fonts } = theme;
export const sortElements = ["kilograms", "riceVariety", "farmerIncome", "productAge"];
export const types = ["Police", "Market", "Relief Operation"]

export const map = {
  kilograms: "kilograms",
  riceVariety: "riceVariety",
  farmerIncome: "farmerIncome",
  productAge: "productAge",
};

export const removeDuplicates = (dataArray) => {
  return dataArray.filter((ele, ind) => ind === dataArray.findIndex(elem => elem.riceVariety === ele.riceVariety))
}

export const updatedDistribution = (dataArray) => {
  return Object.values(dataArray.reduce((obj, item) => {
    var key = item.date_format

    if (!obj[key]) {
      obj[key] = Object.assign(item)
    } else {
      obj[key].quantity += item.quantity
    }

    return obj
  }, {}))
}


export function getQuarter(d) {
  return Math.floor(d.getMonth() / 3) + 1
}

export const updated = (dataArray) => {
  return Object.values(dataArray.reduce((obj, item) => {
    var key = item.date_format;

    if (!obj[key]) {
      obj[key] = Object.assign(item)
    } else {
      obj[key].total += item.total
    }

    return obj
  }, {}))
}


export const filterDistribution = (dataArray, types) => {
  return dataArray.filter((obj) => {
    return obj.distributionType === types
  })
}


export const nineMonthsMilled = (dataArray) => {
  return dataArray.filter((obj) => {
    return obj.productAge >= 9
  })
}

export const sixMonthsMilled = (dataArray) => {
  return dataArray.filter((obj) => {
    return obj.productAge === 6;
  })
}

export const threeMonthsOld = (dataArray) => {
  return dataArray.filter((obj) => {
    return obj.productAge === 3;
  })
}

export const buildScales = (axes) => {
  const scales = {
    xAxes: [
      {
        ticks: {
          fontFamily: fonts.inter,
          fontSize: 15,
        },
      },
    ],
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
          fontFamily: fonts.inter,
          fontSize: 12,
        },
      },
    ],
  };

  return axes ? scales : null;
};

export const buildLegend = (legend) => {
  const leg = {
    position: "right",
    align: "start",
    labels: {
      fontFamily: fonts.inter,
    },
  };

  return legend ? leg : null;
};

export const filteredByNFA = (dataArray, context) => {
  return dataArray.filter((obj) => {
    return obj.isNFA === true && obj.uid === context.uid && obj.isMilled === false && obj.status === "success";
  })
}

export const OrderByNFA = (dataArray, context) => {
  return dataArray((obj) => {
    return obj.isNFA === true && obj.uid === context.uid
  })
}

export const filterTransactionStatus = (transaction) => {
  return transaction.filter((obj) => {
    return obj.status === "success"
  })
}

export const monthDiff = (d1, d2) => {
  var months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
}

export const palayMonths = (dataArray) => {
  return dataArray.filter((obj) => {
    return obj.productAge >= 9;
  })
}

//**update product stocks*/
export const onUpdateProduct = (productId, NumOfSocks, app) => {
  try {
    (async () => {
      const document = app.firestore().collection("product").doc(productId);

      const getValue = await document.get();

      if (getValue) {
        const newSocks = getValue.data().socks - NumOfSocks;

        await document.update({
          socks: newSocks
        })
      }
    })()
  } catch (error) {
    console.log(error.message);
  }
}

export const sortFarmerIncome = (product, sortType) => {
  const sortedData = product.sort((a, b) => {
    if (sortType === "farmerIncome" || sortType === "kilograms") {
      return a[sortTypes] - b[sortTypes];
    }
  });
  return sortedData;
};

//*Table Sorting
export const sortTypes = ["descend", "ascend"];
export const sortRiceVariety = (a, b) =>
  a.riceVariety < b.riceVariety ? 1 : -1;

// //**return all pending items
// export const pendingItems = (cartItems) => {
//   return cartItems.filter((obj) => {
//     return obj.itemStatus === "pending";
//   });
// };

//*Filter Transaction by Rice Variety
export const filterTransaction = (transaction, riceVariety) => {
  return transaction.filter((obj) => {
    return obj.riceVariety === riceVariety;
  });
};

//*Convert Array Object into Object
export const objectAssign = (ObjectArray, obj) => {
  return ObjectArray.map((info) => {
    return Object.assign(obj, info);
  });
};

//**filtered items according to user authentication */
export const filtered = (productItems, currentUseriId) => {
  return productItems.filter((obj) => {
    return obj.uid === currentUseriId.uid;
  });
};

export const filteredWonTheBet = (productItems) => {
  return productItems.filter((obj) => {
    return obj.owned === "won";
  });
};

export const filteredLoseTheBet = (productItems) => {
  return productItems.filter((obj) => {
    return obj.owned === "lose";
  });
};


//**filtered Farmer transaction by owners id and biddingStatus equal to true */
export const filteredTransaction = (transaction, currentUseriId) => {
  return transaction.filter((obj) => {
    return obj.farmerId === currentUseriId.uid && obj.biddingStatus === true;
  });
};

//**filtered Farmer transaction by owners id and BiddingStatus Equal to false */
export const filteredDoneTransaction = (transaction, currentUseriId) => {
  return transaction.filter((obj) => {
    return (
      obj.farmerId === currentUseriId.uid &&
      obj.biddingStatus === false &&
      obj.owned === "won" &&
      obj.status === "success"
    );
  });
};

//**filtered NFA transaction status is equal to pending */
export const filteredPendingTransaction = (transaction, currentUseriId) => {
  return transaction.filter((obj) => {
    return (
      obj.uid === currentUseriId.uid &&
      obj.status === "pending"
    );
  });
};

//* getData slice with by 5 on each row
export const arraySlice = (filteredProduct, current, dataShowed) => {
  const indexLastData = current * dataShowed;
  const indexOfFirstData = indexLastData - dataShowed;
  const currentData = filteredProduct.slice(indexOfFirstData, indexLastData);

  return currentData;
};

//**Returning match search value from server */
export const onSearch = (value, items) => {
  return items.filter((data) => {
    return Object.keys(data).some((key) => {
      return String(data[key]).toLowerCase().includes(value.toLowerCase());
    });
  });
};

export const filterTotal = (dataArray) => {
  const subTotal = dataArray.reduce((a, b) => a + b.price, 0);
  return subTotal;
};

export const filterTotalRiceMilled = (dataArray) => {
  const subTotal = dataArray.reduce((a, b) => a + b.totalKilograms, 0);
  return subTotal;
};


export const sortNumber = (product, sortType) => {
  return product.sort((a, b) => {
    if (
      sortType === "farmerIncome" ||
      sortType === "kilograms" ||
      sortType === "productAge"
    ) {
      return a[sortType] - b[sortType];
    } else {
      return a.riceVariety !== b.riceVariety
        ? a.riceVariety < b.riceVariety
          ? -1
          : 1
        : 0;
    }
  });
}

// export const filterProduct = (filterProduct, context) => {
//   return filterProduct.filter((obj) => {
//     return obj.uid === context.uid;
//   })
// }

// //* return numerica and alphabetical sorted data
// export const sortedIncome = (filterProduct, sortTypes) => {
//   const sortedData = filterProduct.sort((a, b) => {
//     return b[sortTypes] - a[sortTypes];
//   });
//   return sortedData;
// };
