import React, { useState, useEffect, useContext } from "react";
import { objectAssign } from "../../Utils/ReusableSyntax";
import { app } from "../../config/firebase";
import { Textfield, Card } from "../../components";
import { Spin, Popconfirm } from "antd";
import { ProductContext } from "../../Context/ProductProvider";
import swal from "sweetalert";

const information = {
  dateHarvestedFormat: "",
  imageUrl: "",
  riceVariety: "",
  email: "",
  socks: "",
  price: "",
  kiloPerSack: 0,
  description: "",
};

const UpdateProduct = (props) => {
  const [loading, setLoading] = useState(false);
  const { setId, fetchProd } = useContext(ProductContext);
  const params = new URLSearchParams(props.location.search);
  const id = params.get("id");

  const [
    { dateHarvestedFormat, riceVariety, email, socks, price, description, kiloPerSack },
    setState,
  ] = useState(information);

  fetchProd && objectAssign(fetchProd, information);

  //const [productInformation, setProductInformation] = useState([]);
  //productInformation && objectAssign(productInformation, information);

  const onChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  useEffect(() => {
    id && setId(id);
  }, [id, setId]);

  const Loading = () => setLoading(true);

  const onSubmit = async (event) => {
    event.preventDefault();
    const dateTimeStamp = new Date(dateHarvestedFormat);

    Loading();

    const document = app.firestore().collection("product").doc(id);

    document
      .update({
        riceVariety,
        email,
        socks: Number(socks),
        price: Number(price),
        dateHarvested: dateTimeStamp,
        dateHarvestedFormat,
        kiloPerSack: Number(kiloPerSack),
        description,
        id,
      })
      .then(() => {
        setLoading(false);
        swal({
          title: "Success",
          text: `Successfully updated`,
          icon: "success",
          button: "Ok",
        });
      });

    // httpRequest
    //   .put(
    //     "/.netlify/functions/index?name=updateProduct&&component=productComponent",
    //     config
    //   )
    //   .then(() => {
    // setLoading(false);
    // swal({
    //   title: "Success",
    //   text: `Successfully updated`,
    //   icon: "success",
    //   button: "Ok",
    // });
    //   });
  };


  return (
    <Spin spinning={loading}>
      <div className="max-w-5xl bg-white rounded-lg mx-auto w-full shadow-lg p-6">
        <h1 className="text-2xl font-bold">Update Product</h1>
        <section className="flex md:flex-row flex-col justify-center gap-4">
          <div className="w-full md:w-1/2">
            <div className="flex items-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Textfield
                value={dateHarvestedFormat}
                onChange={(event) => onChange(event)}
                label="Date Harvested"
                type="date"
                name="dateHarvestedFormat"
              />
              {/* <div className="mb-1 sm:mb-4 mt-1 sm:mt-6">
                <label
                  className="block text-gray-700 text-sm font-semibold mb-2"
                  htmlFor="email"
                >
                  Date harvested
                </label>
                <input type="date" name="dateHarvested" onChange={(event) => onChange(event)} value={dateHarv} data-date="" data-date-format="YYYY-MM-DD" className=" text-sm appearance-none rounded w-full py-2 px-3 text-gray-700 bg-gray-100 leading-tight focus:outline-none focus:shadow-outline h-10" />
              </div> */}
              <Textfield
                value={riceVariety}
                onChange={(event) => onChange(event)}
                label="Palay Variety"
                type="text"
                placeholder="Palay Variety"
                name="riceVariety"
              />
              <Textfield
                readOnly={true}
                value={email}
                onChange={(event) => onChange(event)}
                label="Owner Email"
                type="email"
                placeholder="Owner Email"
                name="email"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Textfield
                value={socks}
                onChange={(event) => onChange(event)}
                label="Number of Sacks"
                type="number"
                placeholder="Socks"
                name="socks"
              />
              <Textfield
                value={price}
                onChange={(event) => onChange(event)}
                label="Price"
                type="number"
                placeholder="Price"
                name="price"
              />
              <Textfield
                onChange={(event) => onChange(event)}
                value={kiloPerSack}
                label="Kilo Per Sacks"
                type="number"
                name="kiloPerSack"
              />
            </div>
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              value={description}
              onChange={(event) => onChange(event)}
              id="description"
              required
              name="description"
              placeholder="Description..."
              className="w-full border rounded px-2 py-1 text-gray-700 bg-gray-100 leading-tight focus:outline-none focus:shadow-outline"
              cols={30}
              rows={7}
            />
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <Card
              kiloPerSack={kiloPerSack}
              imageUrl={information.imageUrl}
              kilograms={socks}
              price={price}
              riceVariety={riceVariety}
              email={email}
              description={description}
            />
          </div>
        </section>
        <div className="flex items-center justify-end gap-4 mt-6">
          <Popconfirm
            title="Are you sure to edit this product?"
            onConfirm={(event) => onSubmit(event)}
          >
            <button className="w-24 h-8 bg-primary hover:bg-primary-slight text-white text-sm font-semibold rounded-sm focus:outline-none focus:shadow-outline ">
              Save
            </button>
          </Popconfirm>
        </div>
      </div>
    </Spin>
  );
};

export default UpdateProduct;
