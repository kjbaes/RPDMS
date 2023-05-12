import React, { useCallback, useState, useContext } from "react";
import { AuthContext } from "../../Context/auth";
import { RiceVarietyContext } from "../../Context/RiceVarietyProvider";
import RolesHooks from '../../lib/RolesHook'
import { app } from "../../config/firebase";
import { useDropzone } from "react-dropzone";
import { Textfield } from "../../components";
import { Trash } from "react-feather";
import { Spin } from "antd";
import swal from "sweetalert";

const information = {
  riceVariety: "",
  socks: "",
  price: "",
  kiloPerSack: 0,
  dateHarvested: null,
};

const Post = () => {
  const context = useContext(AuthContext);
  const { fetchVariety } = useContext(RiceVarietyContext);
  const [loading, setLoading] = useState(false);
  const [myFile, setMyFile] = useState([]);
  const [
    { riceVariety, socks, kiloPerSack, price, description, dateHarvested },
    setState,
  ] = useState(information);

  const { info } = RolesHooks();

  //put file in a state so that we have access to remove it
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (myFile.length > 0) {
        console.log("Invalid");
      } else {
        setMyFile([...myFile, ...acceptedFiles]);
      }
    },
    [myFile]
  );

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragAccept,
    isDragActive,
    isDragReject,
  } = useDropzone({ accept: "image/jpeg, image/png", onDrop });

  //*delete specific product item
  const handleDeleteFile = (file) => {
    const specific_file = [...file];
    specific_file.length > 0 && specific_file.splice(file, 1);
    setMyFile(specific_file);
  };

  //fetch file display as list
  const files = myFile.map((file) => {
    return (
      <li
        className="py-1 px-2 max-w-sm bg-blue-300 rounded mb-1"
        key={file.name}
      >
        <div className="flex items-center justify-between">
          <span className="text-white text-sm">
            {file.name} - {file.size}
          </span>
          <button type="button" onClick={() => handleDeleteFile(myFile)}>
            <Trash size="22" color="#FFF" className="cursor-pointer" />
          </button>
        </div>
      </li>
    );
  });

  const onChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  //*remove file from state
  const removeFile = () => {
    if (myFile) {
      const newFiles = [...myFile];
      newFiles.splice(newFiles.indexOf(files), 1);
      setMyFile(newFiles);
    }
  };

  const loadingState = () => setLoading(true);

  const clearState = () => {
    setState({ ...information });
    removeFile();
  };

  const onSubmit = (event) => {
    event.preventDefault();

    const date = new Date(dateHarvested);

    if (riceVariety === undefined || socks === "" || price === undefined || description === undefined || dateHarvested === null) {
      return swal({
        title: "Warning",
        text: `Some of the fields is empty :(`,
        icon: "warning",
        button: "Ok",
      });
    }

    loadingState();

    const document = app.firestore().collection("product").doc();

    acceptedFiles.map(async (file) => {
      if (file) {
        const storageRef = app.storage().ref();
        const fileRef = storageRef.child(`Product/${file.name}`);
        await fileRef.put(file);
        await fileRef.getDownloadURL().then((imageUrl) => {
          if (imageUrl) {
            document
              .set({
                uid: context.uid,
                riceVariety: riceVariety,
                email: context.email,
                socks: Number(socks),
                kiloPerSack: Number(kiloPerSack),
                price: Number(price),
                dateHarvested: date,
                dateHarvestedFormat: dateHarvested,
                description: description,
                imageUrl: imageUrl,
                farmerIncome: info.income === undefined ? 0 : info.income
              })
              .then(() => {
                setLoading(false);
                clearState();
                swal({
                  title: "Successfully",
                  text: `Successfully Posted `,
                  icon: "success",
                  button: "Ok",
                });
              });
          }
        });
      }
    });
  };

  return (
    <Spin spinning={loading}>
      <div className="max-w-5xl bg-white rounded-lg mx-auto w-full shadow-lg p-6">
        <h1 className="text-2xl font-bold">Post Bidding</h1>
        <section className="flex flex-col sm:flex-row justify-center gap-4">
          <div className="w-full md:w-1/2">
            <div className="flex items-center grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="mt-2">
                <label
                  className="block text-gray-700 text-sm font-semibold mb-2"
                  htmlFor="riceVariety"
                >
                  Palay Variety
                </label>
                <select
                  id="riceVariety"
                  name="riceVariety"
                  className=" block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={riceVariety}
                  onChange={(event) => onChange(event)}
                >
                  <option value=""></option>
                  {fetchVariety.map((variety) => (
                    <option value={variety.variety}>{variety.variety}</option>
                  ))}
                </select>
              </div>
              <Textfield
                value={context.email}
                readOnly={true}
                onChange={(event) => onChange(event)}
                label="Owner Email"
                type="email"
                placeholder="Owner Email"
                name="email"
              />
              <Textfield
                onChange={(event) => onChange(event)}
                value={dateHarvested}
                label="Date Harvested"
                type="date"
                placeholder="Date Harvested"
                name="dateHarvested"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Textfield
                value={socks}
                onChange={(event) => onChange(event)}
                label="Number of Sacks"
                type="number"
                placeholder="Sacks"
                name="socks"
              />
              <Textfield
                value={kiloPerSack}
                onChange={(event) => onChange(event)}
                label="Kilo Per Sacks"
                type="number"
                name="kiloPerSack"
              />
              <Textfield
                value={price}
                onChange={(event) => onChange(event)}
                label="Price"
                type="number"
                placeholder="Price"
                name="price"
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
          <div className="w-full md:w-1/2">
            <div className="mt-6">
              <div {...getRootProps({ className: "dropzone" })}>
                <div className="flex items-center justify-center bg-gray-100 py-44 border-dashed border-4 cursor-pointer">
                  <input {...getInputProps()} />
                  {!isDragActive && (
                    <p className="text-center text-gray-400">
                      Drag 'n' drop some image here, or click to select files
                    </p>
                  )}
                </div>
                <div className="mt-3">
                  {isDragAccept && (
                    <p className="text-center py-1 bg-green-500 rounded text-white">
                      You got it right brotho
                    </p>
                  )}
                  {isDragReject && (
                    <p className="text-center py-1 bg-red-500 rounded text-white">
                      This image is not allowed
                    </p>
                  )}
                </div>
              </div>
              <aside className="mt-2">
                <h4>Files</h4>
                <ul>{files}</ul>
              </aside>
            </div>
          </div>
        </section>
        <div className="flex items-center justify-end gap-4 mt-6">
          <button
            onClick={() => clearState()}
            className="w-24 h-8 border border-primary bg-gray-100 hover:bg-gray-200 text-black text-sm rounded-sm focus:outline-none focus:shadow-outline "
          >
            Cancel
          </button>
          <button
            onClick={(event) => onSubmit(event)}
            className="w-24 h-8 bg-primary hover:bg-primary-slight text-white text-sm font-semibold rounded-sm focus:outline-none focus:shadow-outline "
          >
            Save
          </button>
        </div>
      </div>
    </Spin>
  );
};

export default Post;
