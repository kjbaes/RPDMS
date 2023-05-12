import { useState, useContext } from "react";
import { app } from "../../config/firebase";
import { MyModal, Textfield } from "../";
import swal from "sweetalert";
import { Spin } from "antd";
import { getQuarter } from "../../Utils/ReusableSyntax";
import { MyDateString } from "../../Utils";
import { AuthContext } from '../../Context/auth'

const initialState = {
  procurementDate: "",
  palayVariety: "",
  quantity: 0,
  pricePerKilo: "",
  farmerName: "",
};

export default function AddProcurement({ isOpen, isClose }) {
  const [
    { procurementDate, palayVariety, quantity, pricePerKilo, farmerName },
    setState,
  ] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const context = useContext(AuthContext);

  const onChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;

    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const clearState = () => {
    setState({ ...initialState });
  };

  const Loading = () => setLoading(true);


  const onSubmit = (event) => {
    event.preventDefault();

    Loading();
    const totalPrice = Number(quantity) * Number(pricePerKilo);
    const document = app.firestore().collection("procurement").doc();

    const quarter = getQuarter(new Date(procurementDate))

    document
      .set({
        uid: context.uid,
        procurementDate,
        palayVariety,
        quantity: Number(quantity),
        pricePerKilo: Number(pricePerKilo),
        quarter: `Q${quarter}`,
        farmerName,
        totalPrice,
        date_created: MyDateString,
      })
      .then(() => {
        setLoading(false);
        clearState();
        swal({
          title: "Success",
          text: `Successfully Added`,
          icon: "success",
          button: "Ok",
        });
      });
  };

  return (
    <MyModal
      className="max-w-xl w-full h-full md:h-4/6 mx-auto p-6 rounded-sm"
      isOpen={isOpen}
    >
      <Spin spinning={loading}>
        <h1 className="text-2xl text-primary font-semibold text-center mt-2">
          Procurement Information
        </h1>
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Textfield
              type="date"
              onChange={(event) => onChange(event)}
              label="Procurement Date"
              value={procurementDate}
              name="procurementDate"
              placeholder="procurement Date"
            />
            <Textfield
              type="text"
              onChange={(event) => onChange(event)}
              label="Palay Variety"
              value={palayVariety}
              name="palayVariety"
              placeholder="Palay Variety"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Textfield
              type="number"
              onChange={(event) => onChange(event)}
              value={quantity}
              label="Quantity"
              name="quantity"
              placeholder="Quantity"
            />
            <Textfield
              type="number"
              onChange={(event) => onChange(event)}
              label="Price Per Kilo"
              value={pricePerKilo}
              name="pricePerKilo"
              placeholder="Price Per Kilo"
            />
          </div>
          <div className="w-full">
            <Textfield
              type="text"
              onChange={(event) => onChange(event)}
              label="Farmer Name"
              value={farmerName}
              name="farmerName"
              placeholder="Farmer Name"
            />
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
