import { useState, useEffect, useContext } from "react";
import { MyModal } from "../";
import { Card } from "../";
import { app } from "../../config/firebase";
import swal from "sweetalert";
import { Spin } from "antd";
import { ProductContext } from "../../Context/ProductProvider";
import { AuthContext } from "../../Context/auth";
import { objectAssign, onUpdateProduct, getQuarter } from "../../Utils/ReusableSyntax";
import RolesHook from "../../lib/RolesHook";
import UseTargetPocurement from '../../lib/UseTargetPocurement'
import { X } from "react-feather";

//const date = new Date();

const inputStyle =
  "mt-2 text-sm appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-10";

const initialState = {
  imageUrl: "",
  socks: "",
  price: "",
  riceVariety: "",
  kiloPerSack: 0,
  email: "",
  description: "",
  uid: "",
  dateHarvested: {
    seconds: 0,
    nanoseconds: 0
  },
};

export default function Bidding({ open, onClose, id }) {
  const { imageUrl, socks, price, riceVariety, email, description, uid, dateHarvested, kiloPerSack } =
    initialState;

  const [bidding, setBidding] = useState(0);
  const [getSocks, setSocks] = useState(0);
  const [loading, setLoading] = useState(false);

  const { fetchProd, setId } = useContext(ProductContext);
  const context = useContext(AuthContext);
  fetchProd && objectAssign(fetchProd, initialState);
  const { getTarget } = UseTargetPocurement();
  const dateToday = new Date();

  const { info } = RolesHook();

  const Loading = () => setLoading(true);

  useEffect(() => {
    id && setId(id);
  }, [id, setId]);

  const clearState = () => {
    setBidding(0);
    setSocks(0);
  };

  const onUpdateTargetNumber = (socks) => {
    const document = app.firestore().collection("targetProcurement").doc(getTarget.id);

    const newTargetValue = getTarget.targetNumber - socks;

    document.update({
      targetNumber: newTargetValue
    });
  }

  const onSubmitNFA = (event) => {
    event.preventDefault();

    const document = app.firestore().collection("transaction").doc();
    const defaultNFAPrice = 19
    const totalKilo = getSocks * kiloPerSack
    const subTotal = getSocks * kiloPerSack * defaultNFAPrice

    console.log(getSocks, kiloPerSack, price, subTotal);

    const checkSocks = Number(getSocks) > Number(socks);
    const isCheckTarget = Number(totalKilo) > Number(getTarget.targetNumber)
    const isTargetZero = Number(getTarget.targetNumber) === 0;
    const isZero = Number(getSocks) === 0;

    //console.log(checkSocks, isCheckTarget, isTargetZero, isZero)

    if (isTargetZero) {
      return swal({
        title: "Success",
        text: `Target successfully ended, good job! :)`,
        icon: "success",
        button: "Ok",
      });
    }

    if (checkSocks || isZero) {
      return swal({
        title: "Warning!!!",
        text: `Invalid attempt socks`,
        icon: "warning",
        button: "Ok",
      });
    }

    if (isCheckTarget) {
      return swal({
        title: "Warning!!!",
        text: `Exceeding in target procurement`,
        icon: "warning",
        button: "Ok",
      })
    }

    const quarter = getQuarter(new Date())

    if (!checkSocks && !isZero && !isTargetZero) {
      Loading();
      document
        .set({
          owned: null,
          imageUrl,
          isNFA: true,
          socks: Number(getSocks),
          farmerEmail: email,
          userEmail: context.email,
          productId: fetchProd[0].id,
          riceVariety: riceVariety,
          price: defaultNFAPrice,
          totalKilograms: Number(totalKilo),
          total: Number(subTotal),
          reviewStatus: true,
          biddingStatus: true,
          uid: context.uid,
          farmerId: uid,
          kiloPerSack,
          quarter: `Q${quarter}`,
          status: "pending",
          date_created: dateToday,
          isMilled: false,
          dateHarvested: new Date(dateHarvested.seconds * 1000)
        })
        .then(() => {
          //onUpdateTargetNumber(Number(total));
          //onUpdateProduct(fetchProd[0].id, getSocks, app);
          setLoading(false);
          clearState();
          swal({
            title: "Successfully",
            text: `Successfully added to your cart`,
            icon: "success",
            button: "Ok",
          });
        });
    }
  };


  // const transactionDocument = (id) => {
  //   const documentTransaction = document.collection("transaction").doc(id);

  //   documentTransaction.update({
  //     status: "success"
  //   });
  // }


  const onSubmit = (event) => {
    event.preventDefault();
    const totalKilo = getSocks * kiloPerSack
    const subTotal = getSocks * kiloPerSack * bidding

    const document = app.firestore().collection("transaction").doc();

    const checkSocks = Number(getSocks) > Number(socks);
    const checkBidding = Number(bidding) === 0;

    if (checkSocks) {
      return swal({
        title: "Warning!!!",
        text: `Invalid attempt socks`,
        icon: "warning",
        button: "Ok",
      });
    }

    if (checkBidding) {
      return swal({
        title: "Warning!!!",
        text: `Invalid attempt Bidding`,
        icon: "warning",
        button: "Ok",
      });
    }

    if (!checkSocks && !checkBidding) {
      Loading();
      document
        .set({
          owned: null,
          imageUrl,
          isNFA: false,
          socks: Number(getSocks),
          farmerEmail: email,
          userEmail: context.email,
          productId: fetchProd[0].id,
          riceVariety: riceVariety,
          price: Number(bidding),
          totalKilograms: Number(totalKilo),
          total: Number(subTotal),
          reviewStatus: true,
          biddingStatus: true,
          uid: context.uid,
          farmerId: uid,
          kiloPerSack,
          status: "pending",
          date_created: dateToday,
          isMilled: false,
          dateHarvested: new Date(dateHarvested.seconds * 1000)
        })
        .then(() => {
          setLoading(false);
          clearState();
          swal({
            title: "Successfully",
            text: `Successfully added your bid`,
            icon: "success",
            button: "Ok",
          });
        });
    }
  };

  return (
    <MyModal
      className="max-w-4xl h-auto mx-auto rounded-lg p-10 relative h-auto"
      isOpen={open}
    >
      <X
        onClick={(event) => onClose(event)}
        className="w-6 h-6 absolute inset-y-4 right-4 cursor-pointer"
      />
      <Spin spinning={loading}>
        <section className="md:flex gap-4 mt-60 md:mt-0">
          {/* <p>{kiloPerSack}</p> */}
          <Card
            kiloPerSack={kiloPerSack}
            imageUrl={imageUrl}
            kilograms={socks}
            price={price}
            riceVariety={riceVariety}
            email={email}
            description={description}
          />
          <div className="w-full mt-4 md:mt-0">
            <h1 className="text-2xl font-bold">Bidding Information</h1>
            <h2 className="my-2 text-sm text-red-500">
              User Email :{" "}
              <strong className="text-red-500">{context.email}</strong>
            </h2>
            <form
              action=""
              onSubmit={(event) =>
                info.role === "NFA" ? onSubmitNFA(event) : onSubmit(event)
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="font-bold text-sm">Email</label>
                  <input
                    value={email}
                    readOnly={true}
                    required
                    type="text"
                    className={`${inputStyle} bg-gray-200`}
                    placeholder="email"
                    name="email"
                  />
                </div>
                <div>
                  <label className="font-bold text-sm">Number of sacks</label>
                  <input
                    value={socks}
                    readOnly={true}
                    required
                    type="number"
                    className={`${inputStyle} bg-gray-200`}
                    placeholder="socks"
                    name="socks"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="font-bold text-sm">Price</label>
                  <input
                    value={price}
                    readOnly={true}
                    required
                    type="number"
                    className={`${inputStyle} bg-gray-200`}
                    placeholder="Price Per Kilo"
                    name="pricePerKilo"
                  />
                </div>
                <div>
                  <label className="font-bold text-sm">Palay Variety</label>
                  <input
                    value={riceVariety}
                    readOnly={true}
                    required
                    type="text"
                    className={`${inputStyle} bg-gray-200`}
                    placeholder="Rice Variety"
                    name="riceVarity"
                  />
                </div>
              </div>
              <div className="mt-2">
                <label className="font-bold text-sm">Description</label>
                <textarea
                  value={description}
                  readOnly={true}
                  id="description"
                  required
                  name="description"
                  placeholder="Description..."
                  className="mt-2 text-sm appearance-none rounded w-full py-2 px-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                  cols={20}
                  rows={2}
                />
                <div className={`${info.role === "NFA" ? "w-full mt-3" : "mt-2 grid grid-cols-2 gap-4"}`}>
                  <div>
                    <label htmlFor="" className="font-bold text-sm">
                      Number of Sacks
                    </label>
                    <input
                      required
                      onChange={(event) => setSocks(event.target.value)}
                      value={getSocks}
                      type="number"
                      className={`${inputStyle} bg-gray-100 mt-2`}
                    />
                  </div>
                  {info.role !== "NFA" && (
                    <div>
                      <label htmlFor="" className="font-bold text-sm">
                        Bidding
                      </label>
                      <input
                        required
                        onChange={(event) => setBidding(event.target.value)}
                        value={bidding}
                        type="number"
                        className={`${inputStyle} bg-gray-100 mt-2`}
                      />
                    </div>
                  )}
                </div>
              </div>
              <button className="mt-4 w-full bg-primary hover:bg-primary-slight text-white text-sm py-2 font-semibold rounded-sm focus:outline-none focus:shadow-outline h-10">
                {info.role === "NFA" ? "Purchase palay" : "Place your bid"}
              </button>
            </form>
          </div>
        </section>
      </Spin>
    </MyModal>
  );
}
