import { useState, useEffect, useContext } from "react";
import { app } from "../../config/firebase";
import { MyModal, Textfield } from "../";
import swal from "sweetalert";
import { Spin } from "antd";
import { MyDateString } from "../../Utils";
import { types } from "../../Utils/ReusableSyntax"
import { AuthContext } from '../../Context/auth'

const initialState = {
  distributionDate: "",
  distributionType: "",

  eventPurpose: "",
  // policeAddress: "",

  // storeName: "",

  // reliefEvent: "",
  // organization: "",

  quantity: 0,
  receiver: "",
  barangay: "",
  municipality: "",
  province: "",
};

const ACTIONS = {
  getPolice: "Police",
  getMarket: "Market",
  getRelief: "Relief Operation"
}

export default function AddDistribution({ isOpen, isClose, data }) {
  const [
    {
      distributionDate,
      distributionType,

      eventPurpose,

      // policeAddress,

      // storeName,

      // reliefEvent,
      // organization,

      quantity,
      receiver,
      barangay,
      municipality,
      province,
    },
    setState,
  ] = useState(initialState);
  const [loading, setLoading] = useState(false);
  //const [isTypes, setIsTypes] = useState({ police: false, market: false, relief: false })

  const context = useContext(AuthContext);

  // const onTypesSelect = () => {
  //   if (ACTIONS.getPolice === distributionType) {
  //     return setIsTypes(({ police }) => ({ police: !police, market: false, relief: false }))
  //   }

  //   if (ACTIONS.getMarket === distributionType) {
  //     return setIsTypes(({ market }) => ({ police: false, market: !market, relief: false }))
  //   }

  //   if (ACTIONS.getRelief === distributionType) {
  //     return setIsTypes(({ relief }) => ({ police: false, market: false, relief: !relief }))
  //   }

  // }

  //useEffect(onTypesSelect, [distributionType])

  const onChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;

    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const Loading = () => setLoading(true);

  const clearState = () => {
    setState({ ...initialState });
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    //const document = app.firestore();

    Loading();

    //const marketTotal = quantity * pricePerKilo

    if (ACTIONS.getPolice === distributionType) {
      distributionInfo("policeDistribution")
      // return await document.collection("policeDistribution").add({
      //   policeAddress,
      // }).then((docRef) => {
      //   distributionInfo(docRef.id, "policeDistribution")
      // })
    }

    if (ACTIONS.getMarket === distributionType) {
      distributionInfo("marketDistribution")
      // return await document.collection("marketDistribution").add({
      //   storeName
      // }).then((docRef) => {
      //   distributionInfo(docRef.id, "marketDistribution")
      // })
    }

    if (ACTIONS.getRelief === distributionType) {
      //console.log(reliefEvent, organization)
      distributionInfo("reliefDistribution")
      // return await document.collection("reliefDistribution").add({
      //   reliefEvent,
      //   organization
      // }).then((docRef) => {
      //   distributionInfo(docRef.id, "reliefDistribution")
      // })
    }

  };

  const distributionInfo = (name) => {
    const document = app.firestore().collection("distribution").doc();

    //console.log(name, eventPurpose)

    document
      .set({
        uid: context.uid,
        distributionDate,
        distributionName: name,
        distributionType,
        eventPurpose,
        quantity: Number(quantity),
        receiver,
        riceVariety: data.riceVariety,
        barangay,
        municipality,
        province,
        date_created: MyDateString,
      })
      .then(() => {
        onUpdateRiceMilled();
        setLoading(false);
        clearState();
        swal({
          title: "Success",
          text: `Successfully Added`,
          icon: "success",
          button: "Ok",
        });
      });
  }

  const onUpdateRiceMilled = () => {
    try {
      const document = app.firestore().collection("riceMilled").doc(data.id);

      const newSocks = Number(data.totalSocks) - Number(quantity);

      document.update({
        totalSocks: newSocks
      })
    } catch (error) {
      console.log(error.message);
    }
  }

  // const policeMarkdown = (
  //   <div className="w-full">
  //     <Textfield
  //       type="text"
  //       placeholder="address"
  //       name="policeAddress"
  //       value={policeAddress}
  //       onChange={(event) => onChange(event)}
  //     />
  //   </div>
  // )

  // const marketMarkdown = (
  //   <div className="w-full">
  //     <Textfield
  //       type="text"
  //       placeholder="Store name"
  //       name="storeName"
  //       value={storeName}
  //       onChange={(event) => onChange(event)}
  //     />
  //   </div>
  // )

  // const reliefMarkdown = (
  //   <div className="grid grid-cols-2 gap-4">
  //     <Textfield
  //       placeholder="Event"
  //       name="reliefEvent"
  //       value={reliefEvent}
  //       onChange={(event) => onChange(event)}
  //     />
  //     <Textfield
  //       type="text"
  //       placeholder="Organization"
  //       name="organization"
  //       value={organization}
  //       onChange={(event) => onChange(event)}
  //     />
  //   </div>
  // )

  return (
    <MyModal
      className="max-w-xl w-full h-full md:h-4/6 mx-auto p-8 rounded-sm"
      isOpen={isOpen}
    >
      <Spin spinning={loading}>
        <h1 className="text-2xl text-primary font-semibold mt-2">
          Distribution Information
        </h1>
        <form>
          {/* <div className="w-full">
            <Textfield
              type="date"
              onChange={(event) => onChange(event)}
              label="Distribution Date"
              value={distributionDate}
              name="distributionDate"
              placeholder="Distribution Date"
            />
          </div> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex items-center">
            {/* <Textfield
              type="text"
              value={data.riceVariety}
              label="Palay Variety"
              name="riceVariety"
              placeholder="Rice Variety"
            /> */}
            <Textfield
              type="date"
              onChange={(event) => onChange(event)}
              label="Distribution Date"
              value={distributionDate}
              name="distributionDate"
              placeholder="Distribution Date"
            />
            <Textfield
              type="number"
              onChange={(event) => onChange(event)}
              value={quantity}
              label="Number of Sacks"
              name="quantity"
              placeholder="Quantity"
            />
            {/* <Textfield
              type="text"
              onChange={(event) => onChange(event)}
              label="Distribution Type"
              value={distributionType}
              name="distributionType"
              placeholder="Distribution Type"
            /> */}
          </div>
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <Textfield
              type="number"
              onChange={(event) => onChange(event)}
              value={quantity}
              label="Number of Sacks"
              name="quantity"
              placeholder="Quantity"
            />
          </div> */}
          {/* {distributionType !== "" && (
            <div className="my-2">
              <h1 className="text-lg font-semibold">{distributionType} Details</h1>
              {isTypes.police && policeMarkdown}
              {isTypes.market && marketMarkdown}
              {isTypes.relief && reliefMarkdown}
            </div>
          )} */}
          <div className="my-2">
            <h1 className="text-lg font-semibold">Recipient Details</h1>
            <div className="flex items-center grid grid-cols-1 md:grid-cols-2 gap-3">
              <Textfield
                type="text"
                placeholder="Recipient Name"
                name="receiver"
                label="Recipient Name"
                value={receiver}
                onChange={(event) => onChange(event)}
              />
              <div className="mt-2">
                <label
                  className="block mb-2 text-gray-700 text-sm font-semibold"
                >
                  Recipient Type
                </label>
                <select value={distributionType} name="distributionType" onChange={(event) => onChange(event)} className="block w-full h-10 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <option value=""></option>
                  {types.map((type) => (
                    <option value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <Textfield
                type="text"
                placeholder="Event Purpose"
                name="eventPurpose"
                label="Event Purpose"
                value={eventPurpose}
                onChange={(event) => onChange(event)}
              />
              <Textfield
                type="text"
                onChange={(event) => onChange(event)}
                label="Barangay"
                value={barangay}
                name="barangay"
                placeholder="Barangay"
              />
              <Textfield
                type="text"
                onChange={(event) => onChange(event)}
                label="Municipality"
                value={municipality}
                name="municipality"
                placeholder="Municipality"
              />
              <Textfield
                type="text"
                onChange={(event) => onChange(event)}
                label="Province"
                value={province}
                name="province"
                placeholder="Province"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={(event) => isClose(event)}
              className="px-6 py-1 border border-primary bg-gray-100 hover:bg-gray-200 text-black text-sm rounded-sm focus:outline-none focus:shadow-outline "
            >
              Cancel
            </button>
            <button
              onClick={(event) => onSubmit(event)}
              className="bg-primary hover:bg-primary-slight text-white px-8 py-1 text-sm my-3 font-semibold rounded-sm"
            >
              Save
            </button>
          </div>
        </form>
      </Spin>
    </MyModal>
  );
}
